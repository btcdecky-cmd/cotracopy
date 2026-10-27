import { integer, pgEnum, pgTable, real, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export const tokens = pgTable("tokens", {
  mint: varchar("mint", { length: 44 }).primaryKey(),
  name: text("name"),
  symbol: varchar("symbol", { length: 32 }),
  logoUrl: text("logo_url"),
  decimals: integer("decimals"),
  tokenStandard: varchar("token_standard", { length: 32 }),
  metadataUri: text("metadata_uri"),
  updateAuthority: varchar("update_authority", { length: 44 }),
  metadataMutable: integer("metadata_mutable"),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pools = pgTable("pools", {
  address: varchar("address", { length: 128 }).primaryKey(),
  venue: varchar("venue", { length: 64 }).notNull(),
  baseMint: varchar("base_mint", { length: 44 }).notNull(),
  quoteMint: varchar("quote_mint", { length: 44 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  lastObservedAt: timestamp("last_observed_at", { withTimezone: true }),
}, table => ({ baseMintIdx: uniqueIndex("pools_address_base_mint_idx").on(table.address, table.baseMint) }));

export const marketObservations = pgTable("market_observations", {
  id: uuid("id").defaultRandom().primaryKey(),
  mint: varchar("mint", { length: 44 }).notNull(),
  poolAddress: varchar("pool_address", { length: 128 }),
  source: varchar("source", { length: 64 }).notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  priceUsd: real("price_usd"),
  priceSol: real("price_sol"),
  liquidityUsd: real("liquidity_usd"),
  volume24hUsd: real("volume_24h_usd"),
  buys24h: integer("buys_24h"),
  sells24h: integer("sells_24h"),
  rawPayload: text("raw_payload"),
});

export const walletSnapshots = pgTable("wallet_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: varchar("address", { length: 44 }).notNull(),
  mint: varchar("mint", { length: 44 }).notNull(),
  amount: text("amount").notNull(),
  decimals: integer("decimals"),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
});

export const chainTransactions = pgTable("chain_transactions", {
  signature: varchar("signature", { length: 128 }).primaryKey(),
  walletAddress: varchar("wallet_address", { length: 44 }),
  slot: text("slot").notNull(),
  blockTime: timestamp("block_time", { withTimezone: true }),
  commitment: varchar("commitment", { length: 16 }).notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  rawPayload: text("raw_payload"),
  observedAt: timestamp("observed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const walletWatchlists = pgTable("wallet_watchlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull(),
  address: varchar("address", { length: 44 }).notNull(),
  label: varchar("label", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ userAddressIdx: uniqueIndex("wallet_watchlists_user_address_idx").on(table.userId, table.address) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
