import { exec } from 'child_process';
import { promisify } from 'util';
import { ServerResult } from '../types.js';

const execAsync = promisify(exec);

const DEFAULT_TIMEOUT = 60000;
const MACOS_PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';

export async function runAppleScript(script: string): Promise<string> {
  const escaped = script.replace(/'/g, "'\"'\"'");
  const { stdout } = await execAsync(
    `osascript -e '${escaped}'`,
    { timeout: DEFAULT_TIMEOUT }
  );
  return stdout.trim() || '(no output)';
}

export async function runDockerCommand(command: string, cwd?: string): Promise<string> {
  const cmd = command.startsWith('compose')
    ? `docker ${command}`
    : command.startsWith('docker')
      ? command
      : `docker ${command}`;

  const { stdout, stderr } = await execAsync(cmd, {
    cwd: cwd || process.env.HOME || '/',
    timeout: DEFAULT_TIMEOUT,
    maxBuffer: 50000,
    env: { ...process.env, PATH: MACOS_PATH }
  });
  return [stdout, stderr].filter(Boolean).join('\n').trim() || '(no output)';
}

export async function getSystemInfo(): Promise<string> {
  const [uptime, memory, disk, cpu] = await Promise.all([
    execAsync('uptime').then(r => r.stdout.trim()),
    execAsync('vm_stat | head -5').then(r => r.stdout.trim()),
    execAsync('df -h /').then(r => r.stdout.trim()),
    execAsync('sysctl -n machdep.cpu.brand_string').then(r => r.stdout.trim()),
  ]);

  return [
    `CPU: ${cpu}`,
    `Uptime: ${uptime}`,
    '',
    'Memory:',
    memory,
    '',
    'Disk:',
    disk,
  ].join('\n');
}
