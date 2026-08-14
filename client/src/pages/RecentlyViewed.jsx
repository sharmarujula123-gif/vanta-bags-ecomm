import { tw } from "../utils/twStyles.js";
import { Link } from "react-router-dom";
import useRecentStore from "../store/recentStore";
const price = v => `₹${Number(v||0).toLocaleString("en-IN")}`;
export default function RecentlyViewed(){
 const items=useRecentStore(s=>s.items);
 return <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><p className={tw("vanta-eyebrow")}>YOUR TRAIL</p><h1 className={tw("vanta-serif mt-4 text-5xl")}>Recently viewed</h1>{!items.length?<p className="mt-10 text-stone-500">Products you explore will appear here.</p>:<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map(p=><Link key={p._id} to={`/products/${p.slug}`} className="group"><div className="aspect-[4/5] overflow-hidden bg-stone-200"><img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/></div><h2 className="mt-4 text-sm font-medium">{p.name}</h2><p className="mt-1 text-sm text-stone-500">{price(p.price)}</p></Link>)}</div>}</main>;
}
