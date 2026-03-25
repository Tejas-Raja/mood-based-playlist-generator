# mood-playlist

Full-stack “mood playlist” app:
- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: FastAPI (Python) + Spotipy (Spotify API)

## Backend (FastAPI)

1. Go to the backend folder:
   - `cd backend`
2. Create and activate a virtual environment:
   - `python3 -m venv venv`
   - `source venv/bin/activate`
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Configure Spotify credentials:
   - Copy the example file: `cp .env.example .env`
   - Edit `.env` and set:
     - `SPOTIFY_CLIENT_ID`
     - `SPOTIFY_CLIENT_SECRET`
5. Run the backend:
   - `uvicorn main:app --reload --port 8000`

Spotify credentials are obtained from: <https://developer.spotify.com/>

## Frontend (React)

1. Go to the frontend folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Run the dev server:
   - `npm run dev`

Frontend runs at: <http://localhost:5173>

## Run both concurrently

Open two terminals:

1. Terminal 1 (backend):
   - `cd backend && uvicorn main:app --reload --port 8000`
2. Terminal 2 (frontend):
   - `cd frontend && npm run dev`

