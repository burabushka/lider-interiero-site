export type Lead = {
  projectType?: string; spaceType?: string; projectStage?: string[];
  startTime?: string; name?: string; phone?: string; source?: string;
}

export async function submitLead(lead: Lead): Promise<{ ok: true }> {
  sendTelegram(lead).catch((err) => console.error("[lead] Telegram:", err));
  return { ok: true };
}

async function sendTelegram(lead: Lead) {
  const token = import.meta.env.VITE_TG_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TG_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is not configured.");
  const lines = [
    "<b>Новая заявка — Лидер интерьера</b>",
    lead.name ? `Имя: ${lead.name}` : null,
    lead.phone ? `Телефон: ${lead.phone}` : null,
    lead.source ? `Источник: ${lead.source}` : null,
    lead.projectType ? `Тип проекта: ${lead.projectType}` : null,
    lead.spaceType ? `Помещение: ${lead.spaceType}` : null,
    lead.startTime ? `Старт: ${lead.startTime}` : null,
  ].filter(Boolean);
  const params = new URLSearchParams({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" });
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage?${params}`, { method: "GET" });
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(`Telegram ${res.status}: ${JSON.stringify(body)}`); }
}
