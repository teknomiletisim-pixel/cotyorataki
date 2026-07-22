CREATE TABLE "special_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"month" integer NOT NULL,
	"day" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
