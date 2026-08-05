"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}

function RedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/hesabim";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/giris");
      return;
    }

    if (session?.user?.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center text-neutral-400">
      Giriş yapılıyor, yönlendiriliyorsunuz...
    </div>
  );
}
