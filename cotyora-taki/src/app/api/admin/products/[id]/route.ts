import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    active,
  } = body as Partial<{
    name: string;
    category: string;
    description: string;
    images: string[];
    goldGrams: number;
    laborCost: number;
    bestSeller: boolean;
    isNew: boolean;
    customizationFields: { key: string; label: string; placeholder?: string }[];
    allowCustomMessage: boolean;
    active: boolean;
  }>;

  const updateValues: Record<string, unknown> = {};
  if (name !== undefined) updateValues.name = name;
  if (category !== undefined) updateValues.category = category;
  if (description !== undefined) updateValues.description = description;
  if (images !== undefined) updateValues.images = images;
  if (goldGrams !== undefined) updateValues.goldGrams = String(goldGrams);
  if (laborCost !== undefined) updateValues.laborCost = laborCost;
  if (bestSeller !== undefined) updateValues.bestSeller = bestSeller;
  if (isNew !== undefined) updateValues.isNew = isNew;
  if (customizationFields !== undefined) updateValues.customizationFields = customizationFields;
  if (allowCustomMessage !== undefined) updateValues.allowCustomMessage = allowCustomMessage;
  if (active !== undefined) updateValues.active = active;

  const [updated] = await db
    .update(products)
    .set(updateValues)
    .where(eq(products.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

// Ürünler kalıcı olarak silinmez (geçmiş siparişlerdeki referanslar bozulmasın diye);
// "active" alanı false yapılarak katalogdan gizlenir.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [updated] = await db
    .update(products)
    .set({ active: false })
    .where(eq(products.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
