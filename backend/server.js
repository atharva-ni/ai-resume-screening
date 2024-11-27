const express = require("express");
const cors = require("cors");
const fileUploadController = require("./controllers/fileUploadController");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // To handle JSON data in requests

// Routes
app.use("/api", fileUploadController);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
