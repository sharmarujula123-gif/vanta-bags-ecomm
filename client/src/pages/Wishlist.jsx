import { tw } from "../utils/twStyles.js";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";

const price = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;
export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  return <main className={tw("mx-auto max-w-7xl px-5 py-16 text-[var(--vanta-text)] lg:px-8")}>
    <p className={tw("vanta-eyebrow")}>SAVED PIECES</p><h1 className={tw("vanta-serif mt-4 text-5xl")}>Wishlist</h1>
    {!items.length ? <div className={tw("mt-12 border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-12 text-center")}><Heart className="mx-auto"/><p className="mt-4 text-stone-500">Your saved pieces will appear here.</p><Link to="/products" className={tw("mt-6 inline-flex bg-[var(--vanta-text)] px-6 py-3 text-sm font-semibold text-[var(--vanta-bg)]")}>Explore collection</Link></div> :
    <div className={tw("mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4")}>{items.map(p => <article key={p._id} className={tw("group border border-[var(--vanta-border)] bg-[var(--vanta-bg)]")}>
      <Link to={`/products/${p.slug}`}><div className="aspect-[4/5] overflow-hidden bg-stone-200"><img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/></div></Link>
      <div className="p-5"><Link to={`/products/${p.slug}`} className="font-medium">{p.name}</Link><p className="mt-2 text-sm text-stone-500">{price(p.price)}</p><button onClick={()=>{remove(p._id);toast.success("Removed from wishlist")}} className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Trash2 size={14}/> Remove</button></div>
    </article>)}</div>}
  </main>;
}
