import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({ data }) {
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        price: "",
    });
    const [goToProducts, setGoToProducts] = useState(false);

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

    useEffect(() => {
        if (data) {
            setFormValues({
                title: data?.title || "",
                description: data?.description || "",
                price: data?.price || ""
            });
        }
    }, [data]);

    return <form onSubmit={handleSubmit}>
        <label>Product name</label>
        <input
            type="text"
            placeholder="Product name"
            name="title"
            onChange={handleInput}
            value={formValues.title}
        />

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
