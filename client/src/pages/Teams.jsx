import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5008/api";

function Teams() {
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const token = sessionStorage.getItem("token");

  const isCoach = user?.role === "coach";
  const isAthlete = user?.role === "athlete";

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch the logged-in user's teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/teams/my-teams`, {
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve teams");
      }

      const data = await response.json();

      setTeams(data.teams || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    fetchTeams();
  }, [token, navigate]);

  // Coach: Create a team
  const handleCreateTeam = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teamName,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create team");
      }

      setMessage("Team created successfully!");
      setTeamName("");
      setDescription("");
      setShowCreateForm(false);

      await fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Athlete: Join a team
  const handleJoinTeam = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/teams/join`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          joinCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join team");
      }

      setMessage("You successfully joined the team!");
      setJoinCode("");

      await fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // View a team and its roster
  const handleViewTeam = async (teamId) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/teams/${teamId}`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load team");
      }

      setSelectedTeam(data.team);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Velocity Team Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {selectedTeam
                ? selectedTeam.name
                : isCoach
                ? "Manage Your Teams"
                : "My Teams"}
            </h1>

            <p className="mt-2 text-slate-500">
              {isCoach
                ? "Create teams, manage rosters, and prepare training."
                : "Connect with your coach and teammates."}
            </p>
          </div>

          {selectedTeam ? (
            <button
              onClick={() => setSelectedTeam(null)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Teams
            </button>
          ) : (
            isCoach && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                + Create Team
              </button>
            )
          )}
        </div>

        {/* SUCCESS / ERROR MESSAGES */}
        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {/* TEAM DETAILS */}
        {selectedTeam ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Team Information
              </h2>

              <p className="mt-3 text-slate-600">
                {selectedTeam.description || "No description provided."}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  label="Head Coach"
                  value={
                    `${selectedTeam.coach?.firstName || ""} ${
                      selectedTeam.coach?.lastName || ""
                    }`.trim()
                  }
                />

                <InfoCard
                  label="Athletes"
                  value={selectedTeam.athletes?.length || 0}
                />
              </div>

              {isCoach && (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    Team Join Code
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <span className="font-mono text-xl font-bold tracking-wider text-slate-900">
                      {selectedTeam.joinCode}
                    </span>

                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            selectedTeam.joinCode
                          );
                          setMessage("Join code copied!");
                        } catch {
                          setError("Could not copy the join code.");
                        }
                      }}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ROSTER */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Team Roster
              </h2>

              {!selectedTeam.athletes?.length ? (
                <p className="text-slate-500">
                  No athletes have joined this team yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedTeam.athletes.map((athlete) => (
                    <div
                      key={athlete._id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                          {athlete.firstName?.[0]}
                          {athlete.lastName?.[0]}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {athlete.firstName} {athlete.lastName}
                          </p>

                          <p className="text-sm text-slate-500">
                            {athlete.email}
                          </p>
                        </div>
                      </div>

                      {isCoach && (
                        <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                          Workout assignments coming next
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* COACH CREATE TEAM FORM */}
            {isCoach && showCreateForm && (
              <form
                onSubmit={handleCreateTeam}
                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-5 text-xl font-bold text-slate-900">
                  Create a New Team
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Team Name
                    </label>

                    <input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      maxLength={100}
                      placeholder="e.g. Velocity Distance Team"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Tell athletes about your team..."
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Team"}
                  </button>
                </div>
              </form>
            )}

            {/* ATHLETE JOIN TEAM FORM */}
            {isAthlete && (
              <form
                onSubmit={handleJoinTeam}
                className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  Join a Team
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Enter the join code provided by your coach.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    required
                    placeholder="Enter join code"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {submitting ? "Joining..." : "Join Team"}
                  </button>
                </div>
              </form>
            )}

            {/* TEAM LIST */}
            <div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                {isCoach ? "Your Teams" : "Teams You've Joined"}
              </h2>

              {loading ? (
                <p className="text-slate-500">Loading teams...</p>
              ) : teams.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No teams yet
                  </h3>

                  <p className="mt-2 text-slate-500">
                    {isCoach
                      ? "Create your first team to start managing athletes."
                      : "Join a team using a code from your coach."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">
                        V
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {team.name}
                      </h3>

                      <p className="mt-2 min-h-12 text-sm text-slate-500">
                        {team.description || "No description"}
                      </p>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-600">
                          {isCoach
                            ? `${team.athletes?.length || 0} athletes`
                            : `Coach: ${
                                team.coach?.firstName || ""
                              } ${team.coach?.lastName || ""}`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleViewTeam(team._id)}
                        className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
                      >
                        {isCoach ? "View Roster" : "View Team"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default Teams;