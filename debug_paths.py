import os
import sys
import glob
import ctypes

def check_nvidia_paths():
    print("--- Searching for NVIDIA libraries ---")
    site_packages = next((p for p in sys.path if 'site-packages' in p), None)
    if not site_packages:
        print("Could not find site-packages in sys.path")
        return

    print(f"Site-packages: {site_packages}")
    nvidia_path = os.path.join(site_packages, 'nvidia')
    
    if not os.path.exists(nvidia_path):
        print(f"NVIDIA directory not found at {nvidia_path}")
        return

    print(f"Found NVIDIA directory: {nvidia_path}")
    
    dll_dirs = []
    
    # Walk through nvidia directory and find 'bin' or 'lib' folders
    for root, dirs, files in os.walk(nvidia_path):
        if 'bin' in dirs:
            bin_path = os.path.join(root, 'bin')
            print(f"Found bin path: {bin_path}")
            dll_dirs.append(bin_path)
            
        # List some DLLs to verify existence
        for file in files:
            if file.endswith('.dll') and ('cublas' in file or 'cudart' in file):
                print(f"  Found DLL: {os.path.join(root, file)}")

    print(f"--- Attempting to load DLLs explicitly ---")
    for dll_dir in dll_dirs:
        os.add_dll_directory(dll_dir)
        os.environ['PATH'] = dll_dir + os.pathsep + os.environ['PATH']
    
    # Try loading cudart directly
    try:
        # Find explicit name usually cudart64_12.dll
        print("Trying to load cudart64_12.dll...")
        ctypes.CDLL("cudart64_12.dll")
        print("SUCCESS: Loaded cudart64_12.dll")
    except Exception as e:
        print(f"FAILED Loading cudart64_12.dll: {e}")

    try:
        # Find explicit name usually cublas64_12.dll
        print("Trying to load cublas64_12.dll...")
        ctypes.CDLL("cublas64_12.dll")
        print("SUCCESS: Loaded cublas64_12.dll")
    except Exception as e:
        print(f"FAILED Loading cublas64_12.dll: {e}")

    print("--- Checking Llama CPP ---")
    try:
        import llama_cpp
        print(f"llama_cpp imported path: {llama_cpp.__file__}")
    except Exception as e:
        print(f"Failed to import llama_cpp: {e}")

check_nvidia_paths()
