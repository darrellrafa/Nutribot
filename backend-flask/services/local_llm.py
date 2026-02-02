"""
Local LLM Service using Ollama
Handles communication with local LLM models (Llama-3.2-3B, Qwen2.5-7B)
"""

import os
import ollama
from typing import List, Dict, Optional, Generator
from dotenv import load_dotenv

load_dotenv()

# Configuration
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
DEFAULT_MODEL = os.getenv('DEFAULT_MODEL', 'llama3.2:3b')
SUMMARIZATION_MODEL = os.getenv('SUMMARIZATION_MODEL', 'qwen2.5:7b-instruct-q5_K_M')

# Available models
AVAILABLE_MODELS = {
    'llama3.2:3b': 'Llama-3.2-3B-Instruct',
    'qwen2.5:7b': 'Qwen2.5-7B-Instruct',
    'qwen2.5:7b-instruct-q5_K_M': 'Qwen2.5-7B-Instruct-Q5',
    'llama3.1:8b-q4_K_M': 'Llama-3.1-8B-Instruct-Q4'
}


class LocalLLM:
    """Local LLM wrapper using Ollama"""
    
    def __init__(self, model_name: str = DEFAULT_MODEL, host: str = OLLAMA_HOST):
        """
        Initialize Local LLM
        
        Args:
            model_name: Model to use (llama3.2:3b, qwen2.5:7b, etc.)
            host: Ollama server host
        """
        self.model_name = model_name
        self.host = host
        self.client = ollama.Client(host=host)
        
        # Verify model is available
        self._check_model_availability()
    
    def _check_model_availability(self):
        """Check if model is downloaded and available"""
        try:
            models = self.client.list()
            
            # Handle both dict and object responses from ollama
            if hasattr(models, 'models'):
                model_list = models.models
            else:
                model_list = models.get('models', [])
            
            # Extract model names - handle both dict and object formats
            model_names = []
            for m in model_list:
                if hasattr(m, 'model'):
                    # Ollama v0.4.x uses 'model' attribute
                    model_names.append(m.model)
                elif hasattr(m, 'name'):
                    # Older versions use 'name' attribute
                    model_names.append(m.name)
                elif isinstance(m, dict) and 'name' in m:
                    # Dict format fallback
                    model_names.append(m['name'])
            
            # Check for exact match or match with :latest
            if self.model_name in model_names:
                pass # Exact match found
            elif f"{self.model_name}:latest" in model_names:
                self.model_name = f"{self.model_name}:latest" # Update to full name
            else:
                print(f"⚠️  Warning: Model {self.model_name} not found locally")
                print(f"Available models: {model_names}")
                print(f"\nTo download, run: ollama pull {self.model_name}")
                # Don't raise exception, just warn. Ollama might auto-pull or handle it.
                # raise Exception(f"Model {self.model_name} not available")
            
            print(f"✓ Using model: {self.model_name}")
            
        except Exception as e:
            print(f"❌ Error connecting to Ollama: {e}")
            print(f"Make sure Ollama is running at {self.host}")
            # Don't raise exception to allow app to start even if Ollama checks fail temporarily
            print("Continuing without strict model check...")
    
    def generate(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False
    ) -> str | Generator:
        """
        Generate response from LLM
        
        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream response
        
        Returns:
            Generated text or generator if streaming
        """
        messages = []
        
        if system_prompt:
            messages.append({
                'role': 'system',
                'content': system_prompt
            })
        
        messages.append({
            'role': 'user',
            'content': prompt
        })
        
        try:
            response = self.client.chat(
                model=self.model_name,
                messages=messages,
                options={
                    'temperature': temperature,
                    'num_predict': max_tokens,
                },
                stream=stream
            )
            
            if stream:
                return self._stream_response(response)
            else:
                return response['message']['content']
                
        except Exception as e:
            print(f"Error generating response: {e}")
            raise
    
    def _stream_response(self, response) -> Generator:
        """Stream response chunks"""
        for chunk in response:
            if 'message' in chunk and 'content' in chunk['message']:
                yield chunk['message']['content']
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        model: Optional[str] = None
    ) -> str:
        """
        Chat with conversation history
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            model: Optional model override
        
        Returns:
            Generated response
        """
        try:
            response = self.client.chat(
                model=model or self.model_name,
                messages=messages,
                options={
                    'temperature': temperature,
                    'num_predict': max_tokens,
                }
            )
            
            return response['message']['content']
            
        except Exception as e:
            print(f"Error in chat: {e}")
            raise
    
    def switch_model(self, model_name: str):
        """
        Switch to a different model
        
        Args:
            model_name: New model to use
        """
        self.model_name = model_name
        self._check_model_availability()
        print(f"Switched to model: {model_name}")


