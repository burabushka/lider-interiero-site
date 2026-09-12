import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
type ToastCtx = { notify: (message: string) => void };
const Ctx = createContext<ToastCtx>({ notify: () => {} });
export function useToast() { return useContext(Ctx); }
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const notify = useCallback((msg: string) => setMessage(msg), []);
  useEffect(() => { if (!message) return; const t = setTimeout(() => setMessage(null), 2000); return () => clearTimeout(t); }, [message]);
  return <Ctx.Provider value={{ notify }}>{children}<div aria-live="polite" role="status" className="fixed right-4 top-4 z-[120] pointer-events-none sm:right-6 sm:top-6">{message && <div className="fade-in flex items-center gap-2.5 rounded-full border border-[rgba(217,154,39,0.4)] bg-[rgba(16,12,10,0.92)] px-4 py-2.5 text-sm text-milk shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full bg-gold-light" />{message}</div>}</div></Ctx.Provider>;
}
