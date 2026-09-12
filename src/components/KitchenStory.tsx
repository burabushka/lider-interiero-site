import { useEffect, useRef, useState } from "react";
import coupleImg from "../assets/kitchen/couple-kitchen.webp";
import irinaImg from "../assets/kitchen/irina-portrait.png";
import mobileInteriorImg from "../assets/kitchen/interior-mobile.webp";
import panoramaImg from "../assets/kitchen/panorama-desktop.webp";

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function range(progress: number, from: number, to: number) {
  return clamp((progress - from) / (to - from));
}

function ease(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

type HotspotProps = {
  label: string;
  question: string;
  x: string;
  y: string;
  align?: "left" | "right";
  progress: number;
  from: number;
  to: number;
};

function Hotspot({ label, question, x, y, align = "left", progress, from, to }: HotspotProps) {
  const duration = to - from;
  // Beacon appears first, line draws from it, card unfolds last — each phase overlaps slightly.
  const enter = ease(range(progress, from, from + duration * 0.15));
  const leave = ease(range(progress, to - duration * 0.18, to));
  const visible = enter * (1 - leave);
  const beaconVisible = ease(range(progress, from, from + duration * 0.22)) * (1 - leave);
  const lineVisible = ease(range(progress, from + duration * 0.16, from + duration * 0.46)) * (1 - leave);
  const cardVisible = ease(range(progress, from + duration * 0.40, from + duration * 0.72)) * (1 - leave);
  const pulsing = beaconVisible > 0.55 && lineVisible < 0.75;
  const lineWidth = "clamp(5rem, 8vw, 9rem)";

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ left: x, top: y, opacity: visible, transform: `translateY(${(1 - visible) * 12}px)` }}
    >
      <div className={`flex items-center ${align === "right" ? "flex-row-reverse" : ""}`}>
        <span
          className="relative block h-3 w-3 shrink-0 rounded-full border border-[#ffdda0] bg-gold"
          style={{
            opacity: beaconVisible,
            boxShadow: "0 0 0 8px rgba(217,154,39,.12), 0 0 28px rgba(255,205,104,.85)",
            animation: pulsing ? "kitchen-story-beacon .82s ease-in-out 4" : "none",
          }}
        />
        <span
          className="h-px shrink-0 w-[clamp(5rem,8vw,9rem)]"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #ffd875 0 3px, transparent 3px 8px)",
            transform: `scaleX(${lineVisible})`,
            transformOrigin: align === "right" ? "right" : "left",
          }}
        />
      </div>
      <div
        className={`mt-3 w-[min(17rem,23vw)] border border-gold/45 bg-[#17100d]/90 px-4 py-3 backdrop-blur-md ${align === "right" ? "text-right" : ""}`}
        style={{
          opacity: cardVisible,
          marginLeft: align === "left" ? lineWidth : undefined,
          transform: `${align === "right" ? "translateX(-100%) " : ""}translateY(${(1 - cardVisible) * 12}px) scale(${0.97 + cardVisible * 0.03})`,
          transformOrigin: align === "right" ? "right top" : "left top",
        }}
      >
        <p className="font-sans text-[9px] font-bold uppercase tracking-[.22em] text-gold-light">{label}</p>
        <p className="mt-2 font-sans text-[13px] leading-snug text-milk">{question}</p>
      </div>
    </div>
  );
}

function ProgressMarks({ sceneIdx }: { sceneIdx: number }) {
  const marks = ["Знакомство", "Пространство", "Детали", "Ваш сценарий"];
  return (
    <div className="absolute bottom-8 left-10 z-30 flex items-center gap-3 lg:left-14">
      {marks.map((mark, index) => {
        const active = sceneIdx === index;
        return (
          <div key={mark} className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${active ? "bg-gold-light" : "bg-milk/30"}`} />
            <span className={`hidden font-sans text-[9px] uppercase tracking-[.18em] xl:block transition-colors duration-500 ${active ? "text-milk" : "text-milk/40"}`}>{mark}</span>
          </div>
        );
      })}
    </div>
  );
}

function DesktopStory({ onOpenLead }: { onOpenLead: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setProgress(clamp(-rect.top / Math.max(1, node.offsetHeight - window.innerHeight)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateProgress();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Timeline at h-[3000vh] → 2900 vh of scroll.
  // Blocks 1&2: enter/exit 40% faster than before; hold unchanged.
  // Block 3: 783 vh ≈ same as block 2. Block 4: three-wave cinematic reveal.
  const firstMove  = ease(range(progress, 0.20, 0.27)); // scene 1→2 (was 0.20-0.32)
  const secondMove = ease(range(progress, 0.56, 0.62)); // scene 2→3 (was 0.60-0.70)
  const thirdMove  = ease(range(progress, 0.89, 0.93)); // scene 3→4
  const trackX = -(firstMove * 100 + secondMove * 100 + thirdMove * 100);

  const intro      = ease(range(progress, 0.01, 0.032)); // scene 1 appear — snappy
  const kitchen    = ease(range(progress, 0.27, 0.37));  // scene 2 appear — snappy, then holds at 1
  const inspect    = ease(range(progress, 0.62, 0.89)); // scene 3 pan (783 vh)
  const finaleImg  = ease(range(progress, 0.89, 0.95)); // image fades during transition
  const finaleText = ease(range(progress, 0.93, 0.975));// headline settles after camera
  const finaleBtn  = ease(range(progress, 0.96, 0.995));// button slides up last

  const sceneIdx = progress < 0.23 ? 0 : progress < 0.60 ? 1 : progress < 0.91 ? 2 : 3;

  return (
    <section ref={sectionRef} aria-label="История будущей кухни" className="relative hidden h-[3000vh] overflow-clip md:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <style>{`@keyframes kitchen-story-beacon { 0%, 100% { transform: scale(1); opacity: .9; } 42% { transform: scale(1.65); opacity: .3; } 58% { transform: scale(.82); opacity: 1; } }`}</style>

        <div className="absolute inset-0 flex h-full w-[400vw] will-change-transform" style={{ transform: `translate3d(${trackX}vw, 0, 0)` }}>

          {/* ── Scene 1: Знакомство ─────────────────────────────────── */}
          <article className="relative h-full w-screen shrink-0 overflow-hidden bg-[#130d0a]">
            <img
              src={panoramaImg}
              alt="Кухня студии Лидер интерьера"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 46%", transform: `scale(${1.06 - intro * 0.04})`, filter: "brightness(.58) saturate(.82)" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,12,10,.92)_0%,rgba(16,12,10,.58)_42%,rgba(16,12,10,.16)_100%)]" />
            <div
              className="absolute left-[8vw] top-1/2 z-10 w-[37rem] -translate-y-1/2"
              style={{ opacity: intro, transform: `translateY(calc(-50% + ${(1 - intro) * 30}px))` }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[.34em] text-gold">01 / Начинаем с человека</p>
              <h2 className="mt-6 font-display text-[clamp(3.4rem,6vw,6.7rem)] uppercase leading-[.88] text-milk">Как живёт<br />Ваша кухня?</h2>
              <p className="mt-7 max-w-md font-sans text-[15px] leading-relaxed text-milk/65">Ирина не начинает проект с палитры. Сначала — привычки, утро, любимая чашка и маршруты по дому.</p>
            </div>
            <img
              src={irinaImg}
              alt="Ирина, дизайнер студии Лидер интерьера"
              draggable={false}
              className="absolute bottom-0 right-[3vw] h-[93%] max-w-[47vw] w-auto select-none object-contain object-bottom"
              style={{ opacity: intro, transform: `translateX(${(1 - intro) * 72}px) translateY(${(1 - intro) * 12}px) scale(${0.985 + intro * 0.015})`, filter: "drop-shadow(-28px 20px 38px rgba(0,0,0,.45))" }}
            />
            <span className="absolute right-10 top-10 font-sans text-[10px] uppercase tracking-[.25em] text-milk/35">листайте историю</span>
          </article>

          {/* ── Scene 2: Пространство ───────────────────────────────── */}
          <article className="relative h-full w-screen shrink-0 overflow-hidden bg-[#100c0a]">
            <img
              src={panoramaImg}
              alt="Кухня, спроектированная студией"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center", transform: `scale(${1.16 - kitchen * 0.16})`, filter: `brightness(${0.62 + kitchen * 0.38})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#100c0a]/65 via-transparent to-[#100c0a]/25" />
            <div
              className="absolute bottom-[14vh] left-[8vw] max-w-md"
              style={{ opacity: kitchen, transform: `translateY(${(1 - kitchen) * 36}px)` }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[.34em] text-gold">02 / Пространство</p>
              <h2 className="mt-4 font-display text-[clamp(2.8rem,4.6vw,5.2rem)] uppercase leading-[.9] text-milk">Сначала —<br />почувствовать масштаб.</h2>
            </div>
            <div className="absolute bottom-10 right-12 h-px w-[min(22vw,18rem)] bg-milk/30">
              <span className="absolute left-0 top-0 h-px bg-gold-light" style={{ width: `${kitchen * 100}%` }} />
            </div>
          </article>

          {/* ── Scene 3: Детали ─────────────────────────────────────── */}
          <article className="relative h-full w-screen shrink-0 overflow-hidden bg-[#100c0a]">
            <img
              src={panoramaImg}
              alt="Детали современной кухни"
              className="absolute inset-0 h-full w-[142%] max-w-none object-cover"
              style={{ left: `${-28 - inspect * 19}%`, objectPosition: "center", transform: `scale(${1.08 + inspect * 0.06})`, filter: "brightness(.78) contrast(1.05)" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,7,5,.42),transparent_40%,rgba(10,7,5,.20))]" />
            <div
              className="absolute left-[8vw] top-[12vh] z-10 max-w-xs"
              style={{ opacity: ease(range(progress, 0.62, 0.70)), transform: `translateY(${(1 - ease(range(progress, 0.62, 0.70))) * 20}px)` }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[.34em] text-gold">03 / Детали в движении</p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-milk/75">Прокручивайте: вопросы возникают там, где они появляются в жизни.</p>
            </div>
            {/* Hotspots: each has a wide window so line+card are fully visible */}
            <Hotspot
              label="Рабочая поверхность"
              question="Где Вы поставите чашку утром?"
              x="29%" y="57%"
              progress={progress} from={0.62} to={0.78}
            />
            <Hotspot
              label="Система хранения"
              question="Удобно ли доставать нужные вещи?"
              x="55%" y="39%" align="right"
              progress={progress} from={0.72} to={0.86}
            />
            <Hotspot
              label="Техника"
              question="Откроется ли духовка и соседний шкаф?"
              x="74%" y="48%" align="right"
              progress={progress} from={0.81} to={0.89}
            />
          </article>

          {/* ── Scene 4: Ваш сценарий ───────────────────────────────── */}
          <article className="relative h-full w-screen shrink-0 overflow-hidden bg-[#110c09]">
            <img
              src={coupleImg}
              alt="Пара проводит время на кухне"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 45%", opacity: 0.18 + finaleImg * 0.82, transform: `scale(${1.12 - finaleImg * 0.12})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(12,8,6,.88)_0%,rgba(12,8,6,.30)_50%,rgba(12,8,6,.72)_100%)]" />
            <div className="absolute inset-0 z-10 flex items-center">
              <div
                className="ml-[8vw] max-w-[36rem]"
                style={{ opacity: finaleText, transform: `translateY(${(1 - finaleText) * 28}px)` }}
              >
                <p className="font-sans text-[10px] uppercase tracking-[.38em] text-gold">04 / Ваш сценарий</p>
                <h2 className="mt-5 font-display text-[clamp(2.2rem,3.9vw,4.4rem)] uppercase leading-[1.0] text-milk">
                  Интерьер<br />начинается не с картинки.<br />
                  <span className="text-gold-metal">С человека.</span>
                </h2>
                <div style={{ opacity: finaleBtn, transform: `translateY(${(1 - finaleBtn) * 16}px)` }}>
                  <button
                    onClick={onOpenLead}
                    className="mt-8 border border-gold/65 bg-gold px-10 py-4 font-sans text-[11px] font-bold uppercase tracking-[.22em] text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(217,154,39,.35)]"
                  >
                    Обсудить проект
                  </button>
                </div>
              </div>
            </div>
          </article>

        </div>

        <ProgressMarks sceneIdx={sceneIdx} />
        <div className="absolute bottom-8 right-10 z-30 font-sans text-[10px] tracking-[.18em] text-milk/50">
          {String(sceneIdx + 1).padStart(2, "0")} / 04
        </div>
      </div>
    </section>
  );
}

function MobileStory({ onOpenLead }: { onOpenLead: () => void }) {
  const points = [
    ["Рабочая поверхность", "Где Вы поставите чашку утром?"],
    ["Система хранения", "Удобно ли доставать нужные вещи?"],
    ["Техника", "Откроется ли духовка и соседний шкаф?"],
  ];
  return (
    <section className="md:hidden bg-ink">
      <div className="relative min-h-[92svh] overflow-hidden px-6 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_42%,#51351d,#100c0a_65%)]" />
        <div className="relative z-10 max-w-xs">
          <p className="font-sans text-[10px] uppercase tracking-[.32em] text-gold">Наш подход</p>
          <h2 className="mt-5 font-display text-[2.8rem] uppercase leading-[.9] text-milk">Как живёт<br />Ваша кухня?</h2>
          <p className="mt-5 font-sans text-sm leading-relaxed text-milk/65">Сначала — привычки и сценарии жизни. Затем — интерьер.</p>
        </div>
        <img src={irinaImg} alt="Ирина, дизайнер студии" className="absolute bottom-0 right-0 h-[59%] w-auto object-contain" />
      </div>

      <div className="relative h-[70svh] overflow-hidden">
        <img src={panoramaImg} alt="Интерьер кухни" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/45" />
        <p className="absolute bottom-9 left-6 right-6 font-display text-4xl uppercase leading-[.9] text-milk">Кухня<br />в Вашем ритме.</p>
      </div>

      {points.map(([label, text], index) => (
        <div key={label} className="relative h-[76svh] overflow-hidden">
          <img src={mobileInteriorImg} alt="Деталь кухни" className="h-full w-full object-cover" style={{ objectPosition: `${38 + index * 25}% center` }} />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute bottom-10 left-6 right-6 border border-gold/40 bg-[#17100d]/90 p-4 backdrop-blur">
            <p className="font-sans text-[9px] font-bold uppercase tracking-[.22em] text-gold-light">{label}</p>
            <p className="mt-2 font-sans text-sm text-milk">{text}</p>
          </div>
        </div>
      ))}

      <div className="relative flex min-h-[82svh] items-center justify-center overflow-hidden px-6 text-center">
        <img src={coupleImg} alt="Кухня для жизни" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative">
          <h2 className="font-display text-[2.6rem] uppercase leading-[.9] text-milk">Начинается<br /><span className="text-gold-metal">с человека.</span></h2>
          <button onClick={onOpenLead} className="mt-8 bg-gold px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[.18em] text-ink">Обсудить проект</button>
        </div>
      </div>
    </section>
  );
}

export default function KitchenStory({ onOpenLead }: { onOpenLead: () => void }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile ? <MobileStory onOpenLead={onOpenLead} /> : <DesktopStory onOpenLead={onOpenLead} />;
}