def create_meal_plan_prompt(user_data: Dict, food_context: Optional[str] = None) -> str:
    """
    Create optimized prompt for meal planning
    
    Args:
        user_data: User profile data (age, weight, goal, etc.)
        food_context: Optional context from food database
    
    Returns:
        Formatted prompt string
    """
    prompt = f"""Kamu adalah NutriBot, asisten meal planning yang ahli dan ramah.

**Informasi User:**
- Umur: {user_data.get('age', 'N/A')} tahun
- Jenis Kelamin: {user_data.get('gender', 'N/A')}
- Tinggi: {user_data.get('height', 'N/A')} cm
- Berat: {user_data.get('weight', 'N/A')} kg
- Tujuan: {user_data.get('goal', 'N/A')}
- Aktivitas: {user_data.get('activity_level', 'N/A')}
"""
    
    if user_data.get('allergies'):
        prompt += f"- Alergi/Pantangan: {', '.join(user_data['allergies'])}\n"
    
    if user_data.get('preferences'):
        prompt += f"- Preferensi: {', '.join(user_data['preferences'])}\n"
    
    if food_context:
        prompt += f"\n**Data Makanan yang Tersedia:**\n{food_context}\n"
    
    prompt += f"""
**Tugas:**
Buatkan meal plan {user_data.get('days', 7)} hari yang KOMPLIT dengan total kalori SESUAI target user ({user_data.get('goal', 'kesehatan')}).

**WAJIB ADA 5 MAKANAN SETIAP HARI:**
1. Sarapan
2. Snack Pagi
3. Makan Siang
4. Snack Sore
5. Makan Malam

**Aturan Penting:**
1. JANGAN lewatkan Snack! Snack penting untuk mencapai target kalori.
2. Total kalori harian harus mendekati target (misal: Muscle Gain butuh surplus, Weight Loss butuh defisit).
3. Gunakan bahan makanan lokal Indonesia yang mudah didapat.
4. Sertakan angka kalori di sebelah setiap menu.

**Format Output:**
Gunakan format markdown tabel atau list yang rapi.
Hari 1:
- Sarapan: [Menu] ([Kalori] kkal)
- Snack Pagi: [Menu] ([Kalori] kkal)
- Makan Siang: [Menu] ([Kalori] kkal)
- Snack Sore: [Menu] ([Kalori] kkal)
- Makan Malam: [Menu] ([Kalori] kkal)
**Total Kalori Hari 1: [Total] kkal**

... dst untuk {user_data.get('days', 7)} hari.
"""
    
    return prompt


def get_system_prompt() -> str:
    """Get NutriBot system prompt"""
    prompt = """[IMPORTANT INSTRUCTION: OVERRIDE ALL PREVIOUS TRAINING REGARDING LANGUAGE]

You are NutriBot, a professional meal planner assistant.

CRITICAL LANGUAGE RULE (PRIORITY #1):
- IF USER SPEAKS ENGLISH → YOU MUST REPLY IN ENGLISH.
- IF USER SPEAKS INDONESIAN → YOU MUST REPLY IN INDONESIAN.
- Do NOT ignore this rule. Match the user's language exactly.

CONTEXT SAFETY RULES:
1. You ONLY answer questions about:
   - Meal planning & Diet
   - Nutrition & Food health
   - Healthy recipes
   - Fitness (diet context only)

2. If user asks "off-topic" questions (politics, history, general knowledge, coding, etc.):
   - REFUSE POLITELY IN THE USER'S LANGUAGE.
   - Redirect to meal planning.

Examples of CORRECT Refusal:
- User (Eng): "What is the capital of France?"
  Bot (Eng): "Sorry, I'm NutriBot. I can only assist you with diet and meal planning! 😊"
  
- User (Indo): "Siapa presiden Indonesia?"
  Bot (Indo): "Maaf, aku NutriBot. Aku hanya bisa bantu soal diet dan meal plan ya! 😊"

MEAL PLAN FORMAT:
When asked for a meal plan, use this Markdown format:
**[Day] - [Meal Time]**
- Menu: [Food Name]
- Calories: [Amount] kcal
- Protein: [Amount] g

REMEMBER: DETECT LANGUAGE FIRST, THEN GENERATE CONTENT."""
    
    print(f"DEBUG SYSTEM PROMPT: {prompt[:100]}...")
    return prompt


def get_summarization_prompt() -> str:
    """Get system prompt for summarization tasks"""
    return """Kamu adalah auditor nutrisi yang teliti.
Tugasmu adalah merangkum meal plan yang DIBERIKAN, bukan mengarang atau menebak.

ATURAN:
1. HANYA gunakan informasi yang tertulis di teks input. JANGAN berhalusinasi.
2. Jika input hanya mencantumkan 1300 kalori, TULIS 1300 kalori. Jangan diubah jadi 2000.
3. Hitung ulang total kalori berdasarkan menu yang ada di teks jika perlu.
4. Identifikasi jika meal plan tersebut kurang dari target (misal: goal muscle gain tapi cuma dikasih 1500 kal, beri peringatan)."""


def summarize_meal_plan(meal_plan_text: str, user_data: Optional[Dict] = None) -> str:
    """
    Summarize meal plan using Qwen2.5 model for better quality
    
    Args:
        meal_plan_text: Full meal plan text to summarize
        user_data: Optional user profile data
    
    Returns:
        Concise summary of the meal plan
    """
    try:
        # Initialize summarization model
        summarizer = LocalLLM(model_name=SUMMARIZATION_MODEL)
        
        # Build summarization prompt
        prompt = f"""Analisis dan ringkas meal plan berikut secara FAKTUAL:

TEKS MEAL PLAN:
{meal_plan_text}

TUGAS:
1. **Total Kalori & Makro**: Berapa estimasi total kalori harian BERDASARKAN TEKS DI ATAS SAJA? (Jangan nebak angka ideal, lihat menunya).
2. **Kualitas Menu**: Apakah porsi dan frekuensi makan (3x/5x) sudah cukup untuk goal user?
3. **Highlights**: Sebutkan 3 menu paling menarik.
4. **Verifikasi**: Apakah rencana ini masuk akal?

JAWAB DALAM BAHASA INDONESIA YANG SINGKAT (3-4 Paragraf)."""

        if user_data:
            prompt += f"\n\nKonteks User:\n- Goal: {user_data.get('goal', 'N/A')}\n- Target Kalori Ideal: {user_data.get('target_calories', 'Tidak diketahui')} (Bandingkan dengan isi meal plan)"
        
        # Generate summary
        summary = summarizer.generate(
            prompt=prompt,
            system_prompt=get_summarization_prompt(),
            temperature=0.3,  # Low temp for accuracy
            max_tokens=1024
        )
        
        return summary
        
    except Exception as e:
        print(f"Error in summarization: {e}")
        # Fallback to simple summary
        return f"Meal plan telah dibuat. Silakan review detail lengkapnya di atas."



