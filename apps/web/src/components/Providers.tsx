"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [injected(), coinbaseWallet({ appName: "Mālama Labs" })],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function CardanoProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [MeshProvider, setMeshProvider] = useState<React.FC<{
    children: React.ReactNode;
  }> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadMesh = async () => {
      try {
        console.log("Providers: Loading Mesh SDK...");
        const mod = await import("@meshsdk/react");
        if (mod && mod.MeshProvider) {
          setMeshProvider(() => mod.MeshProvider);
          console.log("Providers: Mesh SDK loaded successfully.");
        } else {
          console.warn("Providers: MeshProvider export not found in @meshsdk/react");
          setFailed(true);
        }
      } catch (e) {
        console.warn("Providers: Cardano wallet unavailable:", e);
        setFailed(true);
      }
    };
    loadMesh();

    // Fallback timer: don't block the app forever
    const timer = setTimeout(() => {
      setMounted(true);
      setFailed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  
  if (!MeshProvider && !failed) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-6 bg-malama-bg">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-malama-accent border-t-transparent shadow-[0_0_30px_rgba(196,240,97,0.2)]" />
        <div className="text-center">
          <p className="animate-pulse font-black uppercase tracking-[0.3em] text-malama-accent text-xs">Initializing Bridge</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
            Hydrating Cardano WASM Context
          </p>
        </div>
      </div>
    );
  }

  // If failed or loaded, wrap in Provider if available, otherwise just children
  if (MeshProvider) return <MeshProvider>{children}</MeshProvider>;
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CardanoProvider>{children}</CardanoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
