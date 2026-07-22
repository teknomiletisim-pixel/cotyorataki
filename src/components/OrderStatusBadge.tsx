// Sipariş durumuna göre renk ve stil belirleyen ortak bileşen.
// Sepetim, Hesabım, Kargom Nerede ve Admin panelinde tutarlı görünüm sağlar.

const STATUS_STYLES: Record<string, string> = {
  "Beklemede": "bg-neutral-100 text-neutral-600",
  "Onaylandı": "bg-blue-100 text-blue-700",
  "Hazırlanıyor": "bg-amber-100 text-amber-700",
  "Yolda": "bg-purple-100 text-purple-700",
  "Teslim Edildi": "bg-green-100 text-green-700",
  "İptal Edildi": "bg-rose-100 text-rose-700",
};

export default function OrderStatusBadge({ status }: { status?: string | null }) {
  const label = status ?? "Beklemede";
  const style = STATUS_STYLES[label] ?? "bg-neutral-100 text-neutral-600";

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${style}`}>
      {label}
    </span>
  );
}
