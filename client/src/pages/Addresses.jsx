import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import addressService from "../services/addressService";

const emptyForm = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAddresses();

      setAddresses(data.data?.addresses || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load your addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      const data = await addressService.createAddress(form);

      const newAddress =
        data.data?.address || data.address;

      setAddresses((current) => {
        if (newAddress?.isDefault) {
          return [
            newAddress,
            ...current.map((address) => ({
              ...address,
              isDefault: false,
            })),
          ];
        }

        return [newAddress, ...current];
      });

      setForm(emptyForm);
      setShowForm(false);

      toast.success("Address saved");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await addressService.deleteAddress(id);

      setAddresses((current) =>
        current.filter((address) => address._id !== id)
      );

      toast.success("Address deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete address"
      );
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const data =
        await addressService.setDefaultAddress(id);

      const updatedAddress =
        data.data?.address || data.address;

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault:
            address._id === updatedAddress?._id,
        }))
      );

      toast.success("Default address updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update default address"
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-950"
      >
        <ArrowLeft size={16} />
        Back to Account
      </Link>

      <div className="mt-10 flex flex-col justify-between gap-5 border-b border-stone-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
            VANTA BAGS
          </p>

          <h1 className="mt-3 font-serif text-5xl">
            My Addresses
          </h1>

          <p className="mt-4 text-stone-500">
            Manage your saved delivery addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex items-center justify-center gap-2 bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          <Plus size={17} />
          Add Address
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 border border-stone-200 p-6 md:p-8"
        >
          <h2 className="font-serif text-2xl">
            New Address
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                FULL NAME
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                PHONE
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold tracking-[0.15em]">
                ADDRESS LINE 1
              </label>

              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold tracking-[0.15em]">
                ADDRESS LINE 2
              </label>

              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, landmark, etc. (optional)"
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                CITY
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                STATE
              </label>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                POSTAL CODE
              </label>

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-[0.15em]">
                COUNTRY
              </label>

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
              />
            </div>
          </div>

          <label className="mt-6 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="h-4 w-4"
            />

            Make this my default address
          </label>

          <div className="mt-7 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-stone-950 px-7 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
              }}
              className="border border-stone-300 px-7 py-3 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-8 animate-pulse space-y-4">
          <div className="h-36 bg-stone-200" />
          <div className="h-36 bg-stone-200" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="mt-8 border border-stone-200 p-12 text-center">
          <MapPin
            size={32}
            className="mx-auto text-stone-400"
          />

          <h2 className="mt-5 font-serif text-2xl">
            No saved addresses
          </h2>

          <p className="mt-3 text-sm text-stone-500">
            Add an address to make checkout faster.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="border border-stone-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MapPin size={19} />

                  <h2 className="font-semibold">
                    {address.name}
                  </h2>
                </div>

                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-1 text-[10px] font-bold tracking-[0.1em]">
                    <Star size={11} />
                    DEFAULT
                  </span>
                )}
              </div>

              <div className="mt-5 text-sm leading-6 text-stone-600">
                <p>{address.addressLine1}</p>

                {address.addressLine2 && (
                  <p>{address.addressLine2}</p>
                )}

                <p>
                  {address.city}, {address.state}
                </p>

                <p>
                  {address.postalCode}, {address.country}
                </p>

                <p className="mt-2">
                  {address.phone}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4 border-t border-stone-200 pt-5">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSetDefault(address._id)
                    }
                    className="text-xs font-semibold text-stone-600 hover:text-stone-950"
                  >
                    Make Default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(address._id)
                  }
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Addresses;