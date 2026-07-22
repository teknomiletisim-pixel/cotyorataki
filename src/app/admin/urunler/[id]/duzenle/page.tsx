"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<ProductFormValues> | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((all: Array<Record<string, unknown>>) => {
        const p = all.find((x) => String(x.id) === params.id);
        if (p) {
          setInitialValues({
            name: p.name as string,
            category: p.category as string,
            description: (p.description as string) ?? "",
            images: (p.images as string[]) ?? [""],
            goldGrams: Number(p.goldGrams),
            laborCost: p.laborCost as number,
            bestSeller: !!p.bestSeller,
            isNew: !!p.isNew,
            allowCustomMessage: !!p.allowCustomMessage,
            customizationFields:
              (p.customizationFields as ProductFormValues["customizationFields"]) ?? [],
          });
        }
      });
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Bu ürünü kataloğdan kaldırmak istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/products/${params.id}`, { method: "DELETE" });
    router.push("/admin/urunler");
    router.refresh();
  }

  if (!initialValues) return <p className="text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-neutral-900 mb-6">Ürünü Düzenle</h1>
      <ProductForm
        initialValues={initialValues}
        submitUrl={`/api/admin/products/${params.id}`}
        method="PATCH"
        onDeleted={handleDelete}
      />
    </div>
  );
}
