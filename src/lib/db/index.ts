import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig } from "../../config";

const conn = postgres(readConfig().dbUrl);
export const db = drizzle(conn, { schema });