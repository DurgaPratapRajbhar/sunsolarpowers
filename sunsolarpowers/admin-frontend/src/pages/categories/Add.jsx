import { useActionState,useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import BackButton from "../../components/BackButton";
import { formValidation, validateSlug, validateImage } from "../../services/categoryValidation.js";
import { HTTP } from "../../utils/http.js";

 
 

const AddCategory = () => {
  const URL="/api/categories/";
  const [parentCategories, setParentCategories] = useState([]);
  const hasFetched = useRef(false); // Track if function has been called

  const fetchCategories = async () => {
    try {
    
      const response = await HTTP("GET", URL, "", "");
      const formattedData=  response.data.map(cat => ({
        value: String(cat.id),
        name: cat.name
      }));

      setParentCategories(formattedData|| []);
    } catch (err) {
      // toast.error(err.message || "Failed to get categories!");
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCategories();
      hasFetched.current = true; // Mark as executed
    }
  }, []);

 
  const navigate = useNavigate();
   

  const statusCategories = [
    { value: "active", name: "Active" },
    { value: "inactive", name: "Inactive" },
  ];

  const [error, handleSubmit, isPending] = useActionState(
    async (previousState, formData) => {

      let errors = {};
      errors.name = formValidation(formData.get("name"), "Name");
      errors.slug = validateSlug(formData.get("slug"));
      errors.description = formValidation(formData.get("description"), "Description", 10, 500);
      errors.status = formValidation(formData.get("status"), "Status");

     const categoryImage=formData.get("image")
     if (categoryImage && categoryImage.size > 0) {
      const imageError = await validateImage(categoryImage, "Category Image", {
        maxSize: 2 * 1024 * 1024, // 2MB
        minWidth: 500,
        minHeight: 500,
        square: true,
      });
      if (imageError.error) errors.image = imageError.error;
    }
      
      
      const filteredErrors = Object.fromEntries(
        Object.entries(errors).filter(([_, value]) => value)  
      );
  
      if (Object.keys(filteredErrors).length > 0) {
        toast.error("Validation errors found!");
        return filteredErrors;
      }

       try {
        const response = await HTTP("POST", URL, formData, "");
        toast.success("Category created successfully!");
        return { error: null };
      } catch (err) {
        return { error: err.message || "An unexpected error occurred" };
      }
      
    },
    { error: null }
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <BackButton>➕ Add Category</BackButton>
 


      <ToastContainer />

      {error.error && <span className="text-red-600 text-sm">{error.error}</span>}

      <form action={handleSubmit}   className="mt-6 space-y-6">
        <div>
          <Label>Category Name:</Label>
          <Input type="text" name="name" />
          {error.name && <span className="text-red-600 text-sm">{error.name}</span>}
        </div>

        <div>
          <Label>Slug:</Label>
          <Input type="text" name="slug" />
          {error.slug && <span className="text-red-600 text-sm">{error.slug}</span>}
        </div>

        <div>
          <Label>Parent Category:</Label>
          <Select name="parent_id"  data={parentCategories} defaultValue={0}  defaultName="None"   />
          {error.parent_category && <span className="text-red-600 text-sm">{error.parent_category}</span>}
        </div>

        <div>
          <Label>Description:</Label>
          <Textarea name="description" className="mt-4" placeholder="Describe your product" color="green" />
          {error.description && <span className="text-red-600 text-sm">{error.description}</span>}
        </div>

        <div>
          <Label>Image:</Label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border border-gray-400 rounded px-4 py-2 text-lg focus:ring-2 focus:ring-green-500 transition"
          />
          {error.image && <span className="text-red-600 text-sm">{error.image}</span>}
        </div>

        <div>
          <Label>Status:</Label>
          <Select name="status" data={statusCategories} value="inactive" defaultName="Select Status" />
          {error.status && <span className="text-red-600 text-sm">{error.status}</span>}
        </div>

        <div className="flex justify-between">
          <Button  onClick={() => navigate(-1)}>❌ Cancel</Button>
          <Button type="submit" disabled={isPending}>✅ Add Category</Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
