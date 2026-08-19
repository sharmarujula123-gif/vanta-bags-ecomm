import { Link } from "react-router-dom";
import { tw } from "../../utils/twStyles.js";

const CollectionHero = ({ hero, parentCategory }) => (
  <section className={tw("vanta-collection-hero !h-[235px] max-[640px]:!h-[220px]")}>
    <img src={hero.image} alt={hero.title} />

    <div className={tw("vanta-collection-hero-overlay")} />

    <div className={tw("vanta-collection-hero-copy !w-full !max-w-[1280px] !mx-auto !left-0 !right-0 !px-6 sm:!px-10 lg:!px-14")}>
      <div>
        <div className={tw("mb-3 flex items-center gap-2 text-[9px] text-white/70")}>
          <Link to="/" className={tw("hover:text-white")}>Home</Link>
          <span>›</span>
          <Link to="/category" className={tw("hover:text-white")}>Collections</Link>

          {parentCategory && (
            <>
              <span>›</span>
              <Link to={`/category/${parentCategory.slug}`} className={tw("hover:text-white")}>
                {parentCategory.name}
              </Link>
            </>
          )}

          <span>›</span>
          <strong className="font-semibold text-white">{hero.title}</strong>
        </div>

        <p className={tw("vanta-eyebrow")}>VANTA COLLECTION</p>
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>
    </div>
  </section>
);

export default CollectionHero;
