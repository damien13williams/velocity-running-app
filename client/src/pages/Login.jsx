import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5008/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save authentication information for this browser tab
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") {
        navigate("/admin/users", { replace: true });
        } else {
        navigate("/dashboard", { replace: true });
        }
        } catch (error) {
        console.error(error);
        setMessage("Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
            <div className="mb-16 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
                V
            </div>

            <div>
                <h1 className="text-xl font-bold text-white">
                Velocity
                </h1>
                <p className="text-sm text-slate-400">
                Team Management
                </p>
            </div>
            </div>

            <div className="max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Built for performance
            </p>

            <h2 className="text-5xl font-bold leading-tight text-white">
                Manage your team.
                <br />
                Build better athletes.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                One platform for coaches and athletes to manage
                training, track progress, and prepare for race day.
            </p>
            </div>
        </div>

        <p className="text-sm text-slate-600">
            Velocity Running Team Management
        </p>
        </div>

        {/* Right side */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
                V
            </div>

            <span className="text-xl font-bold text-slate-900">
                Velocity
            </span>
            </div>

            <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
            </h1>

            <p className="mt-2 text-slate-500">
                Sign in to your Velocity account.
            </p>
            </div>

            <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
            <div className="mb-5">
                <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
                >
                Email address
                </label>

                <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@velocity.com"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
            </div>

            <div className="mb-3">
                <div className="mb-2 flex items-center justify-between">
                <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                >
                    Password
                </label>

                <button
                    type="button"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Forgot password?
                </button>
                </div>

                <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
            </div>

            {message && (
                <div
                className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                    message === "Login successful!"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
                >
                {message}
                </div>
            )}

            <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
                Sign In
            </button>

            <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                    Create account
                </Link>
                </p>
            </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Velocity system online
            </div>
        </div>
        </div>
    </div>
    );
}

export default Login;