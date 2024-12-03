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
        <div className="min-h-screen  flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Resume Analyzer
                </h1>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-4 mb-4 shadow focus:ring-2 focus:ring-purple-400 outline-none"
                    placeholder="Enter Job Description"
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    rows="5"
                />
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 shadow focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <div className="flex gap-4">
                    <button
                        onClick={handleUpload}
                        className="flex-1 bg-purple-500 text-white py-2 rounded-md font-medium hover:bg-purple-600 transition-transform transform hover:scale-105"
                    >
                        Upload
                    </button>
                    <button
                        onClick={handleRunScript}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-transform transform hover:scale-105"
                    >
                        Run Script
                    </button>
                </div>
                {message && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md shadow">
                        {message}
                    </div>
                )}
                {scriptOutput && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Python Script Output:
                        </h3>
                        <pre className="bg-gray-100 p-4 rounded-md shadow text-sm text-gray-700 overflow-auto whitespace-pre-wrap">
                            {scriptOutput}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
