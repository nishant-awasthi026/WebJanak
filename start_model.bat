@echo off
echo Starting WebJanak Model Server...
echo Model: ./model/webjanak-qwen-base-q4_k_m.gguf
echo Adapter: ./model/webjanak-qwen-improved-adapter.gguf

if not exist "./model/webjanak-qwen-base-q4_k_m.gguf" (
    echo Error: Base model GGUF not found!
    echo Please run the conversion/quantization steps first.
    pause
    exit /b
)

if not exist "./model/webjanak-qwen-improved-adapter.gguf" (
    echo Error: Adapter GGUF not found!
    echo Please run the adapter conversion step first.
    pause
    exit /b
)

.\.venv\Scripts\python model_server.py

pause
