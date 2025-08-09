import { CommandsRegistry, registerCommand, runCommand, handlerLogin, handlerRegister } from "./commands";

async function main() {
    if (process.argv.length <= 2) {
        console.error("Not enough arguments were provided");
        process.exit(1);
    }

    const [command, ...args] = process.argv.slice(2);

    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);

    try {
        await runCommand(registry, command, ...args);
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