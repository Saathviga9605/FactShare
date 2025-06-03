import os
import logging
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Debug the path to the .env file
# Go up three directories from frontend/src/ to reach the root (NEWSFRONT/)
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(root_dir, '.env')
print(f"Looking for .env file at: {env_path}")
if not os.path.exists(env_path):
    print(f"Error: .env file not found at {env_path}")

# Load the .env file from the project root directory
load_dotenv(dotenv_path=env_path)

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)

serper_api_key = os.getenv("SERPER_API_KEY")
print(f"Loaded SERPER_API_KEY: {serper_api_key}")

if not serper_api_key:
    logging.warning("⚠️ Warning: SERPER_API_KEY is missing. Web search may not work.")

def search_news(query):
    if not serper_api_key:
        return (
            "<ul>"
            "<li>25 Schools in Tamil Nadu Reduced Electricity Bills by 2/3: "
            "<a href='https://example.com/1' target='_blank'>Read More</a></li>"
            "<li>Encounter in Jammu and Kashmir After Soldiers Intercept Infiltrators: "
            "<a href='https://example.com/2' target='_blank'>Read More</a></li>"
            "<li>Meerut Murder: Drug Withdrawal Symptoms of Accused: "
            "<a href='https://example.com/3' target='_blank'>Read More</a></li>"
            "<li>Istanbul Mayor Imamoglu Imprisoned Pending Trial: "
            "<a href='https://example.com/4' target='_blank'>Read More</a></li>"
            "<li>IPL 2025: Virat Kohli and Phil Salt Lead RCB to Victory: "
            "<a href='https://example.com/5' target='_blank'>Read More</a></li>"
            "</ul>"
            "<p>Note: I couldn't fetch the latest news because the API key is missing, but here are some recent updates on various topics!</p>"
        )

    url = "https://google.serper.dev/news"
    headers = {
        "X-API-KEY": serper_api_key,
        "Content-Type": "application/json"
    }
    payload = {"q": query, "num": 5}  # Increased to 5 results for better coverage

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()  # Raises an exception for 4xx/5xx status codes
        
        print(f"Serper API Response: {response.status_code} - {response.text}")

        results = response.json().get("news", [])
        if not results:
            return (
                "<ul>"
                "<li>25 Schools in Tamil Nadu Reduced Electricity Bills by 2/3: "
                "<a href='https://example.com/1' target='_blank'>Read More</a></li>"
                "<li>Encounter in Jammu and Kashmir After Soldiers Intercept Infiltrators: "
                "<a href='https://example.com/2' target='_blank'>Read More</a></li>"
                "<li>Meerut Murder: Drug Withdrawal Symptoms of Accused: "
                "<a href='https://example.com/3' target='_blank'>Read More</a></li>"
                "<li>Istanbul Mayor Imamoglu Imprisoned Pending Trial: "
                "<a href='https://example.com/4' target='_blank'>Read More</a></li>"
                "<li>IPL 2025: Virat Kohli and Phil Salt Lead RCB to Victory: "
                "<a href='https://example.com/5' target='_blank'>Read More</a></li>"
                "</ul>"
                "<p>Note: I couldn't find any relevant news for your query, but here are some recent updates on various topics!</p>"
            )

        # Format the results as an HTML list with clickable links
        news_items = [
            f"<li>{r['title']}: <a href='{r['link']}' target='_blank'>Read More</a></li>"
            for r in results
        ]
        return f"<ul>{''.join(news_items)}</ul>"
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return (
            "<ul>"
            "<li>25 Schools in Tamil Nadu Reduced Electricity Bills by 2/3: "
            "<a href='https://example.com/1' target='_blank'>Read More</a></li>"
            "<li>Encounter in Jammu and Kashmir After Soldiers Intercept Infiltrators: "
            "<a href='https://example.com/2' target='_blank'>Read More</a></li>"
            "<li>Meerut Murder: Drug Withdrawal Symptoms of Accused: "
            "<a href='https://example.com/3' target='_blank'>Read More</a></li>"
            "<li>Istanbul Mayor Imamoglu Imprisoned Pending Trial: "
            "<a href='https://example.com/4' target='_blank'>Read More</a></li>"
            "<li>IPL 2025: Virat Kohli and Phil Salt Lead RCB to Victory: "
            "<a href='https://example.com/5' target='_blank'>Read More</a></li>"
            "</ul>"
            "<p>Note: I couldn't fetch the latest news due to an API error, but here are some recent updates on various topics!</p>"
        )

@app.route('/')
def home():
    return jsonify({"message": "News Verification Chatbot API is running!"})

@app.route('/chat', methods=['POST'])
def chat():
    print("Received /chat request")
    data = request.json
    question = data.get('question')
    
    if not question:
        print("Missing question in request")
        return jsonify({"error": "Missing question"}), 400

    session.setdefault("chat_history", [])
    history_text = "\n".join([msg["content"] for msg in session["chat_history"]])

    search_results = search_news(question)
    response = search_results  # Return the HTML-formatted response directly
    
    session["chat_history"].append({"role": "user", "content": question})
    session["chat_history"].append({"role": "assistant", "content": response})

    print(f"Returning response: {response}")
    return jsonify({"response": response})

if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode, host="127.0.0.1", port=8000)