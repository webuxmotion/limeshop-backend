const Properties = ({
    properties,
    handleAddNewPropertyClick,
    handlePropertyNameChange,
    handlePropertyValuesChange,
    removeProperty,
}) => {

    return (
        <div className="mb-2">
            <label className="block">Properties</label>
            {properties.length > 0 && properties.map((property, index) => (
                <div key={index} className="flex gap-1 mb-1">
                    <input
                        className="mb-0"
                        type="text"
                        placeholder="property name (example: color)"
                        value={property.name}
                        onChange={(event) => handlePropertyNameChange(index, event.target.value)}
                    />
                    <input
                        className="mb-0"
                        type="text"
                        placeholder="values, comma separated"
                        value={property.values}
                        onChange={(event) => handlePropertyValuesChange(index, event.target.value)}
                    />
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => removeProperty(index)}
                    >Remove</button>
                </div>
            ))}
            <button
                type="button"
                className="btn-secondary"
                onClick={handleAddNewPropertyClick}
            >Add new property</button>
        </div>
    );
}

export default Properties;