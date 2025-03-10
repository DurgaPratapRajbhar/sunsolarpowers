import { useActionState, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { formValidation, validateSlug  } from "../../services/productValidation.js";
import { HTTP } from "../../utils/http.js";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    
    const navigate = useNavigate();
    const [getCategoryData, setCategories] = useState([]);

    const [error, handleSubmit, isPending] = useActionState(
        async (previousState, formData) => {
            let errors = {};

            errors.name = formValidation(formData.get("name"), "Name", { minLength: 3, maxLength: 255 });
            errors.description = formValidation(formData.get("description"), "Description", { minLength: 5, maxLength: 500 });
            // errors.slug = validateSlug(formData.get("slug"));
            errors.price = formValidation(formData.get("price"), "Price", { isNumber: true, min: 1 });
            errors.discount = formValidation(formData.get("discount"), "Discount", { isNumber: true, min: 0, max: 100 });
            errors.stock = formValidation(formData.get("stock"), "Stock", { isNumber: true, min: 0 });
            errors.brand = formValidation(formData.get("brand"), "Brand", { minLength: 2, maxLength: 100 });
            // errors.sku = validateSKU(formData.get("sku"));
            errors.sta

            const filteredErrors = Object.fromEntries(
                Object.entries(errors).filter(([_, value]) => value)
            );

            console.log(filteredErrors)

            if (Object.keys(filteredErrors).length > 0) {
                toast.error("Validation errors found!");
                return filteredErrors;
            }

            const formDataObject = {
                "category_id": parseInt(formData.get("category_id")) || 0,
                "discount": parseFloat(formData.get("discount")) || 0.0,
                "price": parseFloat(formData.get("price")) || 0.0,
                "stock": parseInt(formData.get("stock")) || 0,
                "brand": formData.get("brand") || "",
                "name": formData.get("name") || "",
                "description": formData.get("description") || "",
                // "slug": formData.get("slug") || "",
                "status": formData.get("status") || "",
                
            };

            try {
                const response = await HTTP("POST", "/api/products/", formDataObject, "");
                toast.success(response.message);
                navigate("/products");
                return { ...previousState, successMessage: "Product added successfully!" };
            } catch (err) {
                // console.log(err);
                return { ...previousState, error: err.message || "An error occurred." };
            }
        },
        { error: null }
    );

    const onSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        handleSubmit(formData);

        
    };

    const statusCategories = [
        { value: "active", name: "Active" },
        { value: "inactive", name: "Inactive" },
    ];

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        try {
            const response = await HTTP("GET","/api/categories/", "", "");
            setCategories(response.data.map(cat => ({
                value: String(cat.id),
                name: cat.name
            })));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <BackButton>➕ Add Product</BackButton>
                <ToastContainer />
                {error.error && <span className="text-red-600 text-sm">{error.error}</span>}
                <form onSubmit={onSubmit} className="mt-6 space-y-6">

                    
                      <div>
                        <Label>Categories:</Label>
                        <Select name="category_id" data={getCategoryData} defaultName="Select Categories" />
                        {error.category_id && <span className="text-red-600 text-sm">{error.category_id}</span>}
                    </div>

                    <div>
                        <Label>Product Name:</Label>
                        <Input type="text" name="name" />
                        {error.name && <span className="text-red-600 text-sm">{error.name}</span>}
                    </div>

                    <div>
                        <Label>Description:</Label>
                        <Textarea name="description" placeholder="Describe your product" />
                        {error.description && <span className="text-red-600 text-sm">{error.description}</span>}
                    </div>

                    <div>
                        <Label>Price:</Label>
                        <Input 
                            type="number" 
                            name="price" 
                            min={1} 
                            // max={10000} 
                            maxLength={7}
                            onChange={(e) => console.log(e.target.value)}
                            />


                        {error.price && <span className="text-red-600 text-sm">{error.price}</span>}
                    </div>

                    <div>
                        <Label>Brand:</Label>
                        <Input type="text" name="brand" />
                        {error.brand && <span className="text-red-600 text-sm">{error.brand}</span>}
                    </div>


                    <div>
                        <Label>Discount:</Label>
                         

                        <Input 
                            type="decimal" 
                            name="discount" 
                            min={1} 
                            max={999} 
                            maxLength={5}
                        onChange={(e) => console.log(e.target.value)}
                        />

                        {error.discount && <span className="text-red-600 text-sm">{error.discount}</span>}
                    </div>

                    <div>
                        <Label>Stock:</Label>
                        <Input 
                            type="number" 
                            name="stock" 
                            min={1} 
                            max={999} 
                            maxLength={3}
                        onChange={(e) => console.log(e.target.value)}
                        />
                        {error.stock && <span className="text-red-600 text-sm">{error.stock}</span>}
                    </div>

                    {/* <div>
                        <Label>SKU:</Label>
                        <Input type="text" name="sku" />
                        {error.sku && <span className="text-red-600 text-sm">{error.sku}</span>}
                    </div> */}

                  {/*  <div>
                        <Label>Slug:</Label>
                        <Input type="text" name="slug" />
                        {error.sku && <span className="text-red-600 text-sm">{error.slug}</span>}
                    </div> */}

                     

                    <div>
                        <Label>Status:</Label>
                        <Select name="status" data={statusCategories} defaultName="Select Status" />
                        {error.status && <span className="text-red-600 text-sm">{error.status}</span>}
                    </div>

                    <div className="flex justify-between">
                        <Button onClick={() => navigate(-1)}>❌ Cancel</Button>
                        <Button type="submit" disabled={isPending}>✅ Add Product</Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
