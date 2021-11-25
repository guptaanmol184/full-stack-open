import axios from 'axios'
import { useState, useEffect } from 'react'
import FilteredCountries from './components/FilteredCountries'
import CountriesFilter from './components/CountriesFilter'

function App() {

  const [countryFilter, setCountryFilter] = useState('')
  const [countryList, setCountryList] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountryList(response.data)
      })
  }, [])

  return (
    <>
      <CountriesFilter
        searchCountry={countryFilter}
        onSearchCountryChange={(e) => setCountryFilter(e.target.value)}
      />
      <FilteredCountries
        filter={countryFilter}
        countryList={countryList}
      />
    </>
  );
}

export default App;
