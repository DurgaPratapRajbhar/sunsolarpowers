import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser  } from "../../features/authSlice";
import { useActionState } from "react";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);


  const login = async (data, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    let errors = [];

    if (!email) {
      errors.push("Please input email");
    }
    if (!password) {
      errors.push("Please input password");
    }

    if (errors.length > 0) {
      return { data: {}, error: errors.join(", ") };
    }

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard');
      }

      return { data: null, error: null };
    } catch (err) {
      return { data: {}, error: err.message };
    }
  };

  const [user, submitAction, isPending] = useActionState(login,{data:null,error:null});

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form action={submitAction}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-2 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required  
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="mt-2 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required  
            />
          </div>

          {user.error && <p className="text-red-500">{user.error}</p>} 

          <div className="mb-4 flex justify-between items-center">
            <button
              disabled={isPending}
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              {isPending ? "Logging in..." : "Login"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Login;