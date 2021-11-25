
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
            <div style={{ height: '100px' }}>
                <img
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}
                    alt={country.flag}
                    src={country.flags.png} />
            </div>
        </>
    )
}

export default Country;