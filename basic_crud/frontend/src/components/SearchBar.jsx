function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <span className="sr-only">Search students</span>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or email"
      />
    </label>
  )
}

export default SearchBar
