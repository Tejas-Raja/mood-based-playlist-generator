from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import analyze, playlist

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="")
app.include_router(playlist.router, prefix="")


@app.get("/")
def health():
    return {"status": "ok"}
