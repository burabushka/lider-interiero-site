type Props = { onOpenLead: () => void };
const advantages = [
  { title: "Индивидуальный подход", text: "Проектируем кухню до миллиметра, учитывая все особенности вашей планировки." },
  { title: "Контроль качества", text: "Многоступенчатый контроль на каждом этапе — от распила до контрольной сборки в цеху." },
  { title: "Прямые поставки", text: "Собственное производство позволяет держать цены без наценок посредников и салонов." },
  { title: "Точно в срок", text: "Соблюдаем сроки по договору. В среднем изготовление занимает 21 рабочий день." },
];
export default function Production({ onOpenLead }: Props) {
  return <section className="bg-choco py-20 md:py-28 px-4"><div className="max-w-5xl mx-auto"><div className="mb-14"><p className="text-gold font-sans text-xs tracking-[0.2em] uppercase mb-4">Наш цех</p><h2 className="font-display text-3xl md:text-5xl text-milk leading-tight">Собственное<br />производство</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-milk/10 border border-milk/10 rounded-sm overflow-hidden mb-12">{advantages.map((item) => <div key={item.title} className="bg-choco p-8 flex flex-col gap-3 hover:bg-ink/40 transition-colors"><div className="w-6 h-px bg-gold" /><h3 className="font-display text-lg text-milk">{item.title}</h3><p className="font-sans text-sm text-milk/60 leading-relaxed">{item.text}</p></div>)}</div><div className="flex flex-col sm:flex-row items-start sm:items-center gap-6"><button onClick={onOpenLead} className="px-8 py-4 bg-gold text-ink font-sans font-semibold text-sm tracking-wide hover:bg-gold-light transition-colors">Рассчитать стоимость кухни</button><p className="font-sans text-xs text-milk/40">Выезд дизайнера · Замер · 3D-проект — бесплатно</p></div></div></section>;
}
