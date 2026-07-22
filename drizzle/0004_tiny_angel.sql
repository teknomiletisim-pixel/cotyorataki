CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"type" varchar(20) NOT NULL,
	"reason" text NOT NULL,
	"contact_phone" varchar(30),
	"status" varchar(20) DEFAULT 'Beklemede' NOT NULL,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;