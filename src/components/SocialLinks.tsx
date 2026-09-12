import { COMPANY } from "../data/company";
import { TelegramIcon, VkIcon } from "./icons";
export default function SocialLinks() {
  const items = [{ label: "Написать в VK", href: COMPANY.vkUrl, Icon: VkIcon }, { label: "Написать в Telegram", href: COMPANY.telegramUrl, Icon: TelegramIcon }];
  return <div className="flex flex-col items-center gap-5"><span className="h-14 w-px bg-gradient-to-b from-transparent to-[rgba(217,154,39,0.5)]" />{items.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="group relative flex h-9 w-9 items-center justify-center text-milk/70 transition-colors duration-300 hover:text-gold-light"><Icon className="h-[18px] w-[18px]" /><span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-[rgba(217,154,39,0.35)] bg-[rgba(16,12,10,0.9)] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-milk opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">{label}</span></a>)}<span className="h-14 w-px bg-gradient-to-b from-[rgba(217,154,39,0.5)] to-transparent" /></div>;
}
