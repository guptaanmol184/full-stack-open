
const Filter = ({ nameFilter, setNameFilter }) => {
    return (
        <div>
            filter shown with:
            <input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)} />
        </div>
    )
}

export default Filter