import { Route } from "react-router-dom";
import CategoriesRoutes from "./categoriesRoutes";
import ProductsRoutes from "./productsRoutes";
// import ImageRoutes from  "./imageRoutes"
const AppRoutes = () => {
  return (
    <>
      {CategoriesRoutes()}
      {ProductsRoutes()}
      {/* {ImageRoutes()} */}
    </>
  );
};

export default AppRoutes;
