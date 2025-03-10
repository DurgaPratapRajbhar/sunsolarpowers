import { BrowserRouter as AppRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import AppRoutes from "./router/index";  

const App = () => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = Boolean(token);

  return (
    <AppRouter>
      <Routes>
        
        <Route path="/login" element={<AuthPage />} />

        
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {AppRoutes()}  
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppRouter>
  );
};

export default App;
