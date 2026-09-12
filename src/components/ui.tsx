import type { ButtonHTMLAttributes, ReactNode } from "react";
export function GoldButton({ children, className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={"group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#241711] transition-transform duration-300 will-change-transform hover:-translate-y-0.5 "+className} style={{ background: "var(--gold-metal)" }}><span className="relative z-10 flex items-center gap-2.5">{children}</span><span className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 bg-white/40 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[sheen_0.9s_ease]" /></button>;
}
export function GhostButton({ children, className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={"inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(217,154,39,0.45)] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-milk transition-colors duration-300 hover:border-gold-light hover:bg-[rgba(217,154,39,0.08)] "+className}>{children}</button>;
}
export function Eyebrow({ children, className="" }: { children: ReactNode; className?: string }) {
  return <span className={"inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-gold "+className}><span className="h-px w-8 bg-[rgba(217,154,39,0.6)]" />{children}</span>;
}
