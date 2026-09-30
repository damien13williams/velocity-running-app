require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5008;

connectDB();

app.listen(PORT, () => {
  console.log(`Velocity server running on port ${PORT}`);
});