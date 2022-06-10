import search from "../assets/search.svg";

const Search = () => {
  return (
    <form className="Search">
      <div className="input-group">
        <input type="text" className="search__field" placeholder="Bitcoin.." />
        <button>
          <img src={search} alt="Search icon" />
        </button>
      </div>
    </form>
  );
};

export default Search;
