import { ServerResult } from '../types.js';
import {
  runAppleScript,
  runDockerCommand,
  getSystemInfo,
} from '../tools/macos.js';

export async function handleAppleScript(args: unknown): Promise<ServerResult> {
  const { script } = args as { script: string };
  try {
    const result = await runAppleScript(script);
    return { content: [{ type: 'text', text: result }] };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}

export async function handleDockerCommand(args: unknown): Promise<ServerResult> {
  const { command, cwd } = args as { command: string; cwd?: string };
  try {
    const result = await runDockerCommand(command, cwd);
    return { content: [{ type: 'text', text: result }] };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}

export async function handleSystemInfo(): Promise<ServerResult> {
  try {
    const info = await getSystemInfo();
    return { content: [{ type: 'text', text: info }] };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}
