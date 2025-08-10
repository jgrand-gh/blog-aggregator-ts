import { readConfig, setUser } from "./config";
import { createFeed, createUser, deleteUsers, getFeeds, getUserById, getUserByName, getUsers } from "./lib/db/queries/queries";
import { fetchFeed, printFeed } from "./lib/rss_manager";

export async function handlerLogin(command: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`usage: ${command} <user_name>`);
    }

    const userName = args[0];
    const userInDb = await getUserByName(userName);
    if (!userInDb) {
        throw new Error(`User "${userName}" doesn't exist in database`);
    }

    setUser(userInDb.name);
    console.log(`User "${userInDb.name}" has been set.`);
}

export async function handlerRegister(command: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`usage: ${command} <user_name>`);
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

export async function handlerReset(_: string) {
    try {
        await deleteUsers();
        console.log(`"Users" table was reset successfully`);
    } catch {
        console.log("Failed to reset the users table");
        process.exit(1);
    }
}

export async function handlerUsers(_: string) {
    const users = await getUsers();
    const loggedInUser = readConfig().currentUserName;

    for (const user of users) {
        user.name === loggedInUser ? console.log(`* ${user.name} (current)`) : console.log(`* ${user.name}`);
    }
}

export async function handlerAgg(command: string, ...args: string[]) {
    //if (args.length === 0) {
    //    throw new Error(`usage: ${command} <url>`);
    //}

    //const url = args[0];
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");

    console.dir(feed, { depth: null });
}

export async function handlerAddFeed(command: string, ...args: string[]) {
    if (args.length <= 1) {
        throw new Error(`usage: ${command} <feed_name> <url>`);
    }

    const currentUser = readConfig().currentUserName;
    const dbUser = await getUserByName(currentUser);

    if (!dbUser) {
        throw new Error(`User "${currentUser}" not found`);
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await createFeed(feedName, feedUrl, dbUser);
    if (!feed) {
        throw new Error("Feed creation failed");
    }

    console.log("Feed was created:");
    printFeed(feed, dbUser);
}

export async function handlerFeeds(_: string) {
    const feeds = await getFeeds();
    if (!feeds) {
        throw new Error("Failed to get feeds from database, or no feeds found");
    }

    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`failed to get user from database for feed ${feed.id}`);
        }

        printFeed(feed, user);
        console.log();
    }
}