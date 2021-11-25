import { useState } from "react"
import Country from "./Country"

const CountryListItem = ({ country }) => {

    const [isSelected, setIsSelected] = useState(false)

    return (
        <div>
            <p> {country.name.common}
                <button
                    onClick={(e) => { setIsSelected(!isSelected) }}>
                    {
                        isSelected ? 'hide' : 'show'
                    }
                </button>
            </p>
            {
                isSelected ?
                    <Country country={country} /> : null
            }
        </div>
    )
}

export default CountryListItem
