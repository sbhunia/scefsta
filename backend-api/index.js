const dotenv = require("dotenv");
const express = require("express");

dotenv.config();
const app = express();

app.get("endpoint-1", (res, req, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Hello from endpoint 1",
    },
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on this port: ${PORT}`));
