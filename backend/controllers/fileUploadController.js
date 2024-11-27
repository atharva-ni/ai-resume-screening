const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const multer = require("multer");
const PDFDocument = require("pdfkit"); // Import pdfkit for PDF generation

// Set up multer storage to keep original file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Retain original filename
    }
});

const upload = multer({ storage: storage }); // Use this storage configuration

const router = express.Router();

// Route to handle file uploads
router.post("/upload", upload.array("files"), (req, res) => {
    if (!req.files) {
        return res.status(400).send({ message: "No files uploaded" });
    }

    const filePaths = req.files.map(file => file.path); // Save file paths
    const jobDescription = req.body.jobDescription || "";

    if (jobDescription) {
        // Generate PDF for job description
        const jobDescPdfPath = path.join(__dirname, "../jobdesc/job_description.pdf");
        createPdf(jobDescription, jobDescPdfPath);
    }

    // Respond with the file paths and job description (for use in frontend)
    res.send({ message: "Files uploaded successfully", filePaths, jobDescription });
});

// Function to create a PDF from job description
const createPdf = (jobDescription, outputPath) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(outputPath)); // Write to file

    // Add job description text to the PDF
    doc.fontSize(12).text(jobDescription, {
        width: 410,
        align: 'left'
    });

    doc.end(); // Finalize the PDF
};

// Route to trigger Python script and clean up
router.post("/run-script", (req, res) => {
    const { filePaths } = req.body;

    if (!filePaths || filePaths.length === 0) {
        return res.status(400).send({ message: "No files to process" });
    }

    // Run the Python script (next.py) without parameters
    exec("python next.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ message: "Failed to run Python script", error });
        }

        // Clear job description and uploads folder after script execution
        clearJobDescriptionAndUploads()
            .then(() => {
                res.send({ message: "Script executed successfully", output: stdout });
            })
            .catch(err => {
                console.error("Error cleaning up: ", err);
                res.status(500).send({ message: "Error cleaning up", error: err });
            });
    });
});

// Function to clear job description and uploads folder
const clearJobDescriptionAndUploads = () => {
    return new Promise((resolve, reject) => {
        // Clear the job description (if stored in a file)
        const jobDescFile = path.join(__dirname, "../jobdesc/job_description.pdf");
        if (fs.existsSync(jobDescFile)) {
            fs.rm(jobDescFile, { force: true }, (err) => {
                if (err) return reject(err);
            });
        }

        // Clear the uploads folder
        const uploadsFolder = path.join(__dirname, "../uploads");
        fs.readdir(uploadsFolder, (err, files) => {
            if (err) return reject(err);

            files.forEach((file) => {
                const filePath = path.join(uploadsFolder, file);
                fs.rm(filePath, { recursive: true, force: true }, (err) => {
                    if (err) return reject(err);
                });
            });
            resolve();
        });
    });
};

module.exports = router;
