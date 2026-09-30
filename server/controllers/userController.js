const users = require("../data/users");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET ALL USERS
const getUsers = (req, res) => {
  res.status(200).json(users);
};

// GET ONE USER
const getUserById = (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Make sure all required fields were provided
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check MongoDB to see if this email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in MongoDB
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    // Return the user without sending the password back
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// LOGIN USER
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.status(200).json({
    message: "Login successful",
    user,
  });
};

// UPDATE USER
const updateUser = (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(
    (user) => user.id === id
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
};

// DELETE USER 
const deleteUser = (req, res) => {
  const id = Number(req.params.id);

  const index = users.findIndex(
    (user) => user.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const deletedUser = users.splice(index, 1);

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser[0],
  });
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};