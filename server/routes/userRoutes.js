const express = require("express");

const {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Any authenticated user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user,
  });
});

// Coaches only
router.get(
  "/coach-test",
  protect,
  authorizeRoles("coach"),
  (req, res) => {
    res.status(200).json({
      message: "Coach access granted",
    });
  }
);

router.get("/", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;