export default function FilterBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Browse Products</h2>
      </div>

      <div className="filters">
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}