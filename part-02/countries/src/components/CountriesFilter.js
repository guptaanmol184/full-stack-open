
const CountriesFilter = ({ searchCountry, onSearchCountryChange }) =>
    <form onSubmit={(e) => e.preventDefault()}>
        <div>
            find countries:
            <input
                value={searchCountry}
                onChange={onSearchCountryChange} />
        </div>
    </form>

export default CountriesFilter