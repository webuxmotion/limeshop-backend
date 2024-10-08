import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import { useEffect, useState } from "react";
import Properties from "@/components/Properties";

const preparePropertiesForSending = (properties) => {
    return properties.map(p => ({
        name: p.name,
        values: p.values.split(',')
    }))
}

const Categories = ({ swal }) => {
    const [name, setName] = useState("");
    const [items, setItems] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [editId, setEditId] = useState("");
    const [editValue, setEditValue] = useState("");
    const [editParentCategoryValue, setEditParentCategoryValue] = useState("");
    const [properties, setProperties] = useState([]);

    const resetEditValues = () => {
        setEditId("");
        setEditValue("");
        setEditParentCategoryValue("");
        setProperties([]);
    }

    const fetchItems = () => {
        axios.get('/api/categories').then(result => {
            setItems(result.data);
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/categories', {
            name,
            parentCategory,
            properties: preparePropertiesForSending(properties)
        });

        setName('');
        setParentCategory('');
        setProperties([]);

        fetchItems();
    }

    const handleInputChange = (event) => {
        setName(event.target.value);
    }

    const handleParentCategoryInputChange = (event) => {
        setParentCategory(event.target.value);
    }

    const handleEditClick = ({ id, value, parent, properties }) => {
        setEditId(id);
        setEditValue(value);
        if (parent) {
            setEditParentCategoryValue(parent);
        } else {
            setEditParentCategoryValue("");
        }
        if (properties?.length) {
            setProperties(properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            })));
        } else {
            setProperties([]);
        }
    }

    const handleSave = async () => {
        await axios.put('/api/categories', {
            _id: editId,
            name: editValue,
            parentCategory: editParentCategoryValue,
            properties: preparePropertiesForSending(properties)
        });

        fetchItems();
        resetEditValues();
    }

    const handleDelete = (category) => {
        swal.fire({
            title: 'Delete category',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: "#d55"
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete(`/api/categories?id=${category._id}`);
                fetchItems();
            }
        });
    }

    const handleAddNewPropertyClick = () => {
        setProperties(prev => {
            return [
                ...prev,
                {
                    name: '',
                    values: ''
                }
            ]
        })
    }

    const handlePropertyNameChange = (index, value) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = value;

            return properties;
        });
    }

    const handlePropertyValuesChange = (index, value) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = value;

            return properties;
        });
    }

    const removeProperty = (index) => {
        setProperties(prev => {
            const newProperties = [...prev].filter((_, propertyIndex) => {
                return propertyIndex !== index;
            });

            return newProperties;
        })
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return <Layout>
        <h1>Categories</h1>
        <form onSubmit={handleSubmit}>
            <div className="flex gap-1">
                <div>
                    <label> New category name</label>
                    <input
                        type="text"
                        value={name}
                        placeholder="Category name"
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Parent category</label>
                    <select
                        onChange={handleParentCategoryInputChange}
                        value={parentCategory}
                    >
                        <option value="">No parent category</option>
                        {items.length > 0 && items.map((item) => (
                            <option value={item._id} key={item?._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!editId ? (
                <Properties
                    properties={properties}
                    handleAddNewPropertyClick={handleAddNewPropertyClick}
                    handlePropertyNameChange={handlePropertyNameChange}
                    handlePropertyValuesChange={handlePropertyValuesChange}
                    removeProperty={removeProperty}
                />
            ) : null}

            <button type="submit" className="btn-primary">Save</button>
        </form>
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td>Category name</td>
                    <td>Parent category</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {items.length > 0 && items.map((item) => (
                    <tr key={item?._id}>
                        <td>
                            {editId === item._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={event => setEditValue(event.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    {item.name}
                                </>
                            )}

                        </td>
                        <td>
                            {editId === item._id ? (
                                <>
                                    <select
                                        className="mb-0"
                                        onChange={(event) => setEditParentCategoryValue(event.target.value)}
                                        value={editParentCategoryValue}
                                    >
                                        <option value="">No parent category</option>
                                        {items.length > 0 && items.map((category) => (
                                            <option
                                                value={category._id}
                                                key={category?._id}
                                                disabled={item._id === category?._id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <Properties
                                        properties={properties}
                                        handleAddNewPropertyClick={handleAddNewPropertyClick}
                                        handlePropertyNameChange={handlePropertyNameChange}
                                        handlePropertyValuesChange={handlePropertyValuesChange}
                                        removeProperty={removeProperty}
                                    />
                                </>
                            ) : (
                                <>
                                    {item?.parent?.name}
                                </>
                            )}
                        </td>
                        <td>
                            {editId === item._id ? (
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={resetEditValues}
                                    >Cancel</button>
                                    <button
                                        className="btn-primary flex items-center gap-1"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-1">
                                    <button
                                        className="btn-primary flex items-center gap-1"
                                        onClick={() => handleEditClick({
                                            id: item._id,
                                            value: item.name,
                                            parent: item?.parent?._id,
                                            properties: item?.properties
                                        })}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        className="btn-primary flex items-center gap-1"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            )}

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
}

export default withSwal(({ swal }, ref) => {
    return <Categories
        swal={swal}
    />
});