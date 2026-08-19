import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const BENEFITS = [
  [Truck, "Free Shipping", "On all orders over ₹999"],
  [ShieldCheck, "Secure Payment", "100% secure checkout"],
  [RefreshCw, "Easy Returns", "30-day return policy"],
  [Headphones, "Customer Support", "We're here to help"],
];

const CollectionBenefits = () => (
  <section className={tw("vanta-collection-benefits")}>
    {BENEFITS.map(([Icon, title, text]) => (
      <div key={title}>
        <Icon size={27} strokeWidth={1.5} />
        <div>
          <strong>{title}</strong>
          <span>{text}</span>
        </div>
      </div>
    ))}
  </section>
);

export default CollectionBenefits;
