import { CommandsRegistry, registerCommand, runCommand } from "./command_registry";
import { handlerAddFeed, handlerAgg, handlerFeeds, handlerFollow, handlerFollowing, handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands";

async function main() {
    if (process.argv.length <= 2) {
        console.error("Not enough arguments were provided");
        process.exit(1);
    }

    const [command, ...args] = process.argv.slice(2);

    const cmdsRegistry: CommandsRegistry = {};
    registerCommand(cmdsRegistry, "login", handlerLogin);
    registerCommand(cmdsRegistry, "register", handlerRegister);
    registerCommand(cmdsRegistry, "reset", handlerReset);
    registerCommand(cmdsRegistry, "users", handlerUsers);
    registerCommand(cmdsRegistry, "agg", handlerAgg);
    registerCommand(cmdsRegistry, "addfeed", handlerAddFeed);
    registerCommand(cmdsRegistry, "feeds", handlerFeeds);
    registerCommand(cmdsRegistry, "follow", handlerFollow);
    registerCommand(cmdsRegistry, "following", handlerFollowing);

    try {
        await runCommand(cmdsRegistry, command, ...args);
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Error running "${command}": ${(e as Error).message}`);
        } else {
            console.error(`Error running "${command}": ${e}`);
        }
        process.exit(1);
    }

    process.exit(0);
}

main();