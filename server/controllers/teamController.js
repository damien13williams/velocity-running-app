const { join } = require("path");
const Team = require("../models/Team");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Generate a random team join code
const generateJoinCode = () => {
  return "VEL" + crypto.randomBytes(5).toString("hex").toUpperCase();
};

// Create a new team
// Route is POST /api/teams
// Accesss: Coach only
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate the team name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Team name is required",
      });
    }

    // Get the coach from the verified JWT
    const coachId = req.user._id;

    // Create the team in MongoDB
    const team = await Team.create({
      name: name.trim(),
      description:
        typeof description === "string" ? description.trim() : "",
      coach: coachId,
      athletes: [],
      joinCode: generateJoinCode(),
    });

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("Create team error:", error);

    return res.status(500).json({
      message: "Server error while creating team",
    });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let teams;

    if (role === "coach") {
      // Find teams this coach manages
      teams = await Team.find({ coach: userId })
        .populate("athletes", "firstName lastName email role")
        .sort({ createdAt: -1 });
    } else if (role === "athlete") {
      // Find teams this athlete belongs to
      teams = await Team.find({ athletes: userId })
        .populate("coach", "firstName lastName email")
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json({
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get my teams error:", error);

    return res.status(500).json({
      message: "Server error while retrieving teams",
    });
  }
};
// Join a team using a join code
// POST /api/teams/join
// Athlete only
const joinTeam = async (req, res) => {
  try {
    const { joinCode } = req.body;

    // Validate the join code
    if (typeof joinCode !== "string" || !joinCode.trim()) {
      return res.status(400).json({
        message: "Please provide a team join code",
      });
    }

    // Find the team using the provided code
    const team = await Team.findOne({
      joinCode: joinCode.trim().toUpperCase(),
    });

    if (!team) {
      return res.status(404).json({
        message: "Invalid team join code",
      });
    }

    const athleteId = req.user._id;

    // Check whether the athlete already belongs to the team
    const alreadyJoined = team.athletes.some(
      (id) => id.toString() === athleteId.toString()
    );

    if (alreadyJoined) {
      return res.status(409).json({
        message: "You are already a member of this team",
      });
    }

    // Add athlete without allowing duplicate IDs
    await Team.updateOne(
      { _id: team._id },
      { $addToSet: { athletes: athleteId } }
    );

    return res.status(200).json({
      message: "Successfully joined team",
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
      },
    });
  } catch (error) {
    console.error("Join team error:", error);

    return res.status(500).json({
      message: "Server error while joining team",
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate the MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid team ID",
      });
    }

    // 2. Find the team and retrieve coach/athlete information
    const team = await Team.findById(id)
      .populate("coach", "firstName lastName email role")
      .populate("athletes", "firstName lastName email role");

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // 3. Check whether the logged-in user is the coach
    const isCoach =
      team.coach?._id.toString() === req.user._id.toString();

    // 4. Check whether the logged-in user is on the roster
    const isAthlete = team.athletes.some(
      (athlete) =>
        athlete._id.toString() === req.user._id.toString()
    );

    // 5. Prevent users outside the team from accessing it
    if (!isCoach && !isAthlete) {
      return res.status(403).json({
        message: "You do not have permission to view this team",
      });
    }

    // 6. Return team information
    // Only the coach receives the private join code.
    const teamData = team.toObject();

    if (!isCoach) {
      delete teamData.joinCode;
    }

    return res.status(200).json({
      team: teamData,
      athleteCount: team.athletes.length,
    });

  } catch (error) {
    console.error("Get team by ID error:", error);

    return res.status(500).json({
      message: "Server error while retrieving team",
    });
  }
};

module.exports = {
  createTeam,
  getMyTeams,
  joinTeam,
  getTeamById
};