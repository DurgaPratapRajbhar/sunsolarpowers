const Register = () => {
  return (
    <div className="flex justify-center items-center  ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-2 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-2 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="mt-2 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
            />
          </div>

          <div className="mb-4 flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
