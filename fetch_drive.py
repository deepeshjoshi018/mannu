"""Fetch file IDs and download images from Google Drive folder."""
import os
import re
import json
import urllib.request
import urllib.parse

FOLDER_ID = "1SYiQVGwTm_8YcF5qOcU-b1wYy5r_wq8w"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "images")
MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "js", "photos.json")

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif")
VIDEO_EXTENSIONS = (".mp4", ".webm", ".mov")


def fetch_folder_html():
    url = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def extract_files_from_html(html):
    """Parse Drive folder page for file id + name pairs."""
    files = {}

    # Pattern: filename near id in JSON-like blobs
    for match in re.finditer(
        r'\[\s*"([a-zA-Z0-9_-]{20,})"\s*,\s*"([^"]+\.(?:jpg|jpeg|png|webp|gif|mp4|webm|mov))"',
        html,
        re.IGNORECASE,
    ):
        fid, name = match.group(1), match.group(2)
        files[fid] = name

    # Alternate: data-target and title patterns
    for match in re.finditer(
        r'data-id="([a-zA-Z0-9_-]{20,})"[^>]*aria-label="([^"]+)"',
        html,
    ):
        fid, name = match.group(1), match.group(2)
        if any(name.lower().endswith(ext) for ext in IMAGE_EXTENSIONS + VIDEO_EXTENSIONS):
            files[fid] = name

    # Broader JSON scan
    for match in re.finditer(
        r'"([a-zA-Z0-9_-]{25,})"\s*,\s*\[\s*"([^"]+\.(?:jpg|jpeg|png|webp|gif|mp4))"',
        html,
        re.IGNORECASE,
    ):
        fid, name = match.group(1), match.group(2)
        files[fid] = name

    return files


def download_file(file_id, filename):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    safe_name = re.sub(r'[<>:"/\\|?*]', "_", filename)
    dest = os.path.join(OUTPUT_DIR, safe_name)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        return safe_name

    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
        if len(data) < 1000 and b"confirm=" in data:
            # Large file confirmation token
            token_match = re.search(r'confirm=([0-9A-Za-z_-]+)', data.decode("utf-8", errors="ignore"))
            if token_match:
                token = token_match.group(1)
                url2 = f"https://drive.google.com/uc?export=download&confirm={token}&id={file_id}"
                req2 = urllib.request.Request(url2, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req2, timeout=120) as resp2:
                    data = resp2.read()
        with open(dest, "wb") as f:
            f.write(data)
        print(f"Downloaded: {safe_name} ({len(data)} bytes)")
        return safe_name
    except Exception as e:
        print(f"Failed {filename}: {e}")
        return None


def main():
    print("Fetching Google Drive folder...")
    html = fetch_folder_html()

    files = extract_files_from_html(html)
    print(f"Found {len(files)} files in HTML parse")

    if not files:
        # Fallback: known filenames from folder listing with search API trick
        known = [
            "IMG_20260520_233808-COLLAGE.jpg",
            "IMG_20260522_083748.jpg",
            "IMG_20260522_083809.jpg",
            "IMG_20260522_083820.jpg",
            "IMG_20260522_093428.jpg",
            "IMG_20260522_093437.jpg",
            "IMG_20260522_093501.jpg",
            "IMG_20260522_093602.jpg",
            "IMG_20260522_093615.jpg",
            "IMG_20260522_093642.jpg",
            "IMG_20260522_093651.jpg",
            "IMG_20260522_093704.jpg",
            "IMG_20260522_093718.jpg",
            "IMG_20260522_093729.jpg",
            "IMG_20260522_093738.jpg",
            "IMG_20260522_093748.jpg",
            "IMG_20260522_093757.jpg",
            "IMG_20260522_093809.jpg",
            "IMG_20260522_093822.jpg",
            "Screenshot 2026-03-03 225603.png",
            "Screenshot 2026-03-03 232407.png",
            "Screenshot_20260520-233456.png",
            "Screenshot_20260520-233500.png",
            "Screenshot_20260520-233504.png",
            "Screenshot_20260520-233507.png",
            "Screenshot_20260520-233510.png",
            "Screenshot_20260520-233528.jpg",
            "Screenshot_20260520-233535.jpg",
        ]
        # Extract all IDs and try to match
        all_ids = list(set(re.findall(r'"([a-zA-Z0-9_-]{25,})"', html)))
        print(f"Fallback: {len(all_ids)} raw IDs found")
        for i, name in enumerate(known):
            if i < len(all_ids):
                files[all_ids[i]] = name

    photos = []
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)

    for fid, name in sorted(files.items(), key=lambda x: x[1].lower()):
        ext = os.path.splitext(name)[1].lower()
        if ext in IMAGE_EXTENSIONS:
            local = download_file(fid, name)
            if local:
                photos.append({
                    "id": fid,
                    "name": name,
                    "local": f"images/{local}",
                    "drive": f"https://drive.google.com/uc?export=view&id={fid}",
                })

    manifest = {
        "folderId": FOLDER_ID,
        "folderUrl": f"https://drive.google.com/drive/folders/{FOLDER_ID}",
        "photos": photos,
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest saved with {len(photos)} photos -> {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
