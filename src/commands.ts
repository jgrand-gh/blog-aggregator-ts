import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!registry[cmdName]) {
        throw new Error(`The provided command "${cmdName}" does not exist.`);
    }

    registry[cmdName](cmdName, ...args);
}

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Please provide a username to login");
    }

    const userName = args[0];
    setUser(userName);
    console.log(`User ${userName} has been set.`);
}