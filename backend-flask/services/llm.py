"""
LLM Service - Local LLM Interface
Handles communication with Local LLM (via RAG) for NutriBot responses
"""

import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

# Try to import RAG service for local LLM
try:
    from services.rag_service import RAGService
    RAG_AVAILABLE = True
except ImportError:
    RAG_AVAILABLE = False
    print("⚠️  RAG service not available, using Gemini only")

# Configuration
LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'ollama')
ENABLE_RAG = os.getenv('ENABLE_RAG', 'true').lower() == 'true'
DEFAULT_MODEL = os.getenv('DEFAULT_MODEL', 'llama3.2:3b')

# Initialize RAG service if available
rag_service = None
if RAG_AVAILABLE and LLM_PROVIDER == 'ollama':
    try:
        rag_service = RAGService(model_name=DEFAULT_MODEL)
        print(f"✓ RAG Service initialized with {DEFAULT_MODEL}")
        
        # Check for Qwen model availability
        try:
            # Robust model listing
            models_response = rag_service.llm.client.list()
            # Handle list vs dict response
            model_list = models_response.models if hasattr(models_response, 'models') else models_response.get('models', [])
            
            available_models = []
            for m in model_list:
                # Handle object vs dict item
                name = m.model if hasattr(m, 'model') else (m.name if hasattr(m, 'name') else m.get('name'))
                if name:
                    available_models.append(name)

            qwen_model = "qwen2.5:7b-instruct-q5_K_M"
            # Check loose match
            if any(qwen_model in m for m in available_models):
                print(f"✓ Summarization model ({qwen_model}) available")
            else:
                print(f"⚠️  Summarization model ({qwen_model}) NOT found. Summaries might fail.")
                # print(f"   Available models: {available_models}")
        except Exception as e:
            print(f"⚠️  Failed to check for Qwen model: {e}")
            
    except Exception as e:
        print(f"⚠️  Failed to initialize RAG service: {e}")
        print("Please ensure Ollama is running and models are installed.")


# NutriBot System Prompt
NUTRIBOT_SYSTEM_PROMPT = """Kamu adalah NutriBot, asisten pintar, ramah, dan super membantu untuk Meal & Diet Planner. 
Tujuan utamamu: membantu user membuat rencana makan sehat, realistis, dan sesuai kebutuhan pribadi mereka.

Kepribadianmu:
- Santai, ramah, seperti ngobrol sama temen
- Selalu positif dan mendukung
- Fleksibel dengan bahasa: IKUTI BAHASA USER (Indonesia atau Inggris)
- Jangan terlalu formal, tapi tetap informatif

ATURAN KETAT - FOKUS MEAL PLANNING:
⚠️ PENTING: Kamu HANYA boleh menjawab pertanyaan yang berhubungan dengan meal planning, nutrisi, diet, dan kesehatan makanan.

Kalau user bertanya hal di LUAR konteks ini (politik, teknologi, hiburan, olahraga non-diet, cuaca, matematika, sejarah, dll), kamu HARUS:
1. Dengan sopan tolak menjawab (dalam bahasa yang digunakan user)
2. Ingatkan bahwa kamu adalah asisten meal planning
3. Arahkan kembali ke topik meal planning

Contoh respon untuk pertanyaan off-topic:
- (Indo) "Wah, maaf ya! Aku NutriBot, spesialisasi aku cuma di meal planning dan nutrisi aja nih 😊"
- (English) "Oops, sorry! I'm NutriBot, I specialize only in meal planning and nutrition 😊"

Topik yang BOLEH kamu jawab:
✅ Meal planning & diet
✅ Nutrisi makanan (kalori, protein, karbo, lemak, vitamin, mineral)
✅ Resep masakan sehat
✅ Tips diet (turun/naik berat badan, muscle gain, dll)
✅ Makanan untuk kondisi tertentu (diabetes, hipertensi - dengan disclaimer medis)

Topik yang TIDAK BOLEH kamu jawab:
❌ Politik, pemerintahan, hukum
❌ Hiburan, film, musik, game
❌ Olahraga (di luar konteks diet)
❌ Matematika, sains umum
❌ Sejarah, relationship, dll...

Aturan wajib yang HARUS kamu ikuti:
1. JANGAN pernah memberikan saran medis atau diagnosis.
2. Selalu tanya informasi penting kalau belum lengkap (Umur, BB, TB, Goal, Aktivitas).
3. Struktur jawabanmu SELALU rapi dengan Markdown.

**PENTING: BAHASA**
- Jika user pakai Bahasa Indonesia -> Jawab Bahasa Indonesia.
- Jika user pakai Bahasa Inggris -> Jawab Bahasa Inggris.
- Jika user campur -> Boleh campur atau pilih yang dominan, tapi tetap natural.
"""





