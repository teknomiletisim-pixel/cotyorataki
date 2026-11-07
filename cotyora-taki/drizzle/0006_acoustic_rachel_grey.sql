CREATE TABLE "custom_design_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(150) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"description" text NOT NULL,
	"media" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'Beklemede' NOT NULL,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_design_requests" ADD CONSTRAINT "custom_design_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;