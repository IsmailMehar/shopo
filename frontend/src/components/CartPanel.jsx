export default function CartPanel({ cartItems, onUpdateQuantity, onRemove }) {
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <aside className="panel cart-panel">
      <div className="panel-header">
        <h2>Shopping Cart</h2>
        <span className="cart-count">
          {cartItems.reduce((sum, item) => sum + Number(item.quantity), 0)} items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image_url || "https://placehold.co/300x200?text=No+Image"}
                  alt={item.name}
                  className="cart-thumb"
                />

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${Number(item.price).toFixed(2)} each</p>
                  <p className="small-text">Available stock: {item.stock}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button className="btn btn-danger btn-small" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </aside>
  );
}