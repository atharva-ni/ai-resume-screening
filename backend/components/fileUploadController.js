require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const UPLOADS_DIR = path.join(__dirname, "../", process.env.UPLOADS_DIR || "uploads");
const JOBDESC_DIR = path.join(__dirname, "../", process.env.JOBDESC_DIR || "jobdesc");

// Ensure directories exist
[UPLOADS_DIR, JOBDESC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer setup
const upload = multer({
    storage: multer.diskStorage({
        destination: (_, __, cb) => cb(null, UPLOADS_DIR),
        filename: (_, file, cb) => cb(null, file.originalname),
    }),
});

const router = express.Router();

// Upload route
router.post("/upload", upload.array("files"), (req, res) => {
    const files = req.files;
    const jobDescription = req.body.jobDescription || "";

    if (!files?.length) return res.status(400).json({ message: "No files uploaded" });

    if (jobDescription) {
        const pdfPath = path.join(JOBDESC_DIR, "job_description.pdf");
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(12).text(jobDescription, { width: 410, align: "left" });
        doc.end();
    }

    res.json({
        message: "Files uploaded successfully",
        filePaths: files.map(file => file.path),
        jobDescription,
    });
});

// Run script route
router.post("/run-script", (req, res) => {
    const { filePaths } = req.body;
    if (!filePaths?.length) return res.status(400).json({ message: "No files to process" });

    exec("python next.py", (error, stdout) => {
        if (error) return res.status(500).json({ message: "Failed to run script", error });

        clearDirectories()
            .then(() => res.json({ message: "Script executed successfully", output: stdout }))
            .catch(err => res.status(500).json({ message: "Error cleaning up", error: err }));
    });
});

// Helper: clear directories
const clearDirectories = () => new Promise(resolve => {
    const deleteIfExists = file => fs.existsSync(file) && fs.rmSync(file, { force: true });
    const clearFolder = dir => fs.readdirSync(dir).forEach(file => deleteIfExists(path.join(dir, file)));

    deleteIfExists(path.join(JOBDESC_DIR, "job_description.pdf"));
    clearFolder(UPLOADS_DIR);
    resolve();
});

module.exports = router;
