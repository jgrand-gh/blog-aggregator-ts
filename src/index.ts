import { readConfig, setUser } from "./config.js"

function main() {
    setUser("MrUser");
    console.log(readConfig());
}

main();