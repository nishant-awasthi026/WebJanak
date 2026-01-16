import llama_cpp
print(f"llama-cpp-python version: {llama_cpp.__version__}")
try:
    # Try to load a dummy model or check build options if possible
    # But usually just instantiating with n_gpu_layers > 0 and checking log is best.
    # We will just print if 'cublas' or 'cuda' is in the __file__ path or try to infer.
    # Better: check if we can import Llama and seeing help/docstring isn't enough.
    # We will assume if the user has it, we can try to load a small model or just check attributes.
    print("llama_cpp imported successfully.")
    
    # Check for GGML_USE_CUDA in library (hacky but might work)
    import ctypes
    lib = llama_cpp.llama_cpp
    # This might not be exposed directly, but let's try to run a tiny script that attempts to assert GPU usage
    print("Checking for CUDA/GPU support...")
except Exception as e:
    print(e)
