YouTube Downloader – Running and Deployment Instructions
Prerequisites
Python 3.8+

Node.js 18+

npm

Running the Project Locally
Install frontend dependencies:

bash
Copy
Edit
cd frontend
npm install
npm run build
Install Python dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Run the server:

bash
Copy
Edit
python backend/backend.py
Deployment on Platforms like Railway or Render
Make sure the Procfile exists and contains:

bash
Copy
Edit
web: python backend/backend.py
Ensure requirements.txt is in the root directory.

In the platform settings:

Build Command:

bash
Copy
Edit
cd frontend && npm install && npm run build
Start Command:

bash
Copy
Edit
python backend/backend.py
The default port is 5000. If the platform requires a PORT variable, you can modify it in the code.

Notes
React files are served automatically from Flask after building.

If you're using external downloaders (IDM), a new window might open — this is outside the site's control.

All CORS settings are enabled by default.

Support for Downloading Protected Videos (YouTube Cookies)
If you receive an error message from YouTube or some videos fail to download:

You can extract a cookies.txt file from your browser (e.g. using the Get cookies.txt extension).

Place the file in the backend folder with the name cookies.txt.

The server will automatically use it to bypass some protections.

Warning: Do not share your cookies file with anyone!









Ask ChatGPT
