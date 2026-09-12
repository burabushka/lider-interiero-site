import { useEffect, useState } from "react";
import { COMPANY } from "../data/company";
import { PhoneIcon } from "./icons";
export default function MobileBottomBar({ onCalc }: { onCalc: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const onScroll = () => setShow(window.scrollY > 520); window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <div className={"fixed inset-x-0 bottom-0 z-[110] flex gap-2 border-t border-[rgba(217,154,39,0.2)] bg-[rgba(16,12,10,0.92)] p-3 backdrop-blur-2xl transition-transform duration-500 lg:hidden "+(show ? "translate-y-0" : "translate-y-full")} style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}><a href={`tel:${COMPANY.phoneRaw}`} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[rgba(217,154,39,0.45)] py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-milk"><PhoneIcon className="h-4 w-4" /> Позвонить</a><button onClick={onCalc} className="flex flex-1 items-center justify-center rounded-full py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#241711]" style={{ background: "var(--gold-metal)" }}>Рассчитать</button></div>;
}
