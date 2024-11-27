import React, { useState } from "react";
import { uploadFiles, triggerPythonScript } from "./controllers/fileUploadService";

function App() {
    const [files, setFiles] = useState(null);
    const [jobDescription, setJobDescription] = useState(""); // Store job description
    const [filePaths, setFilePaths] = useState([]);
    const [message, setMessage] = useState("");
    const [scriptOutput, setScriptOutput] = useState(""); // New state to store the script output

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleJobDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("Please select files.");
            return;
        }

        try {
            const response = await uploadFiles(files, jobDescription);
            setMessage(response.message);
            setFilePaths(response.filePaths); // Store file paths after upload
        } catch (error) {
            alert("Failed to upload files: " + error.message);
        }
    };

    const handleRunScript = async () => {
        if (filePaths.length === 0) {
            alert("Please upload files first.");
            return;
        }

        try {
            const response = await triggerPythonScript(filePaths);
            setMessage(response.message);
            setScriptOutput(response.output); // Display the output in the state
        } catch (error) {
            alert("Failed to run Python script: " + error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Resume Uploader</h1>

            <textarea
                placeholder="Enter Job Description"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                rows="4"
                cols="50"
                style={{ marginBottom: "10px" }}
            />
            <br />

            <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf"
            />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
                Upload
            </button>

            <br />
            <button onClick={handleRunScript} style={{ marginTop: "20px" }}>
                Run Python Script
            </button>

            <div>{message}</div>

            {/* Display script output here */}
            <div>
                <h3>Python Script Output:</h3>
                <pre>{scriptOutput}</pre> {/* Show the output in a <pre> tag for formatting */}
            </div>
        </div>
    );
}

export default App;
