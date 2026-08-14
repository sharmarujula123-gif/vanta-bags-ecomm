import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const values = [
  {
    number: "01",
    title: "Designed with intent",
    text: "Every Vanta bag is built around how it is actually carried, used and lived with.",
  },
  {
    number: "02",
    title: "Quietly distinctive",
    text: "Clean silhouettes, considered details and a visual language that does not need to shout.",
  },
  {
    number: "03",
    title: "Made for movement",
    text: "From everyday commutes to longer escapes, our collections are designed to keep up.",
  },
];

const stats = [
  ["05", "Core silhouettes"],
  ["01", "Clear design language"],
  ["∞", "Places to take them"],
];

const About = () => {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f5f2eb]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/55 to-black/15" />

        <div className="mx-auto flex min-h-[78vh] max-w-[1440px] items-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#c9bda8]">
              VANTA / ABOUT
            </p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[104px]">
              Carry less noise.
              <br />
              Carry what matters.
            </h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Vanta is a modern bag label built around one simple idea:
              everyday carry should feel considered, useful and unmistakably
              yours.
            </p>
            <Link
              to="/category"
              className="mt-9 inline-flex items-center gap-3 border border-white/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            >
              Explore the collection
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16 lg:py-32">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9bda8]">
            The Vanta idea
          </p>
          <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            Bags should belong to the life around them.
          </h2>
        </div>

        <div className="max-w-2xl text-sm leading-8 text-white/65 sm:text-base">
          <p>
            We design around the moments that happen between destinations:
            the morning commute, a packed café, a weekend away, the laptop
            that never leaves your side, and the things you carry simply
            because they matter.
          </p>
          <p className="mt-6">
            That means useful proportions, practical storage and silhouettes
            that stay relevant after the first impression fades. Vanta keeps
            the design language restrained so the person carrying the bag
            remains the focal point.
          </p>
        </div>
      </section>

      {/* Image statement */}
      <section className="mx-auto grid max-w-[1440px] gap-px bg-white/10 px-6 sm:px-10 lg:grid-cols-2 lg:px-16">
        <div className="relative min-h-[500px] overflow-hidden bg-[#151515]">
          <img
            src="https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1400&q=85"
            alt="Vanta bag designed for everyday carry"
            className="h-full w-full object-cover grayscale-[15%] transition duration-700 hover:scale-[1.02]"
          />
        </div>

        <div className="flex min-h-[500px] flex-col justify-between bg-[#141414] p-8 sm:p-12 lg:p-16">
          <Sparkles size={20} className="text-[#c9bda8]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9bda8]">
              Our approach
            </p>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
              Function first.
              <br />
              Personality always.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/60">
              We keep the architecture simple and the details deliberate.
              The result is a collection that works hard without looking like
              it is trying too hard.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9bda8]">
              What we believe
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
              Three simple rules.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/50">
            Less decoration. Better decisions. Bags that make sense before
            they make a statement.
          </p>
        </div>

        <div className="grid border-t border-white/10 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.number}
              className="border-b border-white/10 py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="text-[11px] tracking-[0.25em] text-[#c9bda8]">
                {value.number}
              </span>
              <h3 className="mt-8 text-xl font-medium">{value.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-[#111111]">
        <div className="mx-auto grid max-w-[1280px] sm:grid-cols-3">
          {stats.map(([number, label]) => (
            <div
              key={label}
              className="border-b border-white/10 px-6 py-10 last:border-b-0 sm:border-b-0 sm:border-r sm:px-10 sm:last:border-r-0 lg:px-16"
            >
              <p className="font-serif text-4xl">{number}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/45">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9bda8]">
          Find your carry
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl">
          Your day already has enough going on.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/55">
          Choose a bag that fits the way you move, then get on with the
          interesting part.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/category"
            className="inline-flex items-center gap-3 bg-[#f5f2eb] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white"
          >
            Shop bags
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/50"
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
