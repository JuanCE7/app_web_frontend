"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Loader2, ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BackendStatus,
  subscribeBackendStatus,
  pingHealth,
} from "@/lib/apiClient";

interface BackendStatusContextType {
  status: BackendStatus;
  /** Reintenta el ping de salud; devuelve true si el servidor respondió. */
  retry: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(
  undefined
);

export function BackendStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<BackendStatus>("online");
  const [retrying, setRetrying] = useState(false);

  // Nos suscribimos al bus del apiClient: cualquier petición que detecte un
  // cold start / caída actualiza el estado y muestra el aviso automáticamente.
  useEffect(() => {
    const unsubscribe = subscribeBackendStatus(setStatus);
    // Ping inicial: detecta un backend dormido apenas carga la app.
    pingHealth();
    return unsubscribe;
  }, []);

  const retry = useCallback(async () => {
    setRetrying(true);
    const ok = await pingHealth(8_000);
    setRetrying(false);
    if (ok) {
      // El servidor despertó: recargamos para reejecutar los fetch que
      // hubieran fallado mientras estaba dormido.
      if (typeof window !== "undefined") window.location.reload();
    }
    return ok;
  }, []);

  const showBanner = status === "waking" || status === "offline";

  return (
    <BackendStatusContext.Provider value={{ status, retry }}>
      {showBanner && (
        <BackendStatusBanner
          status={status}
          retrying={retrying}
          onRetry={retry}
        />
      )}
      {children}
    </BackendStatusContext.Provider>
  );
}

function BackendStatusBanner({
  status,
  retrying,
  onRetry,
}: {
  status: BackendStatus;
  retrying: boolean;
  onRetry: () => void;
}) {
  const isWaking = status === "waking";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] flex flex-col items-center justify-center gap-2 px-4 py-3 text-sm shadow-md"
      style={{
        background: isWaking ? "hsl(38 92% 50% / 0.95)" : "hsl(0 84% 60% / 0.95)",
        color: "white",
      }}
    >
      <div className="flex items-center gap-2 text-center font-medium">
        {isWaking ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        ) : (
          <ServerCrash className="h-4 w-4 shrink-0" />
        )}
        <span>
          {isWaking
            ? "Estamos despertando el servidor. Esto puede tardar hasta ~1 minuto…"
            : "No pudimos contactar al servidor. Puede estar iniciándose o caído."}
        </span>
        <Button
          size="sm"
          variant="secondary"
          className="ml-2 h-7"
          onClick={onRetry}
          disabled={retrying}
        >
          <RefreshCw
            className={`mr-1 h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`}
          />
          {retrying ? "Reintentando…" : "Reintentar"}
        </Button>
      </div>

      {isWaking && (
        // Barra de progreso indeterminada (sin dependencias extra).
        <div className="h-1 w-full max-w-md overflow-hidden rounded bg-white/30">
          <div className="h-full w-1/3 animate-[wakingBar_1.4s_ease-in-out_infinite] rounded bg-white" />
        </div>
      )}
    </div>
  );
}

export function useBackendStatus() {
  const context = useContext(BackendStatusContext);
  if (context === undefined) {
    throw new Error(
      "useBackendStatus must be used within a BackendStatusProvider"
    );
  }
  return context;
}
