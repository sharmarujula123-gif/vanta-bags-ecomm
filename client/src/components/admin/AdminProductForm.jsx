import { X } from "lucide-react";

export default function AdminProductForm({
  showForm,
  editingProduct,
  form,
  categories,
  saving,
  imageFilePreviews,
  handleChange,
  handleSubmit,
  closeForm,
  setForm,
}) {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8">
          <div className="mx-auto max-w-2xl bg-white shadow-xl">

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400">
                  PRODUCT MANAGEMENT
                </p>

                <h2 className="mt-1 font-serif text-2xl">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Product Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Example: Vanta Leather Tote"
                  />
                </div>

                {/* Description */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 w-full resize-none border border-stone-300 p-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Price */}

                <div>
                  <label className="text-xs font-semibold">
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="2999"
                  />
                </div>

                {/* Compare price */}

                <div>
                  <label className="text-xs font-semibold">
                    Compare At Price
                  </label>

                  <input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    value={form.compareAtPrice}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="3999"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="text-xs font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories
                      .filter((category) => !category.parentCategory)
                      .map((parent) => {
                        const children = categories.filter((category) => {
                          const relation = category.parentCategory;
                          if (!relation) return false;
                          return (
                            (relation._id && String(relation._id) === String(parent._id)) ||
                            String(relation) === String(parent._id)
                          );
                        });

                        return (
                          <optgroup key={parent._id} label={parent.name}>
                            {children.length ? (
                              children.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))
                            ) : (
                              <option value={parent._id}>{parent.name}</option>
                            )}
                          </optgroup>
                        );
                      })}

                    {/* Backward compatibility for older flat categories */}
                    {categories
                      .filter((category) => category.parentCategory && !categories.some((parent) => String(parent._id) === String(category.parentCategory)))
                      .map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* SKU */}

                <div>
                  <label className="text-xs font-semibold">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    disabled={
                      Boolean(editingProduct)
                    }
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm uppercase outline-none focus:border-stone-950 disabled:bg-stone-100"
                    placeholder="VB-TOTE-001"
                  />
                </div>

                {/* Stock */}

                <div>
                  <label className="text-xs font-semibold">
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                  />
                </div>

                {/* Brand */}

                <div>
                  <label className="text-xs font-semibold">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                  />
                </div>

                {/* Material */}

                <div>
                  <label className="text-xs font-semibold">
                    Material
                  </label>

                  <input
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Leather"
                  />
                </div>

                {/* Color */}

                <div>
                  <label className="text-xs font-semibold">
                    Color
                  </label>

                  <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                    placeholder="Black"
                  />
                </div>

                {/* Images */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold">
                    Product Images
                  </label>

                  <label
                    htmlFor="product-images"
                    className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-50 px-5 py-7 text-center hover:border-stone-950 hover:bg-white"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="mt-2 text-sm font-semibold">
                      Choose Images
                    </span>
                    <span className="mt-1 text-[11px] text-stone-400">
                      JPG, JPEG, PNG or WEBP · up to 5 MB each · max 10
                    </span>
                    <input
                      id="product-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []);
                        setForm((current) => ({
                          ...current,
                          imageFiles: [
                            ...current.imageFiles,
                            ...files,
                          ],
                        }));
                        event.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>

                  {(form.existingImages.length > 0 ||
                    form.imageFiles.length > 0) && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {form.existingImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative aspect-square overflow-hidden bg-stone-100"
                        >
                          <img
                            src={image}
                            alt={`${form.name || "Product"} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                existingImages:
                                  current.existingImages.filter(
                                    (_, imageIndex) =>
                                      imageIndex !== index
                                  ),
                              }))
                            }
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-stone-950 shadow hover:bg-white"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {form.imageFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className="group relative aspect-square overflow-hidden bg-stone-100"
                        >
                          <img
                            src={imageFilePreviews[index]?.url}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                imageFiles:
                                  current.imageFiles.filter(
                                    (_, fileIndex) =>
                                      fileIndex !== index
                                  ),
                              }))
                            }
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-stone-950 shadow hover:bg-white"
                            aria-label="Remove selected image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-stone-400">
                    {editingProduct
                      ? "Keep existing images, remove them, or add new images."
                      : "Choose one or more images. The backend uploads them to Cloudinary automatically."}
                  </p>
                </div>

                {/* Featured */}

                <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    Mark as featured product
                  </span>
                </label>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-stone-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="border border-stone-300 px-5 py-3 text-sm font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:bg-stone-400"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
