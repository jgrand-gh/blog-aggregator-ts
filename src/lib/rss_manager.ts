import { XMLParser } from "fast-xml-parser";
import { Feed, User } from "./db/schema";
import { getFeeds } from "./db/queries/queries";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedUrl: string) {
    const response = await fetch(feedUrl, {
        headers: {
            "User-Agent": "gator",
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser();
    const jsObj = parser.parse(xml);

    if (!jsObj.rss.channel) {
        throw new Error("Channel field does not exist, cannot parse RSS feed");
    }

    if (!jsObj.rss.channel.title || !jsObj.rss.channel.link || !jsObj.rss.channel.description) {
        throw new Error("One or more of the RSS channel fields are missing, cannot parse RSS feed");
    }

    const rssFeed: RSSFeed = {
        channel: {
            title: jsObj.rss.channel.title,
            link: jsObj.rss.channel.link,
            description: jsObj.rss.channel.description,
            item: [],
        }
    }

    const chanItem = jsObj.rss.channel.item || [];
    const items = Array.isArray(chanItem) ? chanItem: [chanItem];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }
        const rssItem: RSSItem = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        };

        rssFeed.channel.item.push(rssItem);
    }

    return rssFeed;
}

export async function printFeed(feed: Feed, user: User) {
    console.log(` id: ${feed.id}`);
    console.log(` createdAt: ${feed.createdAt}`);
    console.log(` updatedAt: ${feed.updatedAt}`);
    console.log(` name: ${feed.name}`);
    console.log(` url: ${feed.url}`);
    console.log(` name: ${user.name}`);
}