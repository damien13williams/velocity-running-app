import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-slate-950">
          V
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to Velocity
        </h1>

        <p className="mt-3 text-slate-600">
          Signed in as {user?.firstName} {user?.lastName}
        </p>

        <p className="mt-2 text-sm capitalize text-emerald-700">
          Role: {user?.role}
        </p>

        <p className="mt-6 text-sm text-slate-500">
          Your training dashboard is coming next.
        </p>

        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            navigate("/login", { replace: true });
          }}
          className="mt-8 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;