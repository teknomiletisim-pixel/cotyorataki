ALTER TABLE "special_days" ADD COLUMN "discount_rate" numeric(4, 3) DEFAULT '0.10' NOT NULL;--> statement-breakpoint
ALTER TABLE "special_days" ADD COLUMN "banner_message" text NOT NULL;--> statement-breakpoint
ALTER TABLE "special_days" ADD COLUMN "banner_image" text;--> statement-breakpoint
ALTER TABLE "special_days" ADD COLUMN "active" boolean DEFAULT true NOT NULL;