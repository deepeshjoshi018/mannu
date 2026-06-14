"""Generate photos.json from downloaded images folder."""
import os
import json

# Current Google Drive folder file IDs (updated)
DRIVE_IDS = {
    "IMG_20260520_233808-COLLAGE.jpg": "1VVWUMbOuigyLmc6xWgAmxW8I1prdz_60",
    "IMG_20260522_083748.jpg": "1zutj8ithCXXmsxmYyM8L0qggy1nssKpE",
    "IMG_20260522_093428.jpg": "15K0Z0_-rSlr6xzP-Z37b2bgOrCuRF20D",
    "IMG_20260522_093437.jpg": "1Daf9U-GUfDPvEmWyuGTnHtDth-I0vjC6",
    "IMG_20260522_093501.jpg": "1zICpM2_E7iuNnC08gMaBt7LjSDOlhua1",
    "IMG_20260522_093602.jpg": "1TABYH0ZsbcF7E272VlM1mL2A0UtX6wOg",
    "IMG_20260522_093615.jpg": "1iyynQ_NfEgC3x3tWmsdHWaUksJl85iiZ",
    "IMG_20260522_093642.jpg": "12Plq0AHNL8u0WML23jxCZZkMFrQFWIMZ",
    "IMG_20260522_093651.jpg": "1729lGmqI5ojduuNQ19OnvSZMJSUv4p6l",
    "IMG_20260522_093704.jpg": "1HolmAhHkhVcJxVoXR0kNxn9BYsFZ3JMm",
    "IMG_20260522_093718.jpg": "1ZeZ-8jwYRvhXLYJhWZy3bT-nVhODxLa6",
    "IMG_20260522_093729.jpg": "1S6KohfHTWaUn0XW58ZQyWe0vh2duwj0_",
    "IMG_20260522_093748.jpg": "197lAEVdoXucMgAOClyiEClBjzhxUKZ-x",
    "IMG_20260522_093757.jpg": "1ZeZQWieifVp3v3VI4I6EmjhXf6_SNB3s",
    "IMG_20260522_093809.jpg": "13ku6WwGh7Xf2h9LlyWW5EOHFaFI3DGWw",
    "IMG_20260522_093822.jpg": "1wC4qnhC0AQxcLhLZ7bqJ9bpcp9Egjjyq",
    "Screenshot 2026-03-03 225603.png": "10y-frQz6xlGnfo5Nt22XJXcP8BYGN4WX",
    "Screenshot 2026-03-03 232407.png": "17q4u2wda5Cop5EAHx0WEu8ok0E1KXmkA",
    "Screenshot_20260520-233456.png": "1jK-1dB-bwbvQCDxoe_YbTsMm3lguKYd9",
    "Screenshot_20260520-233535.jpg": "1-Qi9r1OQYuRu2P9ytv4z6wRDWRcelmRc",
}

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
BASE = os.path.dirname(__file__)
IMAGES_DIR = os.path.join(BASE, "images")

photos = []
for name in sorted(os.listdir(IMAGES_DIR)):
    ext = os.path.splitext(name)[1].lower()
    if ext not in IMAGE_EXT:
        continue
    fid = DRIVE_IDS.get(name, "")
    photos.append({
        "name": name,
        "local": f"images/{name}",
        "id": fid,
        "drive": f"https://drive.google.com/thumbnail?id={fid}&sz=w1200" if fid else "",
        "thumb": f"https://drive.google.com/thumbnail?id={fid}&sz=w400" if fid else "",
    })

manifest = {
    "folderId": "1SYiQVGwTm_8YcF5qOcU-b1wYy5r_wq8w",
    "folderUrl": "https://drive.google.com/drive/folders/1SYiQVGwTm_8YcF5qOcU-b1wYy5r_wq8w",
    "photos": photos,
}

out = os.path.join(BASE, "js", "photos.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

embedded_out = os.path.join(BASE, "js", "photos-data.js")
with open(embedded_out, "w", encoding="utf-8") as f:
    f.write("/** Auto-generated photo manifest */\n")
    f.write("CONFIG.embeddedPhotos = ")
    json.dump(photos, f, indent=2)
    f.write(";\n")

print(f"Generated manifest with {len(photos)} photos")
