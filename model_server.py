"""
WebJanak Local Model Inference Server
Runs the fine-tuned Qwen model (GGUF format) for UI code generation
"""

import os
import sys
import glob

# Ensure NVIDIA DLLs from pip packages are in PATH
def add_nvidia_paths():
    print("🔍 Searching for NVIDIA runtime libraries...")
    try:
        site_packages = next((p for p in sys.path if 'site-packages' in p), None)
        if not site_packages:
            return

        nvidia_path = os.path.join(site_packages, 'nvidia')
        if not os.path.exists(nvidia_path):
            print("⚠️ NVIDIA directory not found in site-packages")
            return

        dll_paths = set()
        
        # Recursively search for 'bin' directories or directories containing specific DLLs
        for root, dirs, files in os.walk(nvidia_path):
            for file in files:
                if file.endswith('.dll') and (file.startswith('cublas') or file.startswith('cudart') or file.startswith('cudnn')):
                    dll_paths.add(root)
        
        for path in dll_paths:
            print(f"✅ Adding DLL path: {path}")
            os.add_dll_directory(path)
            os.environ['PATH'] = path + os.pathsep + os.environ['PATH']
            
    except Exception as e:
        print(f"⚠️ Could not auto-add NVIDIA paths: {e}")

add_nvidia_paths()

from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)

# Model path
MODEL_PATH = "./model/webjanak-qwen-base-q4_k_m.gguf"
ADAPTER_PATH = "./model/webjanak-qwen-improved-adapter.gguf"

# Global model
llm = None

def load_model():
    """Load the GGUF model"""
    global llm
    
    print(f"🔄 Loading GGUF model from {MODEL_PATH}...")
    print(f"🔄 Loading Adapter from {ADAPTER_PATH}...")
    
    if not os.path.exists(MODEL_PATH):
        print(f"⚠️ Model file not found at {MODEL_PATH}")
        return

    if not os.path.exists(ADAPTER_PATH):
        print(f"⚠️ Adapter file not found at {ADAPTER_PATH}")
        return

    try:
        # Load model with llama.cpp and adapter
        llm = Llama(
            model_path=MODEL_PATH,
            lora_path=ADAPTER_PATH,  # Load the adapter
            n_gpu_layers=-1,         # Offload all layers to GPU (requires CUDA build)
            n_ctx=8192,
            verbose=True
        )
        
        print("✅ Model loaded successfully with GPU support!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise e

def generate_ui_code(prompt: str) -> str:
    """Generate UI code using the GGUF model"""
    
    system_prompt = """You are WebJanak AI, an expert UI code generator.
Generate complete, production-ready HTML code with inline CSS and JavaScript.

Requirements:
1. Create a single, self-contained HTML file
2. Include inline CSS styles within a <style> tag (use modern, beautiful design)
3. Use vanilla JavaScript or React (via CDN) where appropriate
4. Make it responsive and mobile-friendly
5. Add smooth animations and transitions
6. Use a modern color palette with gradients
7. Include proper semantic HTML
8. Make it interactive and engaging

Return ONLY valid HTML code starting with <!DOCTYPE html>. No explanations."""

    # Format for Qwen chat template
    formatted_prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n"
    
    output = llm(
        formatted_prompt,
        max_tokens=4096,
        temperature=0.7,
        top_p=0.9,
        stop=["<|im_end|>"],
        echo=False
    )
    
    response = output['choices'][0]['text']
    
    # Clean up markdown code blocks if present
    response = response.replace("```html", "").replace("```", "").strip()
    
    return response

def enhance_ui_code(code: str) -> str:
    """Enhance existing UI code using the GGUF model"""
    
    system_prompt = """You are WebJanak AI, an expert web developer.
Your task is to Enhance the following HTML code to make it a proper, production-ready website.

Improvement Goals:
1. Proper HTML Structure (semantic tags, meta tags)
2. Modern CSS (Flexbox/Grid, smooth animations, responsive design, beautiful color palette)
3. JavaScript Functionality (interactive features, form validation)
4. Best Practices (clean code, SEO-friendly)

Return ONLY the complete, enhanced HTML code. Do not include explanations. Start directly with <!DOCTYPE html>."""

    prompt = f"Here is the code to enhance:\n\n{code}\n\nEnhance this code now."

    # Format for Qwen chat template
    formatted_prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n"
    
    output = llm(
        formatted_prompt,
        max_tokens=4096,   # Allow enough tokens for full file rewrite
        temperature=0.7,
        top_p=0.9,
        stop=["<|im_end|>"],
        echo=False
    )
    
    response = output['choices'][0]['text']
    
    # Clean up markdown code blocks if present
    response = response.replace("```html", "").replace("```", "").strip()
    
    return response

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": llm is not None,
        "type": "gguf"
    })

@app.route('/generate', methods=['POST'])
def generate():
    """Generate UI code from prompt"""
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        if llm is None:
            # Try loading again if it wasn't loaded
            if os.path.exists(MODEL_PATH):
                load_model()
            
            if llm is None:
                return jsonify({"error": "Model not loaded. Check server logs."}), 500
        
        print(f"📝 Generating code for: {prompt[:50]}...")
        
        # Generate code
        generated_code = generate_ui_code(prompt)
        
        print("✅ Code generated successfully!")
        
        return jsonify({
            "success": True,
            "code": generated_code
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/enhance', methods=['POST'])
def enhance():
    """Enhance existing UI code"""
    try:
        data = request.json
        code = data.get('code')
        
        if not code:
            return jsonify({"error": "Code is required"}), 400
        
        if llm is None:
            if os.path.exists(MODEL_PATH):
                load_model()
            
            if llm is None:
                return jsonify({"error": "Model not loaded. Check server logs."}), 500
        
        print("✨ Enhancing code with local model...")
        
        # Enhance code
        enhanced_code = enhance_ui_code(code)
        
        print("✅ Code enhanced successfully!")
        
        return jsonify({
            "success": True,
            "code": enhanced_code
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 WebJanak GGUF Model Server")
    print("=" * 60)
    
    try:
        if os.path.exists(MODEL_PATH):
            load_model()
        else:
            print(f"⚠️  GGUF model not found at {MODEL_PATH}")
            print("   Please run conversion steps first.")
            
        print("\n" + "=" * 60)
        print("🌐 Server starting on http://localhost:5000")
        print("=" * 60 + "\n")
        
        app.run(host='0.0.0.0', port=5000, debug=False)
        
    except Exception as e:
        print(f"\n❌ Failed to start server: {str(e)}")
        exit(1)
