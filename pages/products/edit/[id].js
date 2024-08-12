import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Edit(params) {
    const router = useRouter();
    const { id } = router.query;
    const [productInfo, setProductInfo] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/products?id=${id}`).then(res => {
                setProductInfo(res.data);
            })
        }
        
    }, [id]);

    return <Layout>
        <h1>Edit Product</h1>
        <ProductForm data={productInfo} />
    </Layout>
}