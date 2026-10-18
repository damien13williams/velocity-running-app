import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "athlete",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;

      const response = await fetch(
        "http://localhost:5008/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
              V
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Velocity</h1>
              <p className="text-sm text-slate-400">Team Management</p>
            </div>
          </div>

          <div className="mt-24 max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Join Velocity
            </p>

            <h2 className="text-5xl font-bold leading-tight text-white">
              Your training.
              <br />
              Your team.
              <br />
              Your future.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Create your account to connect with your team,
              manage workouts, and track your progress.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Velocity Running Team Management
        </p>
      </div>

      {/* Registration form */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-slate-500">
            Get started with Velocity.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <FormField
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <FormField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Account type
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
              </select>
            </div>

            {message && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export default Signup;