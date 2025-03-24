import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function CreateAccountForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(''); // State to hold username

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const { username: formUsername } = userData; // Extract username from form data

      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        req
      );
      if (!res.ok) {
        throw new Error(`Fetch error ${res.status}`);
      }
      await res.json();

      // Update state with the username from the form
      setUsername(formUsername as string);

      // Navigate to /login with username in state
      navigate('/login', { state: { username: formUsername } });
    } catch (error) {
      alert(`Error creating account: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-[620px] w-full flex flex-col gap-4 p-4 border border-black rounded-md">
        <h1 className="text-xl font-semibold">Create account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-base font-medium">
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username} // Make it a controlled input
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
              autoComplete="new-password"
              required
              className="border border-black rounded-md p-2 text-base focus:outline-none"
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-min whitespace-nowrap px-4 py-[6px] border border-black rounded-md hover:text-white bg-emerald text-base">
              Create
            </button>
          </div>
        </form>
        <Link
          to="/login"
          className="group relative mt-6 text-base w-min whitespace-nowrap">
          Sign in
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </div>
  );
}
