import json
import requests
import time
from urllib.parse import urljoin
import os

# List of applications extracted from the image
apps = [
    # Big Tech
    "GitHub Copilot", "Cursor", "Gitwit", "Gemini CLI", "Claude Code", "Code Llama", "Grok 4", "GPT-5", "CodeWhisperer",
    
    # Copilot category
    "CodeComplete", "CODER", "iTerm2", "Kodezi", "PIECES", "Pretzel AI", "Refraction", "SourceAI", "Tabby", "TRAE",
    "typo", "Voirflow", "Zed", "bloop",
    
    # Agentic
    "Magic", "BLACKBOXAI", "CODEGPT", "CodeMate.ai", "AgentFarm", "Continue", "SOLVR", "augment code",
    "warp", "Zerve", "Gitpod", "AI Query", "Bito", "Cline", "Codegen", "Windsurf",
    "CodeWP", "Coframe", "Devin", "FACTORY", "million", "Neuralogics", "perplexity", "Poolside",
    "savery", "Sudocode", "Tusk", "Vanna.AI",
    
    # Low code / No code
    "anima", "Fine", "metatab.io", "Tempo", "Base 44", "Bifrost", "bolt.new", "COSINE", "fume",
    "Gignite", "HeroUI Chat", "Lovable", "Pythagora", "Readdy", "replit", "Taipy", "VIZ", "XAMUN.AI"
]

def search_app_info(app_name):
    """Search for application information"""
    try:
        # Simple approach - try common patterns
        possible_urls = [
            f"https://{app_name.lower().replace(' ', '')}.com",
            f"https://{app_name.lower().replace(' ', '-')}.com",
            f"https://{app_name.lower().replace(' ', '')}.io",
            f"https://{app_name.lower().replace(' ', '-')}.io",
            f"https://{app_name.lower().replace(' ', '')}.ai",
            f"https://{app_name.lower().replace(' ', '-')}.ai"
        ]
        
        for url in possible_urls:
            try:
                response = requests.get(url, timeout=5, headers={'User-Agent': 'Mozilla/5.0'})
                if response.status_code == 200:
                    # Extract title and description
                    content = response.text
                    title = ""
                    description = ""
                    
                    # Extract title
                    if '<title>' in content:
                        title = content.split('<title>')[1].split('</title>')[0].strip()
                    
                    # Extract description
                    if 'name="description"' in content:
                        desc_part = content.split('name="description"')[1]
                        if 'content="' in desc_part:
                            description = desc_part.split('content="')[1].split('"')[0].strip()
                    
                    if title or description:
                        return {
                            "name": app_name,
                            "website": url,
                            "description": description or title,
                            "icon": f"icons/{app_name.replace(' ', '_')}.ico"
                        }
                        
            except:
                continue
                
        return None
        
    except Exception as e:
        print(f"Error searching for {app_name}: {e}")
        return None

# Process applications
results = []
for i, app in enumerate(apps[:10]):  # Start with first 10
    print(f"Processing {i+1}/{len(apps[:10])}: {app}")
    info = search_app_info(app)
    if info:
        results.append(info)
        print(f"Found: {info['website']}")
    else:
        print(f"Not found: {app}")
    time.sleep(1)  # Be respectful

# Save results
with open('ai_coding_apps.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Saved {len(results)} applications")
