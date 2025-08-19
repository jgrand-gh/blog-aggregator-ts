import { pgTable, timestamp, uuid, text, foreignKey, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    lastFetchedAt: timestamp("last_fetched_at"),
});

export type Feed = typeof feeds.$inferSelect;

export const feedFollows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull(),
    feedId: uuid("feed_id").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "feed_follows_user_fk",
    }).onDelete("cascade"),
    foreignKey({
        columns: [table.feedId],
        foreignColumns: [feeds.id],
        name: "feed_follows_feed_fk"
    }).onDelete("cascade"),
    unique("unique_user_feed_follow").on(table.userId, table.feedId),
]);