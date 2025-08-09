import { sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(sql`lower(${users.name}) = lower(${sql.placeholder("name")})`)
        .execute({ name });
    return result;
}