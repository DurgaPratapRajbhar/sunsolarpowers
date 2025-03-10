import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white fixed left-0 top-0 h-full p-4 border-r-4 border-white">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <nav className="mt-6">
        <NavItem to="/dashboard" label="Dashboard" icon="home" />
        <NavItem to="/categories" label="Categories" icon="folder" />
        <NavItem to="/products" label="Products" icon="box" />
        <NavItem to="/settings" label="Settings" icon="settings" />
      </nav>
    </div>
  );
};

// NavItem Component
const NavItem = ({ to, label, icon }) => {
  const icons = {
    home: "M3 9l9-9m9 9v12H3V9",
    folder: "M3 7h18M3 12h18m-9 6h9",
    box: "M4 6h16M4 12h16m-7 6h7",
    settings: "M12 2L2 7l10 5 10-5zM2 17l10 5 10-5",
  };

  return (
    <Link to={to} className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700">
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path fill="currentColor" d={icons[icon]}></path>
      </svg>
      {label}
    </Link>
  );
};

export default Sidebar;
