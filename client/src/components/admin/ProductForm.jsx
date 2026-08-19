import { useEffect, useMemo } from "react";
import { X } from "lucide-react";

const ProductForm = ({
  form,
  categories,
  editingProduct,
  saving,
  onChange,
  onSubmit,
  onClose,
  onFormChange,
}) => {
  const imageFilePreviews = useMemo(
    () =>
      form.imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [form.imageFiles]
  );

  useEffect(() => {
    return () => {
      imageFilePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imageFilePreviews]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8">
      <div className="mx-auto max-w-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400">
              PRODUCT MANAGEMENT
            </p>
            <h2 className="mt-1 font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                placeholder="Example: Vanta Leather Tote"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                className="mt-2 w-full resize-none border border-stone-300 p-3 text-sm outline-none focus:border-stone-950"
                placeholder="Describe the product..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                placeholder="2999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Compare At Price</label>
              <input
                name="compareAtPrice"
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                placeholder="3999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={onChange}
                disabled={Boolean(editingProduct)}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm uppercase outline-none focus:border-stone-950 disabled:bg-stone-100"
                placeholder="VB-TOTE-001"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Material</label>
              <input
                name="material"
                value={form.material}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                placeholder="Leather"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Color</label>
              <input
                name="color"
                value={form.color}
                onChange={onChange}
                className="mt-2 h-11 w-full border border-stone-300 px-3 text-sm outline-none focus:border-stone-950"
                placeholder="Black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Product Images</label>
              <label
                htmlFor="product-images"
                className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-50 px-5 py-7 text-center hover:border-stone-950 hover:bg-white"
              >
                <span className="text-2xl">📷</span>
                <span className="mt-2 text-sm font-semibold">Choose Images</span>
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
                    onFormChange((current) => ({
                      ...current,
                      imageFiles: [...current.imageFiles, ...files],
                    }));
                    event.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              {(form.existingImages.length > 0 || form.imageFiles.length > 0) && (
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
                          onFormChange((current) => ({
                            ...current,
                            existingImages: current.existingImages.filter(
                              (_, imageIndex) => imageIndex !== index
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
                          onFormChange((current) => ({
                            ...current,
                            imageFiles: current.imageFiles.filter(
                              (_, fileIndex) => fileIndex !== index
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

            <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
                className="h-4 w-4"
              />
              <span className="text-sm">Mark as featured product</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-stone-200 pt-5">
            <button
              type="button"
              onClick={onClose}
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
};

export default ProductForm;
