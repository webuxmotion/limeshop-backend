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
        images: []
    });
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        if (data) {
            setFormValues({
                title: data?.title || "",
                category: data?.category || "",
                description: data?.description || "",
                price: data?.price || "",
                images: data?.images || []
            });
        }
    }, [data]);

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
