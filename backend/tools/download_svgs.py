import os
import requests
from app.constants import COUNTRY_SVG_MAP

BASE_URL = "https://raw.githubusercontent.com/djaiss/mapsicon/master/all"
DEST_FOLDER = os.path.join("static", "svg")
os.makedirs(DEST_FOLDER, exist_ok=True)

for country, filename in COUNTRY_SVG_MAP.items():
    code = filename.replace(".svg", "")
    url = f"{BASE_URL}/{code}/vector.svg"
    dest_path = os.path.join(DEST_FOLDER, filename)

    if os.path.exists(dest_path):
        print(f"✔ Already exists: {filename}")
        continue

    try:
        print(f"⬇ Downloading {filename} ...")
        response = requests.get(url)
        response.raise_for_status()
        with open(dest_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {dest_path}")
    except Exception as e:
        print(f"❌ Failed to download {filename} ({country}): {e}")
