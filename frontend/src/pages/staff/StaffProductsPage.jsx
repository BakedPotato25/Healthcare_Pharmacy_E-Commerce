import { useEffect, useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { createProduct, deleteProduct, getCategories, getProducts, updateProduct } from "../../api/productApi.js";
import { normalizeStaffProduct } from "../../api/normalizers.js";
import ModalForm from "../../components/staff/ModalForm.jsx";
import ProductTable from "../../components/staff/ProductTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { inventoryRows } from "../../data/staffMockData.js";

const emptyForm = {
  id: null,
  name: "",
  brand: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  image_url: "",
};

export default function StaffProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFallback = notice.startsWith("Using fallback");
  const tableProducts = useMemo(() => (isFallback ? inventoryRows : products), [isFallback, products]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts(successNotice = "") {
    try {
      const [categoryData, productData] = await Promise.all([
        getCategories(),
        getProducts({ is_active: "true" }),
      ]);
      setCategories(categoryData);
      setProducts(productData.map(normalizeStaffProduct));
      setNotice(successNotice);
    } catch {
      setCategories([]);
      setProducts([]);
      setNotice("Using fallback inventory because the API Gateway or product service is unavailable.");
    }
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleEdit = (product) => {
    if (isFallback) {
      setNotice("Fallback inventory cannot be edited. Start the backend services to manage products.");
      return;
    }
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.rawPrice,
      stock: product.stock,
      category: product.categoryId,
      description: product.description,
      image_url: product.imageUrl,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        price: form.price,
        stock: Number(form.stock),
        category: Number(form.category),
        description: form.description,
        image_url: form.image_url || "https://example.com/images/products/pharmacare-product.jpg",
        is_active: true,
      };
      if (form.id) {
        await updateProduct(form.id, payload);
        await loadProducts("Product updated through /api/products/:id/.");
      } else {
        await createProduct(payload);
        await loadProducts("Product created through /api/products/.");
      }
      setForm(emptyForm);
    } catch (apiError) {
      setNotice(apiError.message || "Unable to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (isFallback) {
      setNotice("Fallback inventory cannot be archived. Start the backend services to manage products.");
      return;
    }
    try {
      await deleteProduct(product.id);
      await loadProducts("Product archived through DELETE /api/products/:id/.");
    } catch (apiError) {
      setNotice(apiError.message || "Unable to archive product.");
    }
  };

  return (
    <StaffShell title="Product Inventory" subtitle="Manage healthcare product catalog records through the API Gateway.">
      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {["All Categories", "Stock Status", "Active Products"].map((label) => (
            <button key={label} className="inline-flex h-10 items-center gap-2 rounded-xl border border-pharmacare-line bg-white px-4 text-sm font-semibold text-pharmacare-muted hover:bg-pharmacare-low">
              <Filter size={16} />
              {label}
            </button>
          ))}
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-pharmacare-primary px-4 text-sm font-semibold text-white hover:bg-pharmacare-primaryHover" onClick={() => setForm(emptyForm)}>
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ProductTable products={tableProducts} notice={isFallback ? `${tableProducts.length} fallback products shown` : `${tableProducts.length} products loaded from /api/products/`} onEdit={handleEdit} onDelete={handleDelete} />
        <ModalForm title={form.id ? "Edit Product" : "Add New Product"} categories={categories} form={form} isSubmitting={isSubmitting} onChange={handleChange} onSubmit={handleSubmit} onCancel={() => setForm(emptyForm)} />
      </div>
    </StaffShell>
  );
}
