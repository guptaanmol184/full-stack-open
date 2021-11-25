
const Country = ({ country }) => {
    return (
        <>
            <h2>{country.name.common}</h2>
            <p>Official Name: {country.name.official}</p>
            <p>Capital: {country.capital.toString()}</p>
            <p>Population: {country.population}</p>
            <h4>Languages</h4>
            <ul>
                {
                    Object.values(country.languages)
                        .map(language =>
                            <li key={language}>
                                {language}
                            </li>
                        )
                }
            </ul>
            <br />
            <img
                width='100'
                height='100'
                alt={country.flag}
                src={country.flags.png} />
        </>
    )
}

export default Country;