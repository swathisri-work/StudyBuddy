import fitz
import re
import json
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATERIALS = ROOT / "study-materials"
BANKS = {
    "AFCAT": ROOT / "data" / "afcat-previous.json",
    "TNPSC": ROOT / "data" / "tnpsc-previous.json",
}

def extract_from_pdf():
    extracted_counts = {"AFCAT": 0, "TNPSC": 0}
    
    for exam, bank_path in BANKS.items():
        existing_data = []
        if bank_path.exists():
            existing_data = json.loads(bank_path.read_text(encoding='utf-8'))
            
        pdf_dir = MATERIALS / exam
        
        # Simple extraction logic: Text based papers only.
        for pdf_path in pdf_dir.glob("*.pdf"):
            filename = pdf_path.name
            kind = "previous-year" if ("Solved Paper" in filename or "Group-4" in filename) else "study-material"
            
            # Identify year
            year_match = re.search(r"20\d{2}", filename)
            year = year_match.group(0) if year_match else None
            
            doc = fitz.open(pdf_path)
            full_text = ""
            for page in doc:
                full_text += page.get_text("text") + "\n"
                
            # If no text
            if len(full_text.strip()) < 100:
                print(f"[{exam}] {filename} OCR Required; Skipped.")
                continue
                
            # Basic regex to extract questions in format:
            # 1. What is...
            # (a) opt1
            # (b) opt2
            # (c) opt3
            # (d) opt4
            pattern = re.compile(
                r"(?P<qnum>\d{1,3})\.\s+(?P<question>.*?)\s+"
                r"\([aA]\)\s+(?P<optA>.*?)\s+"
                r"\([bB]\)\s+(?P<optB>.*?)\s+"
                r"\([cC]\)\s+(?P<optC>.*?)\s+"
                r"\([dD]\)\s+(?P<optD>.*?)(?=\n\d{1,3}\.\s+|\Z)",
                re.DOTALL
            )
            
            matches = pattern.finditer(full_text)
            
            for m in matches:
                q_text = m.group("question").strip()
                opts = [
                    m.group("optA").strip(),
                    m.group("optB").strip(),
                    m.group("optC").strip(),
                    m.group("optD").strip()
                ]
                
                # Check language for TNPSC
                lang = "ta" if re.search(r"[\u0B80-\u0BFF]", q_text) else "en"
                
                existing_data.append({
                    "id": str(uuid.uuid4()),
                    "exam": exam.lower(),
                    "year": year,
                    "subject": "general_awareness" if exam == "AFCAT" else "general_studies", # Fallback subject
                    "topic": "General", 
                    "difficulty": "medium",
                    "question": q_text,
                    "options": opts,
                    "correctAnswer": 0, # Since we didn't extract answer key reliably in this simple pass, mark as needs-review or 0
                    "explanation": "Extracted from source.",
                    "language": lang,
                    "type": kind,
                    "verification": "needs-review",
                    "source": f"{filename}"
                })
                extracted_counts[exam] += 1
                
        # Write back
        bank_path.parent.mkdir(parents=True, exist_ok=True)
        bank_path.write_text(json.dumps(existing_data, ensure_ascii=False, indent=2), encoding='utf-8')
        
    print(f"Extracted {extracted_counts['AFCAT']} AFCAT questions and {extracted_counts['TNPSC']} TNPSC questions.")

if __name__ == "__main__":
    extract_from_pdf()
