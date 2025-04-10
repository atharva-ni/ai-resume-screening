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

  const handleFileChange = (e) => setFiles(e.target.files);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select files.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadFiles(files, jobDescription);
      setMessage(res.message);
      setFilePaths(res.filePaths);
    } catch (error) {
      setMessage("Failed to upload files: " + error?.message);
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
      const res = await triggerPythonScript(filePaths);
      setMessage(res.message);
      setScriptOutput(res.output);
    } catch (error) {
      setMessage("Failed to run Python script: " + error?.message);
    } finally {
      setIsRunningScript(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Resume Analyzer
        </h1>

        <textarea
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Enter Job Description"
          rows="5"
          className="w-full border border-gray-300 rounded-md p-4 mb-4 shadow focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <div className="w-full border border-gray-300 rounded-md p-2 mb-4 shadow focus-within:ring-2 focus-within:ring-blue-400">
          <label className="flex items-center justify-center cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileText className="mr-2" />
            <span>
              {files?.length ? `${files.length} file(s) selected` : "Choose PDF files"}
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex-1 bg-purple-500 text-white py-2 rounded-md font-medium transition-transform ${
              isUploading
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-105 active:scale-95 hover:shadow-lg"
            }`}
          >
            <span className="flex items-center justify-center">
              <UploadIcon className={`mr-2 ${isUploading ? "animate-spin" : ""}`} />
              {isUploading ? "Uploading..." : "Upload"}
            </span>
          </button>

          {/* Run Script Button */}
          <button
            onClick={handleRunScript}
            disabled={isRunningScript}
            className={`flex-1 bg-blue-500 text-white py-2 rounded-md font-medium transition-transform ${
              isRunningScript
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-105 active:scale-95 hover:shadow-lg"
            }`}
          >
            <span className="flex items-center justify-center">
              <Play className={`mr-2 ${isRunningScript ? "animate-spin" : ""}`} />
              {isRunningScript ? "Running..." : "Run Script"}
            </span>
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md shadow flex items-center">
            <CheckCircle className="mr-2" />
            {message}
          </div>
        )}

        {/* Output Display */}
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
