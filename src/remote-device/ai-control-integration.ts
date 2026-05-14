import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'url';
import { captureRemote } from '../utils/capture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface McpConfig {
    command: string;
    args: string[];
    cwd?: string;
    env?: Record<string, string>;
}

export class AiControlIntegration {
    private mcpClient: Client | null = null;
    private mcpTransport: StdioClientTransport | null = null;
    private isReady: boolean = false;

    async initialize() {
        console.debug('[DEBUG] AiControlIntegration.initialize() called');
        const config = await this.resolveMcpConfig();

        if (!config) {
            console.debug('[DEBUG] No MCP config found');
            throw new Error('AI Control MCP not found. Please install it globally via `npm install -g ai-control` or build the local project.');
        }

        console.log(` - ⏳ Connecting to Local AI Control MCP using: ${config.command} ${config.args.join(' ')}`);
        console.debug('[DEBUG] MCP config:', JSON.stringify(config, null, 2));

        try {
            console.debug('[DEBUG] Creating StdioClientTransport');
            this.mcpTransport = new StdioClientTransport(config);

            // Create MCP client
            console.debug('[DEBUG] Creating MCP Client');
            this.mcpClient = new Client(
                {
                    name: "ai-control-client",
                    version: "1.0.0"
                },
                {
                    capabilities: {}
                }
            );

            console.debug('[DEBUG] Connecting to MCP server');
            await this.mcpClient.connect(this.mcpTransport);
            console.debug('[DEBUG] MCP Client connected successfully');
            this.isReady = true;
            console.log(' - ✅ Connected to Local AI Control MCP');
        } catch (error) {
            console.error('[DEBUG] Failed to connect to MCP server:', error);
            this.isReady = false;
            throw error;
        }
    }

    private async resolveMcpConfig(): Promise<McpConfig | null> {
        const configPriority = await this.findConfigs();
        for (const config of configPriority) {
            console.debug(` - Checking config: ${config.command} ${config.args.join(' ')}`);
            try {
                const exists = await this.commandExists(config.command);
                if (exists) {
                    console.debug(' - Found valid config');
                    return config;
                }
            } catch (error) {
                console.debug(` - Config failed: ${error}`);
            }
        }
        return null;
    }

    private async findConfigs(): Promise<McpConfig[]> {
        const configs: McpConfig[] = [];

        const isDev = __dirname.includes('src') || __dirname.includes('dist');
        const projectRoot = isDev
            ? path.resolve(__dirname, '..', '..')
            : path.resolve(__dirname, '..', '..', '..');

        // First priority: local checkout (dev mode)
        configs.push({
            command: 'node',
            args: [path.join(projectRoot, 'dist', 'index.js')],
        });

        // Second priority: npx
        configs.push({
            command: 'npx',
            args: ['-y', 'ai-control'],
        });

        // Third priority: global command
        const commandName = 'ai-control';
        configs.push({
            command: commandName,
            args: [],
        });

        return configs;
    }

    private async commandExists(command: string): Promise<boolean> {
        try {
            console.debug(` - Testing command: ${command}`);
            const result = await new Promise<{ code: number | null, stdout: string }>((resolve, reject) => {
                const proc = spawn('which', [command], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 5000,
                });

                let stdout = '';
                proc.stdout.on('data', (data: Buffer) => {
                    stdout += data.toString();
                });

                proc.on('close', (code) => {
                    resolve({ code, stdout: stdout.trim() });
                });

                proc.on('error', (err) => {
                    reject(err);
                });
            });

            if (result.code === 0 && result.stdout) {
                console.debug(' - Found global ai-control CLI');
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    async listTools(): Promise<Array<{ name: string; description?: string; inputSchema?: any }>> {
        if (!this.isReady || !this.mcpClient) {
            throw new Error('AI Control MCP not connected');
        }
        const result = await this.mcpClient.listTools();
        return result.tools;
    }

    async callTool(toolName: string, args: Record<string, any>): Promise<any> {
        if (!this.isReady || !this.mcpClient) {
            throw new Error('AI Control MCP not connected');
        }
        captureRemote('remote_call_tool', { tool_name: toolName });
        const result = await this.mcpClient.callTool({
            name: toolName,
            arguments: args,
        });
        return result;
    }

    // Alias for device.ts compatibility
    async listClientTools(): Promise<Array<{ name: string; description?: string; inputSchema?: any }>> {
        return this.listTools();
    }

    // Alias for device.ts compatibility
    async callClientTool(toolName: string, args: Record<string, any>, _metadata?: any): Promise<any> {
        return this.callTool(toolName, args);
    }

    isConnected(): boolean {
        return this.isReady;
    }

    async shutdown() {
        console.debug('[DEBUG] AiControlIntegration.shutdown() called');
        this.isReady = false;
        if (this.mcpTransport) {
            try {
                await this.mcpTransport.close();
            } catch (error) {
                console.debug('[DEBUG] Error closing transport:', error);
            }
            this.mcpTransport = null;
        }
        this.mcpClient = null;
    }
}
