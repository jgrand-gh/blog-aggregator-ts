import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { User, users, feeds, feedFollows, Feed, posts } from "../schema";

export async function createUser(name: string) {
    const [result] = await db
        .insert(users)
        .values({ name: name })
        .returning();
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

export async function getUserById(id: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
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

export async function createFeed(feedName: string, feedUrl: string, userId: string) {
    const [result] = await db
        .insert(feeds)
        .values({ name: feedName, url: feedUrl, userId: userId })
        .returning();
    return result;
}

export async function getFeedByUrl(feedUrl: string) {
    const [result] = await db
        .select()
        .from(feeds)
        .where(eq(feeds.url, feedUrl));
    return result;
}

export async function getFeeds() {
    const result = await db
        .select()
        .from(feeds);
    return result;
}

export async function markFeedFetched(feedId: string) {
    const [result] = await db
        .update(feeds)
        .set({ lastFetchedAt: new Date() })
        .where(eq(feeds.id, feedId))
        .returning();
    return result;
}

export async function getNextFeedToFetch() {
    const [result] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1);
    return result;
}

export async function deleteFeeds() {
    await db
        .delete(feeds);
}

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({ userId: userId, feedId: feedId })
        .returning();

    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFeedFollow.id));

    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db
        .select({
            id: feedFollows.id,
            feedName: feeds.name,
            feedUrl: feeds.url,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId));
    return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, userId),
                eq(feedFollows.feedId, feedId)
            )
        )
        .returning()

    return result;
}

export async function createPost(postTitle: string, postURL: string, publishedAt: Date, feedId: string, description?: string) {
    const [result] = await db
        .insert(posts)
        .values({ title: postTitle, url: postURL, description: description, publishedAt: publishedAt, feedId: feedId })
        .returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db
        .select({
            id: posts.id,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
        })
        .from(posts)
        .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
    return result;
}