import { useEffect, useState } from "react";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";
import Spinner from "./Spinner";


export default function ProductForm({ data }) {
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        title: "",
        category: "",
        description: "",
        price: "",
        properties: {},
        images: []
    });
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    const handleInput = (event) => {
        setFormValues(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            ...formValues
        };

        if (!dataToSend.category) {
            dataToSend.category = null;
        }

        if (data?._id) {
            // update product
            dataToSend._id = data?._id;
            await axios.put('/api/products', dataToSend);
        } else {
            // create new product
            await axios.post('/api/products', dataToSend);
        }

        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    const uploadImages = async (event) => {
        const files = event.target?.files;

        if (files?.length > 0) {
            const data = new FormData();
            setIsUploading(true);

            for (const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormValues(prevValues => ({
                ...prevValues,
                images: [
                    ...prevValues.images,
                    ...res.data?.links
                ]
            }));

            setIsUploading(false);
        }
    }

    const updateImagesOrder = (images) => {
        setFormValues(prevValues => ({
            ...prevValues,
            images
        }));
    }

    const handlePropertyChange = (name, value) => {
        setFormValues(prevValues => ({
            ...prevValues,
            properties: {
                ...prevValues.properties,
                [name]: value,
            }
        }));
    }

    useEffect(() => {
        if (data) {
            setFormValues({
                title: data?.title || "",
                category: data?.category || "",
                description: data?.description || "",
                price: data?.price || "",
                properties: data?.properties || {},
                images: data?.images || []
            });
        }
    }, [data]);

    console.log(formValues);

    useEffect(() => {
        if (categories.length > 0 && formValues.category) {
            const propertiesCandidate = [];
            let selectedCategory = categories.find((category) => {
                return category._id === formValues.category;
            });
            const selectedCategoryProperties = selectedCategory?.properties;

            if (selectedCategoryProperties?.length > 0) {
                propertiesCandidate.push(...selectedCategoryProperties);
            }

            while (selectedCategory?.parent?._id) {
                const parentCategory = categories.find(({ _id }) => {
                    return _id === selectedCategory?.parent?._id;
                });
                const parentCategoryProperties = parentCategory?.properties;

                if (parentCategoryProperties?.length > 0) {
                    propertiesCandidate.push(...parentCategoryProperties);
                }

                selectedCategory = parentCategory;
            }

            setProperties(propertiesCandidate);
        } else {
            setProperties([]);
        }
    }, [formValues.category, categories]);

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result?.data);
        });
    }, []);

    return <form onSubmit={handleSubmit}>
        <label>Product name</label>
        <input
            type="text"
            placeholder="Product name"
            name="title"
            onChange={handleInput}
            value={formValues.title}
        />

        <label>Category</label>
        <select
            onChange={handleInput}
            name="category"
            value={formValues?.category}
        >
            <option value="">Uncategorized</option>
            {!!categories.length && categories.map((category) => (
                <option
                    value={category._id}
                    key={category._id}
                >{category.name}</option>
            ))}
        </select>

        {properties.length > 0 && (
            <div>
                {properties.map((property, propertyIndex) => {
                    return (
                        <div key={propertyIndex} className="flex gap-1">
                            <span className="w-32">{property.name}</span>
                            <select 
                                className="max-w-md"
                                onChange={(event) => handlePropertyChange(property.name, event.target.value)}
                                value={formValues?.properties?.[property.name]}
                            >
                                <option>-</option>
                                {property.values?.map((propertyValue, propertyValueIndex) => {
                                    return (
                                        <option
                                            key={propertyValueIndex}
                                            value={propertyValue}
                                        >{propertyValue}</option>
                                    )
                                })}
                            </select>
                        </div>
                    )
                })}
            </div>
        )}

        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
            <ReactSortable
                list={formValues.images}
                setList={updateImagesOrder}
                className="flex flex-wrap gap-2"
            >
                {!!formValues.images?.length && formValues.images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" className="h-24 rounded-md" />
                    </div>
                ))}
            </ReactSortable>
            {isUploading && (
                <div className="h-24 flex items-center">
                    <Spinner />
                </div>
            )}
            <label className="w-24 h-24 border items-center justify-center flex rounded-md text-gray-500 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <input onChange={uploadImages} type="file" className="hidden" />
            </label>
            {formValues.images.length ?
                (<></>) :
                (<>
                    <div>No photos in this product</div>
                </>)
            }
        </div>

        <label>Description</label>
        <textarea
            placeholder="Description"
            onChange={handleInput}
            name="description"
            value={formValues.description}
        ></textarea>

        <label>Price (in USD)</label>
        <input
            type="number"
            placeholder="Price"
            name="price"
            onChange={handleInput}
            value={formValues.price}
        />

        <button type="submit" className="btn-primary">Save</button>
    </form>
}
