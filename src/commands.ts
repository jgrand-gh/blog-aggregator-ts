import { setUser } from "./config";
import { createUser, getUserByName } from "./lib/db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    if (!registry[cmdName]) {
        throw new Error(`The provided command "${cmdName}" does not exist.`);
    }

    return registry[cmdName](cmdName, ...args);
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Please provide a username to login");
    }

    const userName = args[0];
    const userInDb = await getUserByName(userName);
    if (!userInDb) {
        throw new Error(`User "${userName}" doesn't exist in database`);
    }

    setUser(userInDb.name);
    console.log(`User "${userInDb.name}" has been set.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Please provide a username to register");
    }

    const userName = args[0];
    const userInDb = await getUserByName(userName);
    if (userInDb) {
        throw new Error(`User "${userName}" already exists in database`);
    }

    const user = await createUser(userName);
    setUser(userName);
    console.log(`User "${userName}" was created.`);
    console.log(`"${user.name}" (${user.id}) was created at ${user.createdAt} and last updated at ${user.updatedAt}`);
}