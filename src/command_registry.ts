type CommandHandler = (command: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, command: string, handler: CommandHandler) {
    registry[command] = handler;
}

export async function runCommand(registry: CommandsRegistry, command: string, ...args: string[]): Promise<void> {
    if (!registry[command]) {
        throw new Error(`The provided command "${command}" does not exist.`);
    }

    return registry[command](command, ...args);
}