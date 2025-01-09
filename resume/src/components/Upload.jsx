import React, { useState } from "react";
import { uploadFiles, triggerPythonScript } from "./fileUploadService";
import { UploadIcon, FileText, Play, CheckCircle, AlertCircle } from "lucide-react";

const Upload = () => {
    const [files, setFiles] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [filePaths, setFilePaths] = useState([]);
    const [message, setMessage] = useState("");
    const [scriptOutput, setScriptOutput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isRunningScript, setIsRunningScript] = useState(false);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleJobDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            setMessage("Please select files.");
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadFiles(files, jobDescription);
            setMessage(response.message);
            setFilePaths(response.filePaths);
        } catch (error) {
            setMessage("Failed to upload files: " + (error instanceof Error ? error.message : error));
        } finally {
            setIsUploading(false);
        }
    };

    const handleRunScript = async () => {
        if (filePaths.length === 0) {
            setMessage("Please upload files first.");
            return;
        }

        setIsRunningScript(true);
        try {
            const response = await triggerPythonScript(filePaths);
            setMessage(response.message);
            setScriptOutput(response.output);
        } catch (error) {
            setMessage("Failed to run Python script: " + (error instanceof Error ? error.message : error));
        } finally {
            setIsRunningScript(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
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
                <div className="w-full border border-gray-300 rounded-md p-2 mb-4 shadow focus-within:ring-2 focus-within:ring-blue-400">
                    <label className="flex items-center justify-center cursor-pointer">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="hidden"
                        />
                        <FileText className="mr-2" />
                        <span>{files && files.length > 0 ? `${files.length} file(s) selected` : "Choose PDF files"}</span>
                    </label>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleUpload}
                        className={`flex-1 bg-purple-500 text-white py-2 rounded-md font-medium transition-transform transform ${
                            isUploading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95 hover:shadow-lg"
                        }`}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <span className="flex items-center justify-center animate-pulse">
                                <UploadIcon className="mr-2 animate-spin" />
                                Uploading...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <UploadIcon className="mr-2" />
                                Upload
                            </span>
                        )}
                    </button>
                    <button
                        onClick={handleRunScript}
                        className={`flex-1 bg-blue-500 text-white py-2 rounded-md font-medium transition-transform transform ${
                            isRunningScript ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95 hover:shadow-lg"
                        }`}
                        disabled={isRunningScript}
                    >
                        {isRunningScript ? (
                            <span className="flex items-center justify-center animate-pulse">
                                <Play className="mr-2 animate-spin" />
                                Running...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Play className="mr-2" />
                                Run Script
                            </span>
                        )}
                    </button>
                </div>
                {message && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md shadow flex items-center">
                        <CheckCircle className="mr-2" />
                        {message}
                    </div>
                )}
                {scriptOutput && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                            <AlertCircle className="mr-2" />
                            Output:
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
