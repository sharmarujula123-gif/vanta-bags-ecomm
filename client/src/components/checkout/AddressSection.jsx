import {
    Check,
    MapPin,
    Plus,
    Trash2,
  } from "lucide-react";
  
  const AddressSection = ({
    addresses,
    selectedAddressId,
    onSelect,
    onDelete,
    onAdd,
  }) => {
    return (
      <section className="border-b border-stone-200 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
              DELIVERY
            </p>
  
            <h2 className="mt-2 font-serif text-2xl">
              Shipping address
            </h2>
          </div>
  
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 border border-stone-300 px-4 py-2 text-xs font-semibold transition hover:border-stone-950"
          >
            <Plus size={15} />
            Add Address
          </button>
        </div>
  
        {addresses.length === 0 ? (
          <div className="mt-6 border border-dashed border-stone-300 px-5 py-8 text-center">
            <MapPin
              size={22}
              className="mx-auto text-stone-400"
            />
  
            <p className="mt-3 text-sm text-stone-500">
              You don't have a saved address yet.
            </p>
  
            <button
              type="button"
              onClick={onAdd}
              className="mt-4 text-sm font-semibold underline"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {addresses.map((address) => {
              const id = address._id || address.id;
  
              const selected =
                selectedAddressId === id;
  
              return (
                <div
                  key={id}
                  className={`relative border p-5 transition ${
                    selected
                      ? "border-stone-950"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(address)}
                    className="w-full text-left"
                  >
                    <div className="flex gap-4">
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-stone-950 bg-stone-950 text-white"
                            : "border-stone-400"
                        }`}
                      >
                        {selected && (
                          <Check size={12} />
                        )}
                      </div>
  
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-bold">
                            {address.name}
                          </p>
  
                          {address.isDefault && (
                            <span className="bg-stone-100 px-2 py-1 text-[10px] font-bold tracking-wide">
                              DEFAULT
                            </span>
                          )}
                        </div>
  
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {address.addressLine1}
                          {address.addressLine2
                            ? `, ${address.addressLine2}`
                            : ""}
                          <br />
                          {address.city},{" "}
                          {address.state}{" "}
                          {address.postalCode}
                          <br />
                          {address.country}
                        </p>
  
                        <p className="mt-2 text-sm text-stone-500">
                          {address.phone}
                        </p>
                      </div>
                    </div>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => onDelete(id)}
                    className="absolute right-4 top-4 text-stone-400 transition hover:text-red-600"
                    aria-label="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };
  
  export default AddressSection;