export default function ProductCard({ product, onAddToCart }) {
  const outOfStock = Number(product.stock) <= 0;

  return (
    <article className="product-card">
      <img
        src={product.image_url || "https://placehold.co/300x200?text=No+Image"}
        alt={product.name}
        className="product-image"
      />

      <div className="product-body">
        <div className="product-top">
          <h3>{product.name}</h3>
          <span className="category-badge">{product.category}</span>
        </div>

        <p className="product-description">
          {product.description || "No description provided."}
        </p>

        <div className="product-meta">
          <span className="price">${Number(product.price).toFixed(2)}</span>
          <span className={outOfStock ? "stock stock-out" : "stock"}>
            {outOfStock ? "Out of stock" : `Stock: ${product.stock}`}
          </span>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product.id)}
            disabled={outOfStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}