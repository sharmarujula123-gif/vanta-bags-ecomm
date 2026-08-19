import { Box, AlertTriangle, Edit3, Trash2 } from "lucide-react";

export default function ProductGrid({
  products,
  openEditForm,
  handleStockUpdate,
  handleDeactivate,
}) {
  if (!products.length) {
    return null;
  }

  return (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const lowStock =
                product.stock <= 5;

              return (
                <article
                  key={product._id}
                  className="overflow-hidden border border-stone-200 bg-white"
                >
                  {/* Image */}

                  <div className="relative aspect-[4/3] bg-stone-100">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.2em] text-stone-400">
                        VANTA
                      </div>
                    )}

                    {product.isFeatured && (
                      <span className="absolute left-3 top-3 bg-stone-950 px-3 py-1.5 text-[9px] font-bold tracking-[0.15em] text-white">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Info */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-xl">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs text-stone-500">
                          SKU: {product.sku}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-y border-stone-100 py-4">
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.15em] text-stone-400">
                          STOCK
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            lowStock
                              ? "text-red-600"
                              : "text-stone-950"
                          }`}
                        >
                          {product.stock} units
                        </p>
                      </div>

                      {lowStock && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                          <AlertTriangle
                            size={13}
                          />
                          LOW STOCK
                        </span>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-stone-300 px-3 py-2 text-xs font-semibold hover:bg-stone-50"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStockUpdate(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-stone-300 px-3 py-2 text-xs font-semibold hover:bg-stone-50"
                      >
                        <Box size={14} />
                        Stock
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeactivate(
                            product
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Hide
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
  );
}
