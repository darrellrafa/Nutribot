"""
Test Gemini API Connection
Quick script to verify API key and list available models
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv('GEMINI_API_KEY')

if not api_key or api_key == 'your_gemini_api_key_here':
    print("❌ ERROR: Gemini API Key tidak ditemukan atau belum diset!")
    print("\n📝 Cara fix:")
    print("1. Buka file .env")
    print("2. Ganti 'your_gemini_api_key_here' dengan API key kamu")
    print("3. Get API key di: https://makersuite.google.com/app/apikey")
    exit(1)

print(f"✅ API Key ditemukan: {api_key[:20]}...")

# Configure Gemini
try:
    genai.configure(api_key=api_key)
    print("✅ Gemini API configured successfully!")
except Exception as e:
    print(f"❌ Error configuring Gemini: {e}")
    exit(1)

# List available models
print("\n📋 Available Gemini Models:")
print("-" * 50)

try:
    models = genai.list_models()
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"✅ {model.name}")
            print(f"   Display Name: {model.display_name}")
            print(f"   Description: {model.description[:80]}...")
            print()
except Exception as e:
    print(f"❌ Error listing models: {e}")
    exit(1)

# Test simple generation
print("\n🧪 Testing simple text generation...")
print("-" * 50)

try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Say 'Hello from NutriBot!' in Indonesian")
    print(f"✅ Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

print("\n" + "=" * 50)
print("✅ ALL TESTS PASSED! Gemini API is working!")
print("=" * 50)
