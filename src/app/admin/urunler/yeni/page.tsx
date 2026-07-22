"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-neutral-900 mb-6">Yeni Ürün Ekle</h1>
      <ProductForm submitUrl="/api/admin/products" method="POST" />
    </div>
  );
}
