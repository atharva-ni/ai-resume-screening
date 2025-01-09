require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";
const JOBDESC_DIR = process.env.JOBDESC_DIR || "jobdesc";

// Ensure directories exist
[UPLOADS_DIR, JOBDESC_DIR].forEach(dir => {
    const fullPath = path.join(__dirname, "../", dir);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: UPLOADS_DIR,
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

const router = express.Router();

// Upload route
router.post("/upload", upload.array("files"), (req, res) => {
    if (!req.files) return res.status(400).send({ message: "No files uploaded" });

    const filePaths = req.files.map(file => file.path);
    const jobDescription = req.body.jobDescription || "";

    if (jobDescription) {
        const pdfPath = path.join(__dirname, "../", JOBDESC_DIR, "job_description.pdf");
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(12).text(jobDescription, { width: 410, align: "left" });
        doc.end();
    }

    res.send({ message: "Files uploaded successfully", filePaths, jobDescription });
});

// Script execution route
router.post("/run-script", (req, res) => {
    const { filePaths } = req.body;
    if (!filePaths?.length) return res.status(400).send({ message: "No files to process" });

    exec("python next.py", (error, stdout) => {
        if (error) return res.status(500).send({ message: "Failed to run script", error });

        clearDirectories()
            .then(() => res.send({ message: "Script executed successfully", output: stdout }))
            .catch(err => res.status(500).send({ message: "Error cleaning up", error: err }));
    });
});

// Clear directories
const clearDirectories = () => {
    const deleteFile = filePath => fs.existsSync(filePath) && fs.rmSync(filePath, { force: true });
    const clearFolder = folder => {
        const fullPath = path.join(__dirname, "../", folder);
        fs.readdirSync(fullPath).forEach(file => deleteFile(path.join(fullPath, file)));
    };

    return new Promise(resolve => {
        deleteFile(path.join(__dirname, "../", JOBDESC_DIR, "job_description.pdf"));
        clearFolder(UPLOADS_DIR);
        resolve();
    });
};

module.exports = router;
