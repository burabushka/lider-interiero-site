import type { ReactNode } from "react";
import { COMPANY } from "../data/company";
import { useIsTouch } from "../lib/hooks";
import { useToast } from "./Toast";
type Props = { className?: string; children?: ReactNode; "aria-label"?: string };
export default function PhoneLink({ className, children, ...rest }: Props) {
  const isTouch = useIsTouch();
  const { notify } = useToast();
  if (isTouch) return <a href={`tel:${COMPANY.phoneRaw}`} className={className} aria-label={rest["aria-label"] ?? "Позвонить"}>{children ?? COMPANY.phoneDisplay}</a>;
  const copy = async () => { try { await navigator.clipboard.writeText(COMPANY.phoneDisplay); notify("Номер скопирован"); } catch { notify(COMPANY.phoneDisplay); } };
  return <button type="button" onClick={copy} className={className} aria-label={rest["aria-label"] ?? "Скопировать номер телефона"}>{children ?? COMPANY.phoneDisplay}</button>;
}
