import { ArrowRight, MoveUpRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="overflow-hidden bg-stone-100 text-stone-900">
      {/* Hero */}
      <section className="relative border-b border-stone-200">
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="vanta-reveal flex flex-col justify-center px-5 py-20 lg:px-8 lg:py-24">
            <p className="vanta-eyebrow">VANTA / 2026 COLLECTION</p>

            <h1 className="vanta-serif mt-7 max-w-3xl text-[clamp(4rem,8vw,8rem)] leading-[.88] tracking-[-.055em]">
              Carry
              <br />
              <span className="italic">with intent.</span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-stone-600 md:text-lg">
              Premium bags for people who move. Refined silhouettes,
              considered storage and everyday durability without the visual noise.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-4 bg-stone-950 px-7 py-4 text-[11px] font-bold uppercase tracking-[.18em] text-white transition hover:opacity-80"
              >
                Shop Collection
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#categories"
                className="inline-flex items-center gap-3 border border-stone-300 px-7 py-4 text-[11px] font-bold uppercase tracking-[.18em] transition hover:border-stone-950"
              >
                Explore
                <MoveUpRight size={15} />
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-semibold uppercase tracking-[.15em] text-stone-500">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> Built to last</span>
              <span className="inline-flex items-center gap-2"><Truck size={14} /> Pan-India delivery</span>
            </div>
          </div>

          <div className="relative min-h-[560px] overflow-hidden bg-stone-900 lg:min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.14),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(185,154,104,.24),transparent_34%)]" />
            <div className="absolute inset-8 border border-white/15" />
            <div className="absolute left-8 top-8 text-[9px] font-semibold uppercase tracking-[.28em] text-white/50">
              VANTA / OBJECT 01
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-white/50">Designed for</p>
                <p className="mt-2 text-2xl font-medium text-white">Modern movement.</p>
              </div>
              <span className="text-7xl font-serif italic text-white/10">V</span>
            </div>

            <div className="absolute left-1/2 top-1/2 h-[62%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[28%_28%_18%_18%] border border-white/30 bg-gradient-to-br from-stone-700 via-stone-950 to-black shadow-[0_40px_100px_rgba(0,0,0,.55)]">
              <div className="absolute left-1/2 top-[-12%] h-[20%] w-[42%] -translate-x-1/2 rounded-t-full border-x border-t border-white/25" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold tracking-[.45em] text-white/65">
                VANTA
              </div>
              <div className="absolute bottom-[12%] left-[15%] right-[15%] h-px bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee-like value strip */}
      <section className="border-b border-stone-200 bg-stone-950 text-stone-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-5 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-[.28em] text-stone-400">Quiet luxury / functional design</span>
          <span className="text-[10px] font-bold uppercase tracking-[.28em] text-stone-400">Work · Travel · Everyday</span>
          <span className="text-[10px] font-bold uppercase tracking-[.28em] text-stone-400">Made for movement</span>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="vanta-eyebrow">THE COLLECTION</p>
            <h2 className="vanta-serif mt-5 max-w-3xl text-5xl leading-[.95] tracking-[-.035em] md:text-7xl">
              Objects with a
              <br />
              <span className="italic">purpose.</span>
            </h2>
          </div>
          <Link to="/products" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-stone-600 transition hover:text-stone-950">
            View all bags <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 md:grid-cols-3">
          {[
            ["01", "Work", "Structured protection for the things you carry every day."],
            ["02", "Travel", "Room to move without sacrificing a clean silhouette."],
            ["03", "Everyday", "Light, versatile forms built around real routines."],
          ].map(([number, title, text]) => (
            <Link
              key={number}
              to="/products"
              className="group relative min-h-[310px] overflow-hidden bg-stone-100 p-7 transition hover:bg-stone-950 hover:text-white"
            >
              <span className="text-[10px] font-bold tracking-[.2em] text-stone-400">{number}</span>
              <div className="absolute bottom-7 left-7 right-7">
                <div className="mb-7 h-px w-10 bg-stone-300 transition-all group-hover:w-20 group-hover:bg-white/40" />
                <h3 className="vanta-serif text-4xl">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500 transition group-hover:text-stone-300">{text}</p>
              </div>
              <MoveUpRight className="absolute right-7 top-7 opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-y border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="vanta-eyebrow">EXPLORE</p>
              <h2 className="vanta-serif mt-5 text-5xl leading-[.95] md:text-6xl">
                Your everyday
                <br />
                <span className="italic">carry, elevated.</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-stone-600">
              Every VANTA piece is designed around the same idea: remove the
              unnecessary, keep what matters and make the result feel exceptional.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Laptop Bags", "Protection with a sharper profile."],
              ["02", "Backpacks", "Balanced storage for city movement."],
              ["03", "Travel Bags", "Space that travels beautifully."],
            ].map(([number, title, text], index) => (
              <Link
                key={title}
                to="/products"
                className={`group relative min-h-[360px] overflow-hidden p-7 text-white ${
                  index === 0
                    ? "bg-stone-900"
                    : index === 1
                    ? "bg-stone-700"
                    : "bg-stone-950"
                }`}
              >
                <span className="text-[10px] font-bold tracking-[.25em] text-white/45">{number}</span>
                <div className="absolute bottom-7 left-7 right-7">
                  <Sparkles size={18} className="mb-7 text-white/45" />
                  <h3 className="vanta-serif text-4xl">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">{text}</p>
                </div>
                <MoveUpRight className="absolute right-7 top-7 opacity-50 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="border border-stone-200 bg-stone-950 px-7 py-16 text-stone-100 md:px-14 md:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-stone-400">VANTA BAGS</p>
          <h2 className="vanta-serif mt-6 max-w-3xl text-5xl leading-[.95] md:text-7xl">
            Less noise.
            <br />
            <span className="italic">Better carry.</span>
          </h2>
          <Link
            to="/products"
            className="mt-10 inline-flex items-center gap-4 border border-white/30 px-7 py-4 text-[11px] font-bold uppercase tracking-[.18em] transition hover:bg-white hover:text-black"
          >
            Discover the collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
