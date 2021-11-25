import CountryListItem from './CountryListItem'
import Country from './Country'

const FilteredCountries = ({
  filter = '',
  countryList = []
}) => {

  const countriesToDispaly = countryList.filter(country => {
    return (country.name.common.toLowerCase()
      .indexOf(filter.toLowerCase()) >= 0)
  })

  if (countriesToDispaly.length === 0) {
    return (
      <p>No matching countries found.</p>
    )
  }
  else if (countriesToDispaly.length === 1) {
    return (
      <Country
        country={countriesToDispaly[0]} />
    )
  } else if (countriesToDispaly.length <= 10) {
    return (
      countriesToDispaly.map(country =>
        <CountryListItem
          key={country.name.common}
          country={country} />
      )
    )
  } else {
    return (
      <p>Too many countries, please refine the search term.</p>
    )
  }
}

export default FilteredCountries
