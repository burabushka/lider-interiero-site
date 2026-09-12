import { useId } from "react";
import { formatPhoneMask } from "../lib/hooks";
const fieldCls = "w-full rounded-xl border border-[rgba(243,238,232,0.14)] bg-[rgba(243,238,232,0.03)] px-4 py-3.5 text-[15px] text-milk placeholder:text-milk/30 transition-colors focus:border-gold focus:outline-none";
export function NameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return <div><label htmlFor={id} className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-milk/50">Ваше имя</label><input id={id} type="text" autoComplete="name" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Как к Вам обращаться" className={fieldCls} /></div>;
}
export function PhoneField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const id = useId();
  return <div><label htmlFor={id} className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-milk/50">Телефон <span className="text-gold">*</span></label><input id={id} type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!error} aria-describedby={error ? id+"-err" : undefined} value={value} onFocus={() => { if (!value) onChange("+7 ("); }} onChange={(e) => onChange(formatPhoneMask(e.target.value))} placeholder="+7 (___) ___-__-__" className={fieldCls+(error ? " border-red-400/70" : "")} />{error && <p id={id+"-err"} className="mt-2 text-[12px] text-red-300/90">{error}</p>}</div>;
}
export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 11) return "Укажите корректный номер телефона";
  return null;
}
