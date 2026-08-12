import { useState } from "react";

const initialForm = {
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

const AddressForm = ({
  onSubmit,
  onCancel,
  saving = false,
}) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5 border border-stone-200 p-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            FULL NAME
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            PHONE
          </label>

          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            value={form.phone}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
            placeholder="10-digit mobile number"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wide">
          ADDRESS LINE 1
        </label>

        <input
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          required
          className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
          placeholder="House number, street"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold tracking-wide">
          ADDRESS LINE 2
        </label>

        <input
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
          placeholder="Apartment, landmark, etc."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            CITY
          </label>

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            STATE
          </label>

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            PIN CODE
          </label>

          <input
            name="postalCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
            value={form.postalCode}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
            placeholder="6-digit PIN code"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide">
            COUNTRY
          </label>

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            className="h-12 w-full border border-stone-300 px-4 text-sm outline-none focus:border-stone-950"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />

        Make this my default address
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-stone-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="border border-stone-300 px-6 py-3 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;