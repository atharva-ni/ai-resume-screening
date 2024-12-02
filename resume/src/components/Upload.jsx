import React, { useState } from "react";
import { uploadFiles, triggerPythonScript } from "./fileUploadService";

const Upload = () => {
    const [files, setFiles] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [filePaths, setFilePaths] = useState([]);
    const [message, setMessage] = useState("");
    const [scriptOutput, setScriptOutput] = useState("");

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
            setFilePaths(response.filePaths);
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
            setScriptOutput(response.output);
        } catch (error) {
            alert("Failed to run Python script: " + error.message);
        }
    };

    return (
        <div className="text-center py-10">
            <textarea
                className="border border-gray-300 rounded-lg w-2/3 p-2 mb-4"
                placeholder="Enter Job Description"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                rows="4"
            />
            <br />
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf"
                className="block mx-auto border border-gray-300 rounded-lg p-2"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
            >
                Upload
            </button>
            <br />
            <button
                onClick={handleRunScript}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600"
            >
                Run Python Script
            </button>

            <div className="mt-4 text-gray-700">{message}</div>

            <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2">Python Script Output:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-left">{scriptOutput}</pre>
            </div>
        </div>
    );
};

export default Upload;
