const express = require("express");
const cors = require("cors");
const database = require("./connections");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

app.use((req, res, next) => {
  const error = new Error("Endpoint Not Found, please check your endpoint");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
