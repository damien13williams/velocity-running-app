import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Connecting...");

  const [showAddUser, setShowAddUser] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "athlete",
  });

  const [formMessage, setFormMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:5008/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setMessage("System Online");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Backend Offline");
      });
  }, []);

  const athletes = users.filter((user) => user.role === "athlete").length;
  const coaches = users.filter((user) => user.role === "coach").length;
  const admins = users.filter((user) => user.role === "admin").length;

  const handleAddUser = async (event) => {
    event.preventDefault();

    setFormMessage("");

    try {
      const response = await fetch(
        "http://localhost:5008/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormMessage(data.message || "Unable to create user");
        return;
      }

      setUsers((previousUsers) => [
        ...previousUsers,
        data.user,
      ]);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "athlete",
      });

      setShowAddUser(false);

    } catch (error) {
      console.error(error);
      setFormMessage("Could not connect to server");
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col bg-slate-900 px-5 py-7 text-white">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-xl font-black text-slate-900">
            V
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-widest">
              VELOCITY
            </h2>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Performance
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">

          <p className="mb-2 px-3 text-xs font-bold tracking-widest text-slate-600">
            WORKSPACE
          </p>

          <NavButton icon="▦" label="Dashboard" />
          <NavButton icon="♟" label="Team" />
          <NavButton icon="↗" label="Training" />
          <NavButton icon="□" label="Race Calendar" />
          <NavButton icon="◉" label="Athletes" />

          <p className="mb-2 mt-8 px-3 text-xs font-bold tracking-widest text-slate-600">
            ADMINISTRATION
          </p>

          <NavButton
            icon="♙"
            label="User Management"
            active
          />

          <NavButton icon="⚙" label="Settings" />
        </nav>

        {/* Logged in user */}
        <div className="flex items-center gap-3 border-t border-slate-700 pt-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-700 text-xs font-bold text-emerald-400">
            DW
          </div>

          <div>
            <p className="text-sm font-semibold">
              Damien Williams
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-12">

        {/* Header */}
        <header className="mb-9 flex items-start justify-between">

          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-emerald-600">
              ADMINISTRATION
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>

            <p className="mt-2 text-slate-500">
              Manage Velocity users, roles, and platform access.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            {message}
          </div>

        </header>

        {/* Stats */}
        <section className="mb-7 grid grid-cols-4 gap-5">

          <StatCard
            label="Total Users"
            value={users.length}
            description="Registered accounts"
          />

          <StatCard
            label="Athletes"
            value={athletes}
            description="Athlete accounts"
          />

          <StatCard
            label="Coaches"
            value={coaches}
            description="Coaching staff"
          />

          <StatCard
            label="Administrators"
            value={admins}
            description="Platform admins"
          />

        </section>

        {/* Users */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Platform Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Accounts with access to the Velocity platform.
              </p>
            </div>

            <button
              onClick={() => setShowAddUser(true)}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              + Add User
            </button>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead className="border-y border-slate-200 bg-slate-50">
                <tr>
                  <TableHeader>USER</TableHeader>
                  <TableHeader>EMAIL</TableHeader>
                  <TableHeader>ROLE</TableHeader>
                  <TableHeader>STATUS</TableHeader>
                  <TableHeader></TableHeader>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {users.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {user.firstName} {user.lastName}
                        </span>

                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Active
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-800">
                        •••
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </section>

      </main>
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Add User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new Velocity platform account.
                </p>
              </div>

              <button
                onClick={() => setShowAddUser(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {formMessage && (
                <p className="text-sm text-red-500">
                  {formMessage}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Create User
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ icon, label, active = false }) {
  return (
    <button
      className={`my-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${active
        ? "bg-slate-800 text-emerald-400"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <h2 className="my-2 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-slate-400">
      {children}
    </th>
  );
}

function RoleBadge({ role }) {
  const styles = {
    athlete: "bg-blue-50 text-blue-600",
    coach: "bg-amber-50 text-amber-600",
    admin: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[role] || "bg-slate-100 text-slate-600"
        }`}
    >
      {role}
    </span>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export default App;