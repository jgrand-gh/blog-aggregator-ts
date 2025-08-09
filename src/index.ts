import { CommandsRegistry, registerCommand, runCommand, handlerLogin } from "./commands";

function main() {
    if (process.argv.length <= 2) {
        console.error("Not enough arguments were provided");
        process.exit(1);
    }

    const [command, ...args] = process.argv.slice(2);

    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    try {
        runCommand(registry, command, ...args);
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Error running "${command}": ${(e as Error).message}`);
        } else {
            console.error(`Error running "${command}": ${e}`);
        }
        process.exit(1);
    }
}

main();