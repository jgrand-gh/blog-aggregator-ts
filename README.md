# Blog Aggregator CLI

This project is a simple command-line blog/RSS aggregator built with TypeScript. Register users, add and follow feeds, aggregate posts, and browse the latest content—all from your terminal!

## Features

- Register and login users
- Add new RSS feeds and follow/unfollow them
- Aggregate and scrape posts from followed feeds
- Browse latest posts from followed feeds
- List users, feeds, and followed feeds
- Command-based CLI interface

## Requirements

- Node.js 22.15.0 or newer (see [.nvmrc](.nvmrc))
- TypeScript (see [package.json](package.json))
- PostgreSQL database (configured via `~/.gatorconfig.json`)

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Build the project:**
   ```sh
   npm run build
   ```
4. **Configure your database:**
   - Create a `~/.gatorconfig.json` file with the following structure:
     ```json
     {
       "db_url": "postgres://user:password@localhost:5432/dbname",
       "current_user_name": ""
     }
     ```
5. **Run migrations:**
   ```sh
   npm run migrate
   ```
6. **Start the CLI:**
   ```sh
   npm start -- <command> [args...]
   ```

## Commands

- `login <user_name>` — Set the current user
- `register <user_name>` — Register a new user and set as current
- `reset` — Delete all users and feeds (dangerous!)
- `users` — List all users (current user marked)
- `agg <interval>` — Start the feed aggregator (e.g., `agg 10s`)
- `addfeed <feed_name> <url>` — Add a new feed and follow it (logged-in user)
- `feeds` — List all feeds
- `follow <url>` — Follow a feed by URL (logged-in user)
- `following` — List feeds you are following (logged-in user)
- `unfollow <url>` — Unfollow a feed by URL (logged-in user)
- `browse [limit]` — Show latest posts from followed feeds (logged-in user, default limit: 2)

## Project Structure

- [`src/index.ts`](src/index.ts) — Entry point, command dispatch
- [`src/commands.ts`](src/commands.ts) — Command handlers
- [`src/command_registry.ts`](src/command_registry.ts) — Command registration and execution
- [`src/middleware.ts`](src/middleware.ts) — Middleware for command handlers (e.g., login checks)
- [`src/config.ts`](src/config.ts) — Config file reading/writing
- [`src/helpers.ts`](src/helpers.ts) — Utility functions (duration parsing, formatting, etc.)
- [`src/lib/rss_manager.ts`](src/lib/rss_manager.ts) — RSS fetching, parsing, and scraping logic
- [`src/lib/db/schema.ts`](src/lib/db/schema.ts) — Database schema definitions (Drizzle ORM)
- [`src/lib/db/index.ts`](src/lib/db/index.ts) — Database connection setup
- [`src/lib/db/queries/queries.ts`](src/lib/db/queries/queries.ts) — Database query functions

## Migrations

- SQL migrations and snapshots are in [`src/lib/db/migrations/`](src/lib/db/migrations/)

## License

This project is for educational purposes as part of a Boot.dev learning module.