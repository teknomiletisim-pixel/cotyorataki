import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json(all);
}

function slugify(name: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return name
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    category,
    description,
    images,
    goldGrams,
    laborCost,
    bestSeller,
    isNew,
    customizationFields,
    allowCustomMessage,
  } = body as {
    name: string;
    category: string;
    description?: string;
    images: string[];
    goldGrams: number;
    laborCost: number;
    bestSeller?: boolean;
    isNew?: boolean;
    customizationFields?: { key: string; label: string; placeholder?: string }[];
    allowCustomMessage?: boolean;
  };

  if (!name || !category || !images?.length || goldGrams == null || laborCost == null) {
    return NextResponse.json({ error: "Eksik alanlar var." }, { status: 400 });
  }

  const baseSlug = slugify(name);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const [created] = await db
    .insert(products)
    .values({
      slug,
      name,
      category,
      description: description ?? "",
      images,
      goldGrams: String(goldGrams),
      laborCost,
      bestSeller: !!bestSeller,
      isNew: !!isNew,
      customizationFields: customizationFields ?? [],
      allowCustomMessage: !!allowCustomMessage,
    })
    .returning();

  return NextResponse.json(created);
}