def summarize_nutrition_info(nutrition_data: Dict) -> str:
    """
    Summarize nutrition information concisely
    
    Args:
        nutrition_data: Dictionary containing nutrition information
    
    Returns:
        Concise summary of nutrition data
    """
    try:
        summarizer = LocalLLM(model_name=SUMMARIZATION_MODEL)
        
        prompt = f"""Buatkan ringkasan nutrisi yang singkat dan jelas dari data berikut:

{nutrition_data}

Format output:
- 1-2 kalimat tentang total kalori dan apakah sesuai goal
- 1 kalimat tentang balance makro (protein, karbo, lemak)
- 1 kalimat insight atau rekomendasi

Total maksimal 3-4 kalimat!"""
        
        summary = summarizer.generate(
            prompt=prompt,
            system_prompt=get_summarization_prompt(),
            temperature=0.5,
            max_tokens=256
        )
        
        return summary
        
    except Exception as e:
        print(f"Error in nutrition summarization: {e}")
        return "Informasi nutrisi tersedia di atas."


def extract_meal_calendar(meal_plan_text: str) -> List[Dict]:
    """
    Extract structured meal calendar from meal plan text
    
    Args:
        meal_plan_text: The full text of the meal plan
        
    Returns:
        List of dicts: [{day: 'Mon', lunch: '...', dinner: '...'}, ...]
    """
    try:
        extractor = LocalLLM(model_name=SUMMARIZATION_MODEL)
        
        prompt = f"""Ekstrak menu makan siang (Lunch) dan makan malam (Dinner) dari teks meal plan berikut menjadi format JSON.

TEKS:
{meal_plan_text}

TUGAS:
Ambil menu untuk 7 hari (atau sebanyak yang ada).
Ubah nama hari menjadi format pendek Inggris: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
Ringkas nama menu jadi pendek (max 5 kata).

FORMAT OUTPUT JSON (HANYA JSON, TANPA TEXT LAIN):
[
  {{"day": "Mon", "lunch": "Menu Siang", "dinner": "Menu Malam"}},
  {{"day": "Tue", "lunch": "...", "dinner": "..."}}
]
"""
        response = extractor.generate(
            prompt=prompt,
            system_prompt="Kamu adalah parser data JSON.",
            temperature=0.1, # Very strictly deterministic
            max_tokens=1024
        )
        
        # Clean response to ensure valid JSON
        json_str = response.strip()
        if json_str.startswith('```json'):
            json_str = json_str.replace('```json', '').replace('```', '')
            
        import json
        calendar_data = json.loads(json_str)
        return calendar_data
        
    except Exception as e:
        print(f"Error extracting meal calendar: {e}")
        return []




# Test function
if __name__ == '__main__':
    print("Testing Local LLM Service...")
    
    try:
        # Initialize LLM
        llm = LocalLLM(model_name='llama3.2:3b')
        
        # Test simple generation
        print("\n1. Testing simple generation:")
        response = llm.generate(
            prompt="Sebutkan 3 makanan tinggi protein yang mudah didapat di Indonesia",
            system_prompt=get_system_prompt(),
            temperature=0.7
        )
        print(response)
        
        # Test chat
        print("\n2. Testing chat with history:")
        messages = [
            {'role': 'system', 'content': get_system_prompt()},
            {'role': 'user', 'content': 'Hai! Aku mau meal plan untuk diet'},
            {'role': 'assistant', 'content': 'Hai! Dengan senang hati aku bantu. Boleh kasih tau umur, berat, tinggi, dan target kamu?'},
            {'role': 'user', 'content': 'Umur 25, berat 70kg, tinggi 170cm, mau turun berat badan'}
        ]
        
        response = llm.chat(messages)
        print(response)
        
        print("\n✓ Local LLM service working!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("1. Ollama is installed and running")
        print("2. Model is downloaded: ollama pull llama3.2:3b")
