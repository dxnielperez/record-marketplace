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
    <>
      <div className="login-img"></div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 login-bg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-24 w-auto"
            src="/records.jpg"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Create account
          </h2>
        </div>
        <div className="mt-10 mb-48 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#8075ff] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Create
              </button>
            </div>
          </form>
          <Link
            className="mt-6 flex justify-center hover:underline cursor-pointer"
            to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
