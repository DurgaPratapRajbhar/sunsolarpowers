import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, Squares2X2Icon ,TrashIcon } from "@heroicons/react/24/solid"; 
import { HTTP } from "../../utils/http.js";


const ProductList = () => {
 
  const IMAGE_URL=import.meta.env.VITE_IMAGE_ROOT
  const [getProducts, setProducts] = useState([]);
  const hendaleuseRef =useRef(false)
  const navigate = useNavigate();  

  useEffect(() => {
    if(!hendaleuseRef.current){
      getAllCategris();
      hendaleuseRef.current=true
    }
  }, []);

  const getAllCategris = async()=>{
    try{
        const response = await HTTP("GET", "/api/products/", "", "");
        setProducts(response.data)
        }catch(err){
           console.log(err)
        }    
  }

 const deletProducts=async(id)=>{
       if (!confirm(`Do you really want to delete products ${id}?`)) {
              return;
       }
       try{
        const response = await HTTP("Delete","/api/products/"+id, "", "");
        if (response.status === 200) {
          setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
        }
       }catch(err){
          console.log(err)
       }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800">📂 Product List</h2>

      <button
        className="bg-green-400 text-white px-4 py-2 rounded mt-4 hover:bg-green-500 transition flex items-center gap-2"
        onClick={() => navigate("/products/add")}
      >
        ➕ Add Product
      </button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Brand</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Slug</th>
            <th className="border px-4 py-2">Discount</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Status</th>
             
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getProducts.map((products, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{products.name}</td>
              <td className="border px-4 py-2">{products.description}</td>
              <td className="border px-4 py-2">{products.price}</td>
              <td className="border px-4 py-2">{products.brand}</td>
              <td className="border px-4 py-2">{products.category.name}</td>
              <td className="border px-4 py-2">{products.slug}</td>
              <td className="border px-4 py-2">{products.discount }</td>
              <td className="border px-4 py-2">{products.stock}</td>
              <td className="border px-4 py-2">{products.sku}</td>
              <td className="border px-4 py-2">{products.status}</td>
               
              <td className="border px-6 py-2">
              <div className="flex flex-row items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => navigate(`/products/edit/${products.id}`)}
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>

                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => navigate(`/products/${products.id}/product-images`)}
                >
                  <Squares2X2Icon className="h-6 w-6" />
                </button>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deletProducts(products.id)}
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

 
export default ProductList;