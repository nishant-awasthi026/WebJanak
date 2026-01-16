"""
Download Qwen2.5-3B-Instruct Base Model
This script downloads the base model needed for the LoRA adapter
"""

import os
from huggingface_hub import snapshot_download

MODEL_ID = "Qwen/Qwen2.5-3B-Instruct"
LOCAL_DIR = "./model/Qwen2.5-3B-Instruct"

print("=" * 60)
print("📥 Downloading Qwen2.5-3B-Instruct Base Model")
print("=" * 60)
print(f"\nModel: {MODEL_ID}")
print(f"Destination: {LOCAL_DIR}")
print(f"\n⚠️  This will download ~6-7GB of data")
print("\nStarting download...\n")

try:
    snapshot_download(
        repo_id=MODEL_ID,
        local_dir=LOCAL_DIR,
        local_dir_use_symlinks=False,
        resume_download=True
    )
    
    print("\n" + "=" * 60)
    print("✅ Download completed successfully!")
    print("=" * 60)
    print(f"\n📁 Model saved to: {os.path.abspath(LOCAL_DIR)}")
    print("\n🚀 You can now run the model server:")
    print("   python model_server.py")
    
except Exception as e:
    print(f"\n❌ Error downloading model: {str(e)}")
    print("\nAlternative: Download manually using huggingface-cli:")
    print(f"   huggingface-cli download {MODEL_ID} --local-dir {LOCAL_DIR}")
    exit(1)
