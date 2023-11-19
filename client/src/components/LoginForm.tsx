import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      localStorage.setItem('token', token);
      console.log('Signed in:', user, 'Recieved token:', token);
      alert(`Signed in as ${user.username}`);
    } catch (error) {
      console.error('error loging in ', error);
      alert(`Error signing in: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="login-img"></div>
      <div className="flex justify-center">
        {/* <img
          className="mx-auto w-1/5 w-auto"
          src="/log-in.jpg"
          alt="Your Company"
        /> */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 login-bg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
            className="mx-auto h-24 w-auto"
            src="/records.jpg"
            alt="Your Company"
          /> */}
            <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 ">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-10 mb-36 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#8075ff] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Sign in
                </button>
              </div>
            </form>
            <Link
              className="mt-6 flex justify-center underline cursor-pointer"
              to="/createAccount">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
