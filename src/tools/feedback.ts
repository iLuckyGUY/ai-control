import { ServerResult } from '../types.js';
import { usageTracker } from '../utils/usageTracker.js';
import { capture } from '../utils/capture.js';
import { configManager } from '../config-manager.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

interface FeedbackParams {
  // No user parameters - form will be filled manually
  // Only auto-filled usage statistics remain
}

/**
 * Open feedback form in browser with optional pre-filled data
 */
export async function giveFeedback(params: FeedbackParams = {}): Promise<ServerResult> {
  try {
    const stats = await usageTracker.getStats();
    
    await capture('feedback_tool_called', {
      total_calls: stats.totalToolCalls,
      successful_calls: stats.successfulCalls,
      failed_calls: stats.failedCalls,
      days_since_first_use: Math.floor((Date.now() - stats.firstUsed) / (1000 * 60 * 60 * 24)),
      total_sessions: stats.totalSessions,
      platform: os.platform(),
    });
    
    const tallyUrl = await buildTallyUrl(params, stats);
    const success = await openUrlInBrowser(tallyUrl);
    
    if (success) {
      await capture('feedback_form_opened_successfully', {
        total_calls: stats.totalToolCalls,
        platform: os.platform()
      });
      
      await usageTracker.markFeedbackGiven();
      
      return {
        content: [{
          type: "text",
          text: `🎉 **Feedback form opened in your browser!**\n\n` +
                `Thank you for your feedback on AI Control! ` +
                `Your input helps improve the tool for everyone.\n\n` +
                `**Form URL**: ${tallyUrl.length > 100 ? tallyUrl.substring(0, 100) + '...' : tallyUrl}`
        }]
      };
    } else {
      await capture('feedback_form_open_failed', {
        total_calls: stats.totalToolCalls,
        platform: os.platform(),
        error_type: 'browser_open_failed'
      });
      
      return {
        content: [{
          type: "text",
          text: `⚠️ **Couldn't open browser automatically**\n\n` +
                `Please copy this URL into your browser:\n\n` +
                `${tallyUrl}`
        }]
      };
    }
    
  } catch (error) {
    await capture('feedback_tool_error', {
      error_message: error instanceof Error ? error.message : String(error),
      error_type: error instanceof Error ? error.constructor.name : 'unknown'
    });
    
    return {
      content: [{
        type: "text",
        text: `❌ **Error opening feedback form**: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Build Tally.so URL with pre-filled parameters
 */
async function buildTallyUrl(params: FeedbackParams, stats: any): Promise<string> {
  const baseUrl = 'https://tally.so/r/mKqoKg';
  const urlParams = new URLSearchParams();
  
  // Only auto-filled hidden fields remain
  urlParams.set('tool_call_count', stats.totalToolCalls.toString());
  
  // Calculate days using
  const daysUsing = Math.floor((Date.now() - stats.firstUsed) / (1000 * 60 * 60 * 24));
  urlParams.set('days_using', daysUsing.toString());
  
  // Add platform info
  urlParams.set('platform', os.platform());
  
  // Add client_id from analytics config
  try {
    const clientId = await configManager.getValue('clientId') || 'unknown';
    urlParams.set('client_id', clientId);
  } catch (error) {
    // Fallback if config read fails
    urlParams.set('client_id', 'unknown');
  }
  
  return `${baseUrl}?${urlParams.toString()}`;
}

/**
 * Open URL in default browser (cross-platform)
 */
async function openUrlInBrowser(url: string): Promise<boolean> {
  try {
    const platform = os.platform();
    
    let command: string;
    switch (platform) {
      case 'darwin':  // macOS
        command = `open "${url}"`;
        break;
      case 'win32':   // Windows
        command = `start "" "${url}"`;
        break;
      default:        // Linux and others
        command = `xdg-open "${url}"`;
        break;
    }
    
    await execAsync(command);
    return true;
  } catch (error) {
    console.error('Failed to open browser:', error);
    return false;
  }
}
