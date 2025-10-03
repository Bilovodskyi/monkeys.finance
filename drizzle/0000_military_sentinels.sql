CREATE TYPE "public"."exchange" AS ENUM('binance', 'binanceus', 'bybit', 'okx', 'kraken', 'coinbase');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'paused');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "instance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"number_of_trades" integer DEFAULT 0,
	"exchange" "exchange" NOT NULL,
	"instrument" text NOT NULL,
	"strategy" text NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"number_of_instances" integer DEFAULT 0,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"notify_email" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	CONSTRAINT "user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exchange" "exchange" NOT NULL,
	"enc_key" text NOT NULL,
	"enc_secret" text NOT NULL,
	"enc_passphrase" text,
	"enc_meta" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_instances" (
	"user_id" uuid NOT NULL,
	"instance_id" uuid NOT NULL,
	CONSTRAINT "user_instances_user_id_instance_id_pk" PRIMARY KEY("user_id","instance_id")
);
--> statement-breakpoint
ALTER TABLE "instance" ADD CONSTRAINT "instance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_instances" ADD CONSTRAINT "user_instances_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_instances" ADD CONSTRAINT "user_instances_instance_id_instance_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_index" ON "instance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "strategy_and_instrument_index" ON "instance" USING btree ("strategy","instrument");