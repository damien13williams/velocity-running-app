const express = require("express");
const router = express.Router();

const { createTeam, getMyTeams, joinTeam,} = require("../controllers/teamController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Only authenticated coaches can create teams
router.post("/", protect, authorizeRoles("coach"), createTeam);

router.get(
  "/my-teams",
  protect,
  authorizeRoles("coach", "athlete"),
  getMyTeams
);

router.post(
    "/join",
    protect,
    authorizeRoles("athlete"),
    joinTeam
);

module.exports = router;