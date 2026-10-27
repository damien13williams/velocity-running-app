
import { Link, useNavigate } from "react-router-dom";

const sampleWorkouts = [
  { day: "Monday", title: "Easy Run", details: "8 miles", status: "Completed" },
  { day: "Tuesday", title: "Threshold Intervals", details: "5 × 1,000m", status: "Upcoming" },
  { day: "Wednesday", title: "Recovery Run", details: "6 miles", status: "Upcoming" },
];

const sampleMileage = [
  { day: "Mon", miles: 8 },
  { day: "Tue", miles: 12 },
  { day: "Wed", miles: 6 },
  { day: "Thu", miles: 10 },
  { day: "Fri", miles: 7 },
  { day: "Sat", miles: 5 },
  { day: "Sun", miles: 0 },
];

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const isCoach = user?.role === "coach";
  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "Guest";

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <button
          onClick={() => navigate("/login")}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white"
        >
          Sign in to Velocity
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* SIDEBAR */}
      <aside className="flex w-full flex-col bg-slate-950 p-6 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:overflow-y-auto">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-slate-950">
            V
          </div>
          <div>
            <h1 className="text-xl font-bold">Velocity</h1>
            <p className="text-xs text-slate-400">
              Team Management
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <div className="rounded-lg bg-emerald-500/15 px-4 py-3 font-medium text-emerald-400">
            Dashboard
          </div>

          <div className="px-4 py-3 text-slate-400">
            My Training
          </div>

          <Link
            to="/teams"
            className="block rounded-lg px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Teams
          </Link>

          <div className="px-4 py-3 text-slate-400">
            Race Calendar
          </div>

          {isCoach && (
            <div className="px-4 py-3 text-slate-400">
              Manage Athletes
            </div>
          )}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-6">
          <p className="font-semibold">{fullName}</p>
          <p className="mb-4 text-sm capitalize text-slate-400">
            {user.role}
          </p>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-6 lg:ml-64 lg:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              PERFORMANCE OVERVIEW
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user.firstName}!
            </h1>

            <p className="mt-2 text-slate-500">
              {isCoach
                ? "Here's an overview of your team's training."
                : "Here's an overview of your training."}
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold capitalize text-emerald-700">
            {user.role} Account
          </span>
        </div>

        {/* STAT CARDS */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={isCoach ? "Team Athletes" : "Weekly Mileage"}
            value={isCoach ? "18" : "48.0"}
            unit={isCoach ? "athletes" : "miles"}
          />

          <StatCard
            title={isCoach ? "Team Workouts" : "Workouts Completed"}
            value={isCoach ? "12" : "5"}
            unit={isCoach ? "assigned" : "this week"}
          />

          <StatCard
            title="Next Race"
            value="Oct 24"
            unit="Race Day"
          />

          <StatCard
            title="Training Status"
            value="On Track"
            unit="Current week"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* MILEAGE CHART */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">
              Weekly Mileage
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Example training distribution
            </p>

            <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-slate-200">
              {sampleMileage.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs font-semibold text-slate-600">
                    {item.miles}
                  </span>

                  <div
                    className="w-full max-w-14 rounded-t-lg bg-emerald-500 transition hover:bg-emerald-600"
                    style={{
                      height: `${(item.miles / 14) * 80}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between gap-3">
              {sampleMileage.map((item) => (
                <span
                  key={item.day}
                  className="flex-1 text-center text-xs text-slate-500"
                >
                  {item.day}
                </span>
              ))}
            </div>
          </section>

          {/* TEAM CARD */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              My Team
            </h2>

            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">
                V
              </div>

              <h3 className="font-semibold text-slate-900">
                No Team Connected
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Team membership will appear here once
                we connect the Team collection.
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                Account
              </p>
              <p className="mt-1 break-all font-medium text-slate-900">
                {user.email}
              </p>
            </div>
          </section>
        </div>

        {/* UPCOMING WORKOUTS */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Training
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Example weekly workout schedule
            </p>
          </div>

          <div className="space-y-3">
            {sampleWorkouts.map((workout) => (
              <div
                key={workout.day}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {workout.day}
                  </p>

                  <h3 className="mt-1 font-semibold text-slate-900">
                    {workout.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {workout.details}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    workout.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {workout.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, unit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-sm text-emerald-600">
        {unit}
      </p>
    </div>
  );
}

export default Dashboard;
