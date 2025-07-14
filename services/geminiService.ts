import { APIResponse } from '../types.ts';

// --- IMPORTANT ---
// Before running the frontend, make sure the python `backend.py` server is running on port 5001.
const API_BASE_URL = 'http://127.0.0.1:5001';

/**
 * --- API IMPLEMENTATION ---
 * This function calls your backend API to fetch video information.
 * It now points to the Flask server endpoint.
 */
export const fetchVideoInfo = async (url: string): Promise<APIResponse> => {
  if (!url.trim()) {
    throw new Error("Please enter a YouTube URL.");
  }
  
  const apiUrl = `${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `API Error: ${response.status} ${response.statusText}` 
      }));
      throw new Error(errorData.message || 'An error occurred on the server.');
    }

    const data: APIResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("API call to /api/info failed:", error);
    // Re-throw a user-friendly error to be displayed in the UI.
    throw new Error(error.message || "Failed to communicate with the server. Is it running?");
  }
};