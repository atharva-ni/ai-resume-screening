import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Upload files and job description
export const uploadFiles = async (files, jobDescription) => {
    const formData = new FormData();

    // Append files to FormData
    Array.from(files).forEach(file => {
        formData.append("files", file); // Append each file to FormData
    });

    // Append job description to FormData
    if (jobDescription) {
        formData.append("jobDescription", jobDescription); // Append job description text
    }

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Returns { message, filePaths, jobDescriptionFilePath }
    } catch (error) {
        console.error("Error uploading files:", error);
        throw new Error("Failed to upload files.");
    }
};

// Trigger Python script after uploading files
export const triggerPythonScript = async (filePaths) => {
    try {
        const response = await axios.post(`${API_URL}/run-script`, { filePaths });
        return response.data; // Returns { message, output }
    } catch (error) {
        console.error("Error running Python script:", error);
        throw new Error("Failed to run Python script.");
    }
};

