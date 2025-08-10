import { sql } from "drizzle-orm";
import { db } from "..";
import { User, users, feeds } from "../schema";

export async function createUser(name: string) {
    const [result] = await db
        .insert(users)
        .values({ name: name })
        .returning();
    return result;
}

export async function getUser(name: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(sql`lower(${users.name}) = lower(${sql.placeholder("name")})`)
        .execute({ name });
    return result;
}

export async function getUsers() {
    const result = await db
        .select()
        .from(users);
    return result;
}

export async function deleteUsers() {
    await db
        .delete(users);
}

export async function createFeed(feedName: string, feedUrl: string, user: User) {
    const [result] = await db
        .insert(feeds)
        .values({ name: feedName, url: feedUrl, userId: user.id })
        .returning();
    return result;
}