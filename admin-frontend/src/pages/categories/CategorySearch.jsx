import { useState, useEffect } from "react";
import { HTTP } from "../../utils/http.js";
import Input from "../../components/Input.jsx";
import Button from "../../components/Button.jsx";

const CategorySearch = ({ onSelectCategory, selectedCategoryId }) => {
  const URL = "/api/categories/";
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Create a map of categories and compute category paths
  useEffect(() => {
    if (categories.length > 0) {
      // Create a map for quick lookup
      const catMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat;
        return acc;
      }, {});
      
      setCategoriesMap(catMap);
      
      // Process and set initial filtered categories
      const processedCategories = categories.map(cat => ({
        ...cat,
        path: getCategoryPath(cat.id, catMap)
      }));
      
      setFilteredCategories(processedCategories);
    }
  }, [categories]);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await HTTP("GET", URL, "", "");
      setCategories(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
      setIsLoading(false);
    }
  };

  // Get the full category path
  const getCategoryPath = (categoryId, catMap) => {
    const paths = [];
    let currentCat = catMap[categoryId];
    
    while (currentCat) {
      paths.unshift(currentCat.name);
      currentCat = currentCat.parent_id ? catMap[currentCat.parent_id] : null;
    }
    
    return paths.join(" > ");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      setFilteredCategories(categories.map(cat => ({
        ...cat,
        path: getCategoryPath(cat.id, categoriesMap)
      })));
    } else {
      const filtered = categories.filter(
        category => 
          category.name.toLowerCase().includes(value.toLowerCase()) ||
          category.description?.toLowerCase().includes(value.toLowerCase()) ||
          category.slug.toLowerCase().includes(value.toLowerCase()) ||
          getCategoryPath(category.id, categoriesMap).toLowerCase().includes(value.toLowerCase())
      ).map(cat => ({
        ...cat,
        path: getCategoryPath(cat.id, categoriesMap)
      }));
      
      setFilteredCategories(filtered);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredCategories(categories.map(cat => ({
      ...cat,
      path: getCategoryPath(cat.id, categoriesMap)
    })));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Search Categories</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by name, path, description or slug..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Button onClick={handleClearSearch}>Clear</Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
          </p>
          
          {filteredCategories.length > 0 ? (
            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => {
                    // Skip rendering the current category in edit mode
                    if (selectedCategoryId && category.id === selectedCategoryId) {
                      return null;
                    }
                    
                    return (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{category.path}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            category.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {category.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button 
                            className="mr-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => onSelectCategory(category)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No categories match your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;