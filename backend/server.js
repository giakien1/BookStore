require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

routes(app);

db();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
