CREATE TYPE "public"."caseTypes" AS ENUM('SAFE', 'ELIMINATE');--> statement-breakpoint
CREATE TYPE "public"."pairStsatus" AS ENUM('pending', 'ongoing', 'ended');--> statement-breakpoint
CREATE TYPE "public"."playerSstatus" AS ENUM('active', 'idle');--> statement-breakpoint
CREATE TYPE "public"."roomstatus" AS ENUM('pending', 'ongoing', 'ended');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pairs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" varchar,
	"pairStatus" "pairStsatus" DEFAULT 'pending' NOT NULL,
	"player1_id" text,
	"player2_id" text,
	"case_holder_id" text,
	"caseType" "caseTypes" NOT NULL,
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"round_id" integer DEFAULT 1 NOT NULL,
	"winner_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" varchar,
	"name" text NOT NULL,
	"playerStatus" "playerSstatus" DEFAULT 'idle' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"wallet_address" text,
	"blockchain" text DEFAULT 'worldchain'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" varchar PRIMARY KEY NOT NULL,
	"roomStatus" "roomstatus" DEFAULT 'pending' NOT NULL,
	"current_round" integer DEFAULT 0 NOT NULL,
	"winner_id" text,
	"entry_price" integer DEFAULT 0 NOT NULL,
	"transaction_id" text,
	"human_touch" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_player1_id_players_id_fk" FOREIGN KEY ("player1_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_player2_id_players_id_fk" FOREIGN KEY ("player2_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_case_holder_id_players_id_fk" FOREIGN KEY ("case_holder_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_winner_id_players_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players" ADD CONSTRAINT "players_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
