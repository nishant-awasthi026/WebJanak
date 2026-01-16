
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import os
import shutil

# Paths
BASE_MODEL_PATH = "./model/Qwen2.5-3B-Instruct"
ADAPTER_PATH = "./model/webjanak-qwen-finetuned"
MERGED_PATH = "./model/merged_qwen"

def merge_models():
    print("=" * 60)
    print("🔄 Merging LoRA Adapter into Qwen Base Model")
    print("=" * 60)
    
    print(f"\nBase Model: {BASE_MODEL_PATH}")
    print(f"Adapter: {ADAPTER_PATH}")
    print(f"Output: {MERGED_PATH}")
    
    print("\n📦 Loading base model...", flush=True)
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_PATH,
        device_map="auto", # auto might use disk offload if needed
        trust_remote_code=True,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
        offload_folder="offload"
    )
    
    print("\n📦 Loading tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(
        ADAPTER_PATH, 
        trust_remote_code=True
    )
    
    # 3. Load Adapter
    print("🔗 Loading adapter...")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
    
    # 4. Merge
    print("⚡ Merging weights...")
    model = model.merge_and_unload()
    
    # 5. Save
    print(f"💾 Saving merged model to {MERGED_PATH}...")
    model.save_pretrained(MERGED_PATH, max_shard_size="2GB", safe_serialization=True)
    tokenizer.save_pretrained(MERGED_PATH)
    
    print("\n✅ Merge completed successfully!")
    print(f"   Saved to: {os.path.abspath(MERGED_PATH)}")

if __name__ == "__main__":
    try:
        merge_models()
    except Exception as e:
        print(f"\n❌ Error merging models: {e}")
