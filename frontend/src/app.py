
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from PIL import Image
import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend requests

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Google Custom Search API configuration
API_KEY = "AIzaSyB4vIkEsywN13MZ3Cf2bwvZ6sD2Wkx_SF4"
SEARCH_ENGINE_ID = "e601386b9793f4353"
URL = "https://www.googleapis.com/customsearch/v1"

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyDXmYwgu7hu9iQwFwIQcYCQ_G9hmNYdh6g"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def verify_claim_with_gemini(claim, evidence=None):
    """Verify a claim using Gemini API, returning confidence from 0 to 100."""
    if evidence:
        prompt = (
            f"Given the claim: '{claim}'\n"
            f"And the evidence: '{evidence}'\n"
            "Determine if the evidence supports (ENTAILMENT), contradicts (CONTRADICTION), "
            "or is inconclusive (NEUTRAL) about the claim. Respond with the following format:\n"
            "Verdict: [ENTAILMENT/CONTRADICTION/NEUTRAL]\n"
            "Confidence: [0-100]\n"
            "Explanation: [Your explanation here]\n"
        )
    else:
        prompt = (
            f"Given the claim: '{claim}'\n"
            "Based on your knowledge of news events up to March 18, 2025, determine if this claim "
            "is supported (ENTAILMENT), contradicted (CONTRADICTION), or inconclusive (NEUTRAL). "
            "Respond with the following format:\n"
            "Verdict: [ENTAILMENT/CONTRADICTION/NEUTRAL]\n"
            "Confidence: [0-100]\n"
            "Explanation: [Your explanation here]\n"
            "If the claim references events after March 28, 2025, assume it’s breaking news from March 17 and evaluate "
            "based on plausible trends or prior context."
        )
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        print(f"Gemini API response: {response_text}")

        # Parse the response to extract verdict, confidence, and explanation
        lines = response_text.split("\n")
        verdict = "NEUTRAL"
        confidence = 50
        explanation = "No explanation provided."

        for line in lines:
            if line.startswith("Verdict:"):
                verdict = line.split(":")[1].strip().upper()
            elif line.startswith("Confidence:"):
                try:
                    confidence = int(line.split(":")[1].strip())
                    confidence = max(0, min(100, confidence))  # Ensure confidence is between 0 and 100
                except (IndexError, ValueError):
                    confidence = 50  # Default if parsing fails
            elif line.startswith("Explanation:"):
                explanation = line.split(":", 1)[1].strip()

        # Adjust confidence based on verdict
        if verdict == "ENTAILMENT":
            # True claim: High confidence (80-100)
            confidence = max(80, confidence)  # Ensure at least 80 for true claims
        elif verdict == "CONTRADICTION":
            # False claim: Set confidence to 0 for completely false claims
            confidence = 0  # Set to 0 for false claims
        else:
            # Neutral: Moderate confidence (40-60)
            confidence = max(40, min(60, confidence))

        return [(verdict, confidence)], verdict, explanation
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return [("NEUTRAL", 0)], "NEUTRAL", str(e)

def get_web_evidence(claim, num_results=5, start_index=0):
    """Fetch evidence from the web starting at a given index."""
    query = " ".join(claim.split()[:10])
    params = {"q": query, "key": API_KEY, "cx": SEARCH_ENGINE_ID, "num": num_results}
    try:
        response = requests.get(URL, params=params, timeout=10)
        response.raise_for_status()
        results = response.json()

        if "items" not in results or start_index >= len(results["items"]):
            print(f"No search results found or index {start_index} out of range.")
            return None, "No credible evidence found.", results

        link = results["items"][start_index]["link"]
        print(f"Attempting result {start_index + 1}: {link}")
        
        try:
            page_response = requests.get(link, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }, timeout=10)
            page_response.raise_for_status()
            soup = BeautifulSoup(page_response.content, "html.parser")
            paragraphs = soup.find_all("p")
            raw_evidence = [p.get_text().strip() for p in paragraphs if p.get_text().strip()]

            evidence_lines = [line for line in raw_evidence if len(line) > 20]
            evidence = "\n".join(evidence_lines)

            if len(evidence) > 4000:
                evidence = evidence[:4000] + "... [Truncated for Gemini API]"
            print(f"Successfully fetched evidence from result {start_index + 1}: {link}")
            print(f"Evidence token count (approx characters): {len(evidence)}")
            return link, evidence, results
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch result {start_index + 1} ({link}): {e}")
            return None, f"Failed to fetch evidence from {link}: {e}", results
    except requests.exceptions.RequestException as e:
        print(f"Error fetching search results: {e}")
        return None, f"Error fetching search results: {e}", None

def extract_text_from_image(image_path):
    """Extract text data from the image using Gemini API."""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found at {image_path}")
        image = Image.open(image_path)
        print(f"Processing image: {image_path} (Size: {os.path.getsize(image_path) / (1024 * 1024):.2f} MB)")

        response = model.generate_content(
            [image, "Extract all the text from this image and return it as a single string."]
        )
        extracted_text = response.text
        print(f"Extracted Text: {extracted_text[:500]}..." if len(extracted_text) > 500 else extracted_text)
        return extracted_text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

@app.route('/verify-news', methods=['POST'])
def verify_news():
    """Endpoint to verify a news claim."""
    data = request.get_json()
    claim = data.get('claim')
    if not claim:
        return jsonify({"error": "Claim is required"}), 400

    # Step 1: Check with Gemini's internal knowledge
    verdicts, final_verdict, explanation = verify_claim_with_gemini(claim)
    initial_confidence = verdicts[0][1]

    # Step 2: If NEUTRAL or error, proceed to web search
    if final_verdict == "NEUTRAL":
        print("\nNEUTRAL verdict or error detected, proceeding to web search...")
        index = 0
        num_results = 5
        confidence_decrement = 5

        while index < num_results:
            link, evidence, results = get_web_evidence(claim, num_results=num_results, start_index=index)
            if link:
                # Adjust confidence based on evidence quality (e.g., length of evidence)
                evidence_quality = min(len(evidence) / 4000, 1.0)  # Normalize evidence length (max 4000 chars)
                verdicts, final_verdict, explanation = verify_claim_with_gemini(claim, evidence)
                adjusted_confidence = verdicts[0][1] * (0.8 + 0.2 * evidence_quality)  # Adjust based on evidence quality
                adjusted_confidence = max(50, adjusted_confidence - (index * confidence_decrement))  # Further adjust based on search result index
                verdicts = [(verdicts[0][0], int(adjusted_confidence))]
                if final_verdict in ["ENTAILMENT", "CONTRADICTION"]:
                    break
            else:
                print(f"Failed to fetch evidence from result {index + 1}.")
            
            index += 1
            if index >= num_results or (results and index >= len(results["items"])):
                print("\nExhausted all search results.")
                break

    # Prepare response
    conclusion = "UNVERIFIED"
    if final_verdict == "ENTAILMENT":
        conclusion = "TRUE"
    elif final_verdict == "CONTRADICTION":
        conclusion = "FALSE"

    return jsonify({
        "claim": claim,
        "verdict": conclusion,
        "confidence": verdicts[0][1],
        "explanation": explanation
    })

@app.route('/verify-image', methods=['POST'])
def verify_image():
    """Endpoint to verify a claim extracted from an image."""
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded image
    filename = secure_filename(file.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(image_path)

    # Extract text from image
    extracted_text = extract_text_from_image(image_path)
    if not extracted_text:
        return jsonify({"error": "Failed to extract text from image"}), 500

    # Verify the extracted text as a claim
    verdicts, final_verdict, explanation = verify_claim_with_gemini(extracted_text)
    initial_confidence = verdicts[0][1]

    # If NEUTRAL, proceed to web search
    if final_verdict == "NEUTRAL":
        print("\nNEUTRAL verdict or error detected, proceeding to web search...")
        index = 0
        num_results = 5
        confidence_decrement = 5

        while index < num_results:
            link, evidence, results = get_web_evidence(extracted_text, num_results=num_results, start_index=index)
            if link:
                # Adjust confidence based on evidence quality
                evidence_quality = min(len(evidence) / 4000, 1.0)  # Normalize evidence length (max 4000 chars)
                verdicts, final_verdict, explanation = verify_claim_with_gemini(extracted_text, evidence)
                adjusted_confidence = verdicts[0][1] * (0.8 + 0.2 * evidence_quality)
                adjusted_confidence = max(50, adjusted_confidence - (index * confidence_decrement))
                verdicts = [(verdicts[0][0], int(adjusted_confidence))]
                if final_verdict in ["ENTAILMENT", "CONTRADICTION"]:
                    break
            else:
                print(f"Failed to fetch evidence from result {index + 1}.")
            
            index += 1
            if index >= num_results or (results and index >= len(results["items"])):
                print("\nExhausted all search results.")
                break

    # Prepare response
    conclusion = "UNVERIFIED"
    if final_verdict == "ENTAILMENT":
        conclusion = "TRUE"
    elif final_verdict == "CONTRADICTION":
        conclusion = "FALSE"

    # Clean up uploaded file
    os.remove(image_path)

    return jsonify({
        "extracted_text": extracted_text,
        "verdict": conclusion,
        "confidence": verdicts[0][1],
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)


