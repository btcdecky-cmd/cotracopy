CREATE TYPE "public"."user_role" AS ENUM ('user', 'admin');
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "open_id" varchar(128) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "login_method" varchar(64),
  "role" "user_role" DEFAULT 'user' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "last_signed_in" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "tokens" (
  "mint" varchar(44) PRIMARY KEY NOT NULL,
  "name" text,
  "symbol" varchar(32),
  "logo_url" text,
  "decimals" integer,
  "token_standard" varchar(32),
  "metadata_uri" text,
  "update_authority" varchar(44),
  "metadata_mutable" integer,
  "first_seen_at" timestamptz,
  "last_seen_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "pools" (
  "address" varchar(128) PRIMARY KEY NOT NULL,
  "venue" varchar(64) NOT NULL,
  "base_mint" varchar(44) NOT NULL,
  "quote_mint" varchar(44),
  "created_at" timestamptz,
  "last_observed_at" timestamptz
);
CREATE TABLE IF NOT EXISTS "market_observations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "mint" varchar(44) NOT NULL,
  "pool_address" varchar(128),
  "source" varchar(64) NOT NULL,
  "observed_at" timestamptz NOT NULL,
  "price_usd" real,
  "price_sol" real,
  "liquidity_usd" real,
  "volume_24h_usd" real,
  "buys_24h" integer,
  "sells_24h" integer,
  "raw_payload" text
);
CREATE TABLE IF NOT EXISTS "wallet_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "address" varchar(44) NOT NULL,
  "mint" varchar(44) NOT NULL,
  "amount" text NOT NULL,
  "decimals" integer,
  "observed_at" timestamptz NOT NULL,
  "source" varchar(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS "chain_transactions" (
  "signature" varchar(128) PRIMARY KEY NOT NULL,
  "wallet_address" varchar(44),
  "slot" text NOT NULL,
  "block_time" timestamptz,
  "commitment" varchar(16) NOT NULL,
  "status" varchar(16) NOT NULL,
  "source" varchar(64) NOT NULL,
  "raw_payload" text,
  "observed_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "wallet_watchlists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" integer NOT NULL,
  "address" varchar(44) NOT NULL,
  "label" varchar(120),
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "wallet_watchlists_user_address_unique" UNIQUE("user_id", "address")
);
CREATE INDEX IF NOT EXISTS "market_observations_mint_observed_idx" ON "market_observations" ("mint", "observed_at");
CREATE INDEX IF NOT EXISTS "wallet_snapshots_address_observed_idx" ON "wallet_snapshots" ("address", "observed_at");
CREATE INDEX IF NOT EXISTS "chain_transactions_wallet_observed_idx" ON "chain_transactions" ("wallet_address", "observed_at");
