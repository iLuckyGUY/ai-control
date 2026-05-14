/**
 * Centralized logging utility for AI Control
 * Ensures all logging goes through proper channels based on initialization state
 */

import type { FilteredStdioServerTransport } from '../custom-stdio.js';

// Global reference to the MCP transport (set in index.ts)
declare global {
  var mcpTransport: FilteredStdioServerTransport | undefined;
}

export type LogLevel = 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug';

/**
 * Log a message using the appropriate method based on MCP initialization state
 */
export function log(level: LogLevel, message: string, data?: any): void {
  try {
    if (global.mcpTransport) {
      global.mcpTransport.sendLog(level, message, data);
    } else {
      const notification = {
        jsonrpc: "2.0" as const,
        method: "notifications/message",
        params: {
          level: level,
          logger: "ai-control",
          data: data ? { message, ...data } : message
        }
      };
      process.stdout.write(JSON.stringify(notification) + '\n');
    }
  } catch (error) {
    const notification = {
      jsonrpc: "2.0" as const,
      method: "notifications/message",
      params: {
        level: "error",
        logger: "ai-control",
        data: `[LOG-ERROR] Failed to log message: ${message}`
      }
    };
    process.stdout.write(JSON.stringify(notification) + '\n');
  }
}

export const logger = {
  emergency: (message: string, data?: any) => log('emergency', message, data),
  alert: (message: string, data?: any) => log('alert', message, data),
  critical: (message: string, data?: any) => log('critical', message, data),
  error: (message: string, data?: any) => log('error', message, data),
  warning: (message: string, data?: any) => log('warning', message, data),
  notice: (message: string, data?: any) => log('notice', message, data),
  info: (message: string, data?: any) => log('info', message, data),
  debug: (message: string, data?: any) => log('debug', message, data),
};

export function logToStderr(level: LogLevel, message: string): void {
  const notification = {
    jsonrpc: "2.0" as const,
    method: "notifications/message",
    params: {
      level: level,
      logger: "ai-control",
      data: message
    }
  };
  process.stdout.write(JSON.stringify(notification) + '\n');
}