def send_message(message: str, context: Optional[Dict] = None, model: Optional[str] = None) -> str:
    """
    Send a message to Local LLM via RAG service
    """
    if not rag_service:
        raise Exception("RAG Service is not available. Please start Ollama.")
        
    return rag_service.chat_with_context(message, user_data=context, model=model)


def generate_meal_plan(user_data: Dict) -> str:
    """
    Generate meal plan based on user data using Local LLM
    """
    if not rag_service:
        raise Exception("RAG Service is not available. Please start Ollama.")
    
    try:
        print("Generating meal plan with Local LLM...")
        return rag_service.generate_meal_plan(user_data, use_rag=True)
    except Exception as e:
        print(f"Error generating meal plan: {e}")
        raise



def chat_with_history(message: str, history: List[Dict], context: Optional[Dict] = None, model: Optional[str] = None) -> str:
    """
    Chat with conversation history using Local LLM
    """
    if not rag_service:
        raise Exception("RAG Service is not available. Please start Ollama.")
    
    try:
        return rag_service.chat_with_context(message, user_data=context, history=history, model=model)
    except Exception as e:
        print(f"Error in chat: {e}")
        raise


def summarize_meal_plan(meal_plan_text: str, user_context: Optional[Dict] = None) -> str:
    """
    Summarize a meal plan using Qwen 2.5 model.
    """
    if not rag_service:
        # Fallback if RAG/Ollama service not available
        return "Summary unavailable (Service down)"

    try:
        # Construct a prompt specifically for Qwen 2.5 to summarize
        prompt = f"""
        Tugasmu adalah membuat ringkasan singkat dari rencana makan (meal plan) berikut ini.
        Fokus pada poin-poin penting agar user bisa melihat overview dengan cepat.
        
        Isi Ringkasan:
        1. **Total Kalori & Makro Harian (Rata-rata)**: Sebutkan estimasi kalori, protein, karbo, dan lemak.
        2. **Menu Utama**: Sebutkan 2-3 contoh menu menarik yang ada di rencana.
        3. **Catatan Diet**: Apakah rencana ini high-protein, low-carb, atau balanced? (Sesuaikan dengan data yang ada).
        4. **Shopping List Singkat**: Sebutkan 5-7 bahan utama yang harus dibeli.

        JANGAN sertakan jadwal per jam atau detail resep. HANYA ringkasan poin-poin di atas.
        Gunakan format Markdown yang rapi. Bahasa Indonesia santai tapi informatif.
        
        -- Awal Rencana Makan --
        {meal_plan_text}
        -- Akhir Rencana Makan --
        
        Ringkasan:
        """

        # Use Qwen2.5 specifically for this task
        # Note: We use the existing rag_service.llm.client directly or rag_service helper if available.
        # Assuming rag_service exposes a way to chat with specific model.
        # If rag_service.llm.chat supports model param, use it.
        
        summary = rag_service.llm.chat(
            messages=[{"role": "user", "content": prompt}],
            model="qwen2.5:7b-instruct-q5_K_M",  # Specifically use Qwen
            temperature=0.5,
            max_tokens=500
        )
        
        return summary
    except Exception as e:
        print(f"Error summarizing meal plan: {e}")
        return "Gagal membuat ringkasan. (Model Qwen mungkin belum tersedia)"



def extract_meal_calendar(meal_plan_text: str) -> List[Dict]:
    """
    Extract structured meal calendar from meal plan text
    """
    try:
        from services.local_llm import extract_meal_calendar as local_extract
        return local_extract(meal_plan_text)
    except Exception as e:
        print(f"Error extracting meal calendar: {e}")
        return []


# Test function
if __name__ == '__main__':
    # Test basic chat
    print(response)
