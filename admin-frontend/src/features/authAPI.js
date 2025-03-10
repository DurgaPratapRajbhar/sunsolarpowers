export const loginAPI = async (credentials) => {
  const response = await fetch('http://localhost:8081/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};
