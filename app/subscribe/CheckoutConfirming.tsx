"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAccessAction } from "@/lib/auth/actions";

/**
 * Shown right after a successful Stripe Checkout. Activation is driven by the
 * webhook (async), so we poll for access and forward to the app the moment the
 * subscription is active — instead of bouncing the just-paid user to the paywall.
 */
export default function CheckoutConfirming() {
  const router = useRouter();
  const [tries, setTries] = useState(0);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const { state } = await checkAccessAction();
        if (!active) return;
        if (state === "active") {
          router.replace("/app");
          return;
        }
        if (state === "unauthenticated") {
          router.replace("/login");
          return;
        }
      } catch {
        /* transient — keep polling */
      }
      if (active) setTries((t) => t + 1);
    };
    poll();
    const id = setInterval(poll, 2500);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [router]);

  const slow = tries > 10; // ~25s without activation

  return (
    <div className="relative z-10 mx-auto max-w-md text-center">
      <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center">
        <div className="ximo-ring-spin h-12 w-12 rounded-full" style={{ border: "2px solid transparent", borderTopColor: "var(--teal)", borderRightColor: "rgba(30,206,206,0.3)" }} />
      </div>
      <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Estamos confirmando tu pago</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
        Gracias por suscribirte a Ximo. Esto suele tomar unos segundos. Te llevaremos a tu dashboard automáticamente.
      </p>
      {slow && (
        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
          Está tardando un poco más de lo normal. Si tu pago se completó, tu acceso se activará en breve.{" "}
          <button type="button" onClick={() => router.replace("/app")} className="font-semibold underline" style={{ color: "var(--teal)" }}>
            Ir al dashboard
          </button>
        </p>
      )}
    </div>
  );
}
