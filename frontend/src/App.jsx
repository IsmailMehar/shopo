import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import CartPanel from "./components/CartPanel";

const API = "http://localhost:5000/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2500);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();

    console.log("products response:", data);

    if (!res.ok) {
      throw new Error(data.error || "Failed to load products.");
    }

    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchCart = async () => {
    const res = await fetch(`${API}/cart`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load cart.");
    }

    setCartItems(Array.isArray(data) ? data : []);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCart()]);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add item to cart.");
      }

      await fetchCart();
      showMessage("Item added to cart.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleUpdateCartQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update cart item.");
      }

      await fetchCart();
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove cart item.");
      }

      await fetchCart();
      showMessage("Item removed from cart.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const categories = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    return [...new Set(
      safeProducts
        .map((product) => product?.category)
        .filter(Boolean)
    )].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    return safeProducts.filter((product) => {
      const name = product?.name ?? "";
      const category = product?.category ?? "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Shopo</h1>
          <p className="subtitle">Your dynamic shopping cart</p>
        </div>

        <div className="topbar-badge">
          Cart items: {cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
        </div>
      </header>

      {message.text && (
        <div className={`message ${message.type === "error" ? "message-error" : "message-success"}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading application data...</div>
      ) : (
        <main className="main-layout">
          <section className="content-column">
            <FilterBar
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            <section className="panel">
              <div className="panel-header">
                <h2>Products</h2>
                <span className="results-count">{filteredProducts.length} shown</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <p>No products match your current search or filter.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </section>
          </section>

          <CartPanel
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveCartItem}
          />
        </main>
      )}
    </div>
  );
}