CREATE TYPE "public"."gamestatus" AS ENUM('pending', 'ongoing', 'ended');--> statement-breakpoint
CREATE TYPE "public"."playerstatus" AS ENUM('active', 'idle', 'winner');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" varchar,
	"round_number" integer NOT NULL,
	"capital_holder_id" text,
	"eliminated_player_id" text,
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pairs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "pairs" CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "current_round" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "player_status" "playerstatus" DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "has_capital" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "eliminated_in_round" integer;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "game_status" "gamestatus" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "prize_pool" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "current_capital_holder_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_capital_holder_id_players_id_fk" FOREIGN KEY ("capital_holder_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_eliminated_player_id_players_id_fk" FOREIGN KEY ("eliminated_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN IF EXISTS "playerStatus";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN IF EXISTS "blockchain";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "roomStatus";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "entry_price";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "transaction_id";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "human_touch";--> statement-breakpoint
DROP TYPE "public"."caseTypes";--> statement-breakpoint
DROP TYPE "public"."pairStsatus";--> statement-breakpoint
DROP TYPE "public"."playerSstatus";--> statement-breakpoint
DROP TYPE "public"."roomstatus";