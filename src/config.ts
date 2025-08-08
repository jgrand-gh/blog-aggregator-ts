import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName: string,
};

export function setUser(userName: string) {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const data = fs.readFileSync(getConfigFilePath(), "utf-8" );
    const rawConfig = JSON.parse(data);
    return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    const data = JSON.stringify(rawConfig, null, 2);
    fs.writeFileSync(getConfigFilePath(), data);
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is missing from gatorconfig");
    }

    if (rawConfig.current_user_name && typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name is in the incorrect data format in gatorconfig");
    }

    const config = { dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name };

    return config as Config;
}