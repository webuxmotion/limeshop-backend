import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Categories() {
    const [name, setName] = useState("");
    const [items, setItems] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [editId, setEditId] = useState("");
    const [editValue, setEditValue] = useState("");
    const [editParentCategoryValue, setEditParentCategoryValue] = useState("");

    const resetEditValues = () => {
        setEditId("");
        setEditValue("");
        setEditParentCategoryValue("");
    }

    const fetchItems = () => {
        axios.get('/api/categories').then(result => {
            setItems(result.data);
        });
    }

    useEffect(() => {
        fetchItems();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/categories', { name, parentCategory });

        setName('');
        fetchItems();
    }

    const handleInputChange = (event) => {
        setName(event.target.value);
    }

    const handleParentCategoryInputChange = (event) => {
        setParentCategory(event.target.value);
    }

    const handleEditClick = ({ id, value, parent }) => {
        setEditId(id);
        setEditValue(value);
        if (parent) {
            setEditParentCategoryValue(parent);
        }
    }

    const handleSave = async () => {
        await axios.put('/api/categories', { 
            _id: editId,
            name: editValue, 
            parentCategory: editParentCategoryValue 
        });

        fetchItems();
        resetEditValues();
    }

    return <Layout>
        <h1>Categories</h1>
        <form onSubmit={handleSubmit} className="flex gap-1">
            <div>
                <label> New category name</label>
                <input
                    className="mb-0"
                    type="text"
                    value={name}
                    placeholder="Category name"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Parent category</label>
                <select
                    className="mb-0"
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
                                </>
                            ) : (
                                <>
                                    {item?.parent?.name}
                                </>
                            )}
                        </td>
                        <td>
                            {editId === item._id ? (
                                <>
                                    <button
                                        className="btn-primary flex items-center gap-1"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn-primary flex items-center gap-1"
                                        onClick={() => handleEditClick({
                                            id: item._id,
                                            value: item.name,
                                            parent: item?.parent?._id
                                        })}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        Edit
                                    </button>
                                </>
                            )}

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
}
