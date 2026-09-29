require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`Velocity server running on port ${PORT}`);
});