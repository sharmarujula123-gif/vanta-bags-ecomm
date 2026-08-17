import { tw } from "../../utils/twStyles.js";

export default function CollectionHero({ hero }) {
  return (
    <section className={tw("vanta-collection-hero")}>
      <img src={hero.image} alt={hero.title} />
      <div className={tw("vanta-collection-hero-overlay")} />
      <div className={tw("vanta-collection-hero-copy")}>
        <p className={tw("vanta-eyebrow")}>VANTA COLLECTION</p>
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>
    </section>
  );
}
