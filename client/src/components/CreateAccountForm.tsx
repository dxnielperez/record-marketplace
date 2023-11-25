import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function CreateAccountForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      console.log('userData:', userData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/register', req);
      if (!res.ok) {
        throw new Error(`Fetch error ${res.status}`);
      }
      const user = await res.json();
      console.log(`Registered user: ${user}`);
      navigate('/login');
    } catch (error) {
      alert(`Error creating account: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-[#E9EBED] min-h-screen flex items-center justify-center p-4 text-lg">
      <div className="bg-white rounded-2xl max-w-xl mx-auto w-full p-8">
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-6">
          Create account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full mt-1 p-2 border rounded-md text-gray-900 focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full mt-1 p-2 border rounded-md text-gray-900 focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
              Create
            </button>
          </div>
        </form>
        <Link
          className="mt-6 text-center text-sm text-indigo-600 hover:underline cursor-pointer"
          to="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
