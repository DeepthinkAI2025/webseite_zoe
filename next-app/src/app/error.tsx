"use client";
import React, { useEffect } from "react";
import Link from "next/link";

// Globale Error Boundary Seite für App Router
// Wird automatisch von Next.js genutzt, wenn eine render-time Exception in einer Route auftritt.
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("GlobalError:", error);
  }, [error]);

  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-50 text-neutral-900 p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-semibold">Unerwarteter Fehler</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Entschuldigung – etwas ist schief gelaufen. Der Fehler wurde protokolliert. Du kannst es erneut versuchen oder
            zur Startseite zurückkehren.
          </p>
          <pre className="text-xs bg-neutral-900 text-neutral-200 p-3 rounded-md overflow-auto max-h-48 text-left">
            {error.message}
          </pre>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
            >
              Erneut versuchen
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-md bg-neutral-200 text-neutral-800 text-sm font-medium hover:bg-neutral-300 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500"
            >
              Startseite
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
