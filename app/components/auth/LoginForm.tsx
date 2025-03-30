"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during Google authentication");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLoginMode ? "Log In" : "Sign Up"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : isLoginMode ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
              />
              <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
              />
              <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
              />
              <path
                fill="#EA4335"
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
              />
            </g>
          </svg>
          {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isLoginMode
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
}