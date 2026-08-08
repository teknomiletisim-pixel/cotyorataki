export default function LegalPageLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-white mb-2">{title}</h1>
      {updatedAt && (
        <p className="text-xs text-neutral-400 mb-8">Son güncelleme: {updatedAt}</p>
      )}
      <div className="prose prose-neutral prose-sm sm:prose-base max-w-none text-neutral-300 leading-relaxed space-y-4 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
