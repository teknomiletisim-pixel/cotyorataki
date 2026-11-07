import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { db } from "../src/db";
import { products, settings, users } from "../src/db/schema";
import { products as sampleProducts } from "../src/lib/products";
import { DEFAULT_GOLD_PRICE_PER_GRAM } from "../src/lib/pricing";

async function main() {
  console.log("Seed başlıyor...");

  // 1) Örnek ürünler
  for (const p of sampleProducts) {
    await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        category: p.category,
        description: p.description,
        images: p.images,
        goldGrams: p.goldGrams.toString(),
        laborCost: p.laborCost,
        bestSeller: !!p.bestSeller,
        isNew: !!p.isNew,
        customizationFields: p.customization,
        allowCustomMessage: !!p.allowCustomMessage,
      })
      .onConflictDoNothing({ target: products.slug });
  }
  console.log(`${sampleProducts.length} ürün eklendi (varsa atlandı).`);

  // 2) Güncel gram altın fiyatı ayarı
  await db
    .insert(settings)
    .values({ key: "gold_price_per_gram", value: String(DEFAULT_GOLD_PRICE_PER_GRAM) })
    .onConflictDoNothing({ target: settings.key });
  console.log("Gram altın fiyatı ayarı eklendi.");

  // 3) Admin hesabı (.env.local içindeki ADMIN_EMAIL / ADMIN_PASSWORD ile)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db
      .insert(users)
      .values({
        email: adminEmail,
        passwordHash,
        firstName: process.env.ADMIN_FIRST_NAME ?? "Yönetici",
        lastName: process.env.ADMIN_LAST_NAME ?? "",
        role: "admin",
      })
      .onConflictDoNothing({ target: users.email });
    console.log(`Admin hesabı hazır: ${adminEmail}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD tanımlı değil, admin hesabı oluşturulmadı.");
  }

  console.log("Seed tamamlandı.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
