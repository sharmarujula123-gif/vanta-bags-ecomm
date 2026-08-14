import { tw } from "../utils/twStyles.js";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  Droplets,
  Feather,
  Heart,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

const heroImage =
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=2200&q=90";

const categoryImages = {
  backpacks:
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=90",
  "duffle-bags":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=90",
  handbags:
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=90",
  "laptop-bags":
    "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=90",
  "sling-bags":
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=90",
  "travel-bags":
    "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=900&q=90",
};

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      productService.getProducts({ limit: 8, page: 1, sort: "newest" }),
      categoryService.getCategories(),
    ]).then(([productResult, categoryResult]) => {
      if (productResult.status === "fulfilled") {
        setProducts(
          productResult.value.data?.products ||
            productResult.value.products ||
            []
        );
      }
      if (categoryResult.status === "fulfilled") {
        setCategories(
          categoryResult.value.data?.categories ||
            categoryResult.value.categories ||
            []
        );
      }
    });
  }, []);

  const fallbackCategories = [
    ["Backpacks", "backpacks", "Everyday carry"],
    ["Duffle Bags", "duffle-bags", "Made for weekends"],
    ["Handbags", "handbags", "Easy, polished carry"],
    ["Laptop Bags", "laptop-bags", "Built around your tech"],
    ["Sling Bags", "sling-bags", "Light and close"],
  ];

  const categoryItems = categories.length
    ? categories.slice(0, 5).map((category, index) => [
        category.name,
        category.slug,
        ["Everyday carry", "Made for weekends", "Easy, polished carry", "Built around your tech", "Light and close"][index] ||
          "Designed for movement",
      ])
    : fallbackCategories;

  return (
    <main className={tw("vanta-home vanta-reference-home")}>
      {/* HERO */}
      <section className={tw("vanta-reference-hero")}>
        <img
          src={heroImage}
          alt="Vanta black bag"
          className={tw("vanta-reference-hero-image")}
        />
        <div className={tw("vanta-reference-hero-shade")} />

        <div className={tw("vanta-reference-hero-copy")}>
          <p>BUILT TO MOVE. DESIGNED TO LAST.</p>
          <h1>
            What moves you,
            <br />
            <em>matters.</em>
          </h1>
          <Link to="/" className={tw("vanta-reference-outline-btn")}>
            Explore collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CATEGORY / SHOP THE EDIT */}
      <section className={tw("vanta-reference-edit")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>SHOP THE EDIT</p>
            <h2>Find your carry.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-category-row")}>
          {categoryItems.map(([name, slug, description], index) => (
            <Link
              key={slug || name}
              to={slug ? `/category/${slug}` : "/products"}
              className={tw("vanta-reference-category")}
            >
              <div className={tw("vanta-reference-category-image")}>
                <img
                  src={categoryImages[slug] || heroImage}
                  alt={name}
                />
                <span className={tw("vanta-reference-category-arrow")}>
                  <ArrowUpRight size={17} />
                </span>
              </div>
              <div className={tw("vanta-reference-category-copy")}>
                <div>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW / NOW */}
      <section className={tw("vanta-reference-now")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>NEW / NOW</p>
            <h2>Made for the way you move.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            Shop all <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-features")}>
          <div>
            <span><ShieldCheck size={19} /></span>
            <div><b>PREMIUM MATERIALS</b><small>Built to last, every time.</small></div>
          </div>
          <div>
            <span><Box size={19} /></span>
            <div><b>SMART DESIGN</b><small>Thoughtful in every detail.</small></div>
          </div>
          <div>
            <span><Feather size={19} /></span>
            <div><b>LIGHTWEIGHT</b><small>Move freely, always.</small></div>
          </div>
          <div>
            <span><Droplets size={19} /></span>
            <div><b>WATER RESISTANT</b><small>Ready for anything.</small></div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className={tw("vanta-reference-products")}>
        <div className={tw("vanta-reference-section-head")}>
          <div>
            <p>THE LATEST</p>
            <h2>Pieces worth carrying.</h2>
          </div>
          <Link to="/" className={tw("vanta-reference-view-all")}>
            View collection <ArrowRight size={15} />
          </Link>
        </div>

        <div className={tw("vanta-reference-product-grid")}>
          {products.slice(0, 8).map((product, index) => (
            <Link
              key={product._id}
              to={`/products/${product.slug}`}
              className={tw("vanta-reference-product")}
            >
              <div className={tw("vanta-reference-product-image")}>
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span>VANTA</span>
                )}
                <span className={tw("vanta-reference-product-number")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart size={16} />
                </button>
              </div>
              <div className={tw("vanta-reference-product-meta")}>
                <h3>{product.name}</h3>
                <p>{money(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={tw("vanta-reference-bottom")}>
        <p>VANTA / THE STANDARD</p>
        <h2>
          Carry less.
          <br />
          <em>Live more.</em>
        </h2>
        <Link to="/" className={tw("vanta-reference-solid-btn")}>
          Shop the collection <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
