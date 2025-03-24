import { type FormEvent, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(AppContext);
  const location = useLocation();
  const { username: initialUsername } = location.state || {}; // Extract username from state
  const [username, setUsername] = useState(initialUsername || ''); // Initialize with state value or empty string

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sign-in`,
        req
      );
      if (!res.ok) throw new Error(`fetch error ${res.status}`);
      const { user, token } = await res.json();

      signIn(user, token);
      alert(`Signed in as ${user.username}`);
      navigate('/');
    } catch (error) {
      console.error('error logging in ', error);
      alert(`Error signing in: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuest() {
    try {
      setIsLoading(true);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'guest', password: 'guest_password' }),
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sign-in-guest`,
        req
      );
      if (!res.ok) throw new Error(`fetch error ${res.status}`);
      const { user, token } = await res.json();

      signIn(user, token);
      alert(`Signed in as guest: ${user.username}`);
      navigate('/');
    } catch (error) {
      console.error('Error logging in as guest:', error);
      alert(`Error signing in as guest: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-[620px] w-full flex flex-col gap-4 p-4 border border-black rounded-md">
        <h1 className="text-xl font-semibold">Sign in to your account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-base font-medium">
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="text" // Changed from "username" to "text" (correct input type)
              autoComplete="username"
              required
              value={username} // Controlled input with pre-populated value
              onChange={(e) => setUsername(e.target.value)} // Update state on change
              className="border border-black rounded-md p-2 text-base focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-base font-medium">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border border-black rounded-md p-2 text-base focus:outline-none"
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-min whitespace-nowrap px-4 py-[6px] border border-black rounded-md hover:text-white bg-emerald text-base">
              Sign in
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-6 text-base">
          <Link to="/sign-up" className="group relative">
            Create Account
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
          <a onClick={handleGuest} className="group relative cursor-pointer">
            Guest Sign In
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
          </a>
        </div>
      </div>
    </div>
  );
}
