import { CommandHandler, UserCommandHandler } from "./command_registry";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/queries";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const currentUser = readConfig().currentUserName;
        if (!currentUser) {
            throw new Error("user is not logged in");
        }

        const user = await getUserByName(currentUser);
        if (!user) {
            throw new Error(`user "${currentUser}" could not be found`)
        }

        await handler(cmdName, user, ...args);
    };
}