import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from tools.document_reader import DocumentReader
from tools.requirement_processor import extract_requirements
from tools.data_extractor import extract_data_from_doc
from tools.excel_generator import json_to_excel
import json

def doc_to_excel(doc_path: str, query: str, output_filename: str = None) -> dict:
    """complete workflow to transform a document with the requirements a user specifies into an excel file"""

    try:
        print("📄 Reading document...")
        reader = DocumentReader()
        
        if not reader.validate_file(doc_path):
            return {
                "status": "error",
                "message": f"Unsupported file format: {Path(doc_path).suffix}",
                "excel_path": None,
                "extracted_data": None
            }
        
        document_text = reader.read_document(doc_path)
        
        if "error" in document_text.lower():
            return {
                "status": "error",
                "message": f"Document reading failed: {document_text}",
                "excel_path": None,
                "extracted_data": None
            }
        
        print("🎯 Processing extraction requirements...")
        extraction_prompt = extract_requirements(query)
        
        # Step 3: Extract data using AI
        print("🤖 Extracting data with AI...")
        extracted_json = extract_data_from_doc(
            query=query,
            document=doc_path
        )
        
        # Parse extracted data
        try:
            extracted_data = json.loads(extracted_json)
        except json.JSONDecodeError:
            # Handle non-JSON responses
            return {
                "status": "error",
                "message": "AI returned invalid JSON format",
                "excel_path": None,
                "extracted_data": extracted_json
            }
        
        # Step 4: Generate Excel
        print("📊 Creating Excel file...")
        if not output_filename:
            doc_name = Path(doc_path).stem
            output_filename = f"{doc_name}_extracted.xlsx"
        
        excel_path = json_to_excel(extracted_data, output_filename)
        
        print(f"✅ Success! Excel saved to: {excel_path}")
        
        return {
            "status": "success",
            "message": "Document processed successfully",
            "excel_path": excel_path,
            "extracted_data": extracted_data
        }
        
    except Exception as e:
            return {
            "status": "error",
            "message": f"Workflow failed: {str(e)}",
            "excel_path": None,
            "extracted_data": None
        }

def multiple_docs_to_excel(document_paths: list, query: str, output_filename: str = "batch_extraction.xlsx") -> dict:
    """
    Process multiple documents with same extraction requirements
    
    Args:
        document_paths: List of document paths
        user_query: Extraction requirements for all documents
        output_filename: Single Excel file with all results
    
    Returns:
        dict with results summary
    """
    
    try:
        all_data = []
        failed_docs = []
        
        for doc_path in document_paths:
            print(f"Processing: {Path(doc_path).name}")
            
            result = doc_to_excel(doc_path, query)
            
            if result["status"] == "success":
                # Add document source to data
                doc_data = result["extracted_data"]
                if isinstance(doc_data, dict):
                    doc_data["source_document"] = Path(doc_path).name
                    all_data.append(doc_data)
                elif isinstance(doc_data, list):
                    for item in doc_data:
                        if isinstance(item, dict):
                            item["source_document"] = Path(doc_path).name
                    all_data.extend(doc_data)
            else:
                failed_docs.append({
                    "document": Path(doc_path).name,
                    "error": result["message"]
                })
        
        if all_data:
            excel_path = json_to_excel(all_data, output_filename)
            
            return {
                "status": "success",
                "message": f"Processed {len(all_data)} documents successfully",
                "excel_path": excel_path,
                "total_documents": len(document_paths),
                "successful_extractions": len(all_data),
                "failed_documents": failed_docs
            }
        else:
            return {
                "status": "error",
                "message": "No documents were successfully processed",
                "excel_path": None,
                "failed_documents": failed_docs
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Batch processing failed: {str(e)}",
            "excel_path": None
        }


