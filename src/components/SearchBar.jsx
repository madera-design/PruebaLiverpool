function SearchBar({ onSubmit, onReset, value, onChange, isLoading }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <label htmlFor="product-search">Buscar pokemon</label>
      <div className="search-bar__controls">
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="Ej. pikachu, charizard, mew"
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading}>
          Buscar
        </button>
        <button type="button" className="secondary-button" onClick={onReset}>
          Limpiar
        </button>
      </div>
    </form>
  )
}

export default SearchBar
