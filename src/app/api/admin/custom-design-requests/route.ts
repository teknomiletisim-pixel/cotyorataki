import { NextResponse } from "next/server";
import { db } from "@/db";
import { customDesignRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db
    .select()
    .from(customDesignRequests)
    .orderBy(desc(customDesignRequests.createdAt));
  return NextResponse.json(all);
}
