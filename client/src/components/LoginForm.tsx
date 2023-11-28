import { type FormEvent, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(AppContext);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/sign-in', req);
      if (!res.ok) throw new Error(`fetch error ${res.status}`);
      const { user, token } = await res.json();

      signIn(user, token);

      console.log('Signed in:', user, 'Recieved token:', token);
      alert(`Signed in as ${user.username}`);
      navigate('/');
    } catch (error) {
      console.error('error loging in ', error);
      alert(`Error signing in: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-[ghostwhite] min-h-screen flex items-start pt-[4rem] justify-center p-4 text-lg">
      <div className="bg-white rounded-2xl max-w-xl mx-auto w-full p-8">
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-6">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="username"
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
              autoComplete="current-password"
              required
              className="w-full mt-1 p-2 border rounded-md text-gray-900 focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
              Sign in
            </button>
          </div>
        </form>
        <Link
          className="mt-6 text-center text-sm text-indigo-600 hover:underline cursor-pointer"
          to="/createAccount">
          Create Account
        </Link>
      </div>
    </div>
  );
}
