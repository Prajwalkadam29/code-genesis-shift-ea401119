
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your OpenAI API key
# In production, use environment variables
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

def initialize_langchain():
    """Initialize the LangChain components."""
    return OpenAI(temperature=0.2)

def generate_conversion_prompt(source_language, target_language):
    """Generate a prompt template for code conversion."""
    template = """
    You are an expert programmer with deep knowledge of multiple programming languages.
    
    Convert the following {source_language} code to {target_language} while preserving 
    functionality, comments, and coding best practices:
    
    ```{source_language}
    {source_code}
    ```
    
    Return ONLY the converted {target_language} code without explanations, starting your response with ```{target_language} and ending with ```.
    """
    
    return PromptTemplate(
        input_variables=["source_code", "source_language", "target_language"],
        template=template,
    )

def parse_ast(code, language):
    """
    Simple parsing to create a basic Abstract Syntax Tree (AST) structure.
    
    In a production environment, you would use proper parsers like:
    - Python: ast module
    - JavaScript: acorn, esprima
    - TypeScript: typescript compiler API
    - etc.
    
    This is a simplified version for demonstration.
    """
    nodes = []
    edges = []
    
    # Create root node
    nodes.append({
        "id": "n0",
        "type": "Program",
        "value": "Program",
        "children": []
    })
    
    node_index = 1
    current_scope = "n0"
    scopes = ["n0"]
    
    lines = code.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line or (language in ["javascript", "typescript"] and line.startswith('//')):
            continue
        
        if language in ["javascript", "typescript"]:
            # Function detection
            if re.search(r'function\s+\w+|const\s+\w+\s*=\s*\(.*\)\s*=>|\w+\s*\(\s*\)\s*\{', line):
                node_id = f"n{node_index}"
                nodes.append({
                    "id": node_id,
                    "type": "Function",
                    "value": line,
                    "children": []
                })
                
                edges.append({
                    "source": current_scope,
                    "target": node_id,
                    "type": "child"
                })
                
                parent = next((n for n in nodes if n["id"] == current_scope), None)
                if parent:
                    parent["children"].append(node_id)
                
                current_scope = node_id
                scopes.append(node_id)
                node_index += 1
                
            # Closing brace detection
            elif line == "}" and len(scopes) > 1:
                scopes.pop()
                current_scope = scopes[-1]
                
            # Variable declarations
            elif any(keyword in line for keyword in ["var ", "let ", "const "]):
                node_id = f"n{node_index}"
                nodes.append({
                    "id": node_id,
                    "type": "Variable",
                    "value": line,
                    "children": []
                })
                
                edges.append({
                    "source": current_scope,
                    "target": node_id,
                    "type": "child"
                })
                
                parent = next((n for n in nodes if n["id"] == current_scope), None)
                if parent:
                    parent["children"].append(node_id)
                    
                node_index += 1
                
        elif language == "python":
            # Function detection
            if line.startswith("def "):
                node_id = f"n{node_index}"
                nodes.append({
                    "id": node_id,
                    "type": "Function",
                    "value": line,
                    "children": []
                })
                
                edges.append({
                    "source": current_scope,
                    "target": node_id,
                    "type": "child"
                })
                
                parent = next((n for n in nodes if n["id"] == current_scope), None)
                if parent:
                    parent["children"].append(node_id)
                
                current_scope = node_id
                scopes.append(node_id)
                node_index += 1
                
            # Class detection
            elif line.startswith("class "):
                node_id = f"n{node_index}"
                nodes.append({
                    "id": node_id,
                    "type": "Class",
                    "value": line,
                    "children": []
                })
                
                edges.append({
                    "source": current_scope,
                    "target": node_id,
                    "type": "child"
                })
                
                parent = next((n for n in nodes if n["id"] == current_scope), None)
                if parent:
                    parent["children"].append(node_id)
                
                current_scope = node_id
                scopes.append(node_id)
                node_index += 1
    
    return {"nodes": nodes, "edges": edges}

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json
    source_code = data.get('sourceCode')
    source_language = data.get('sourceLanguage')
    target_language = data.get('targetLanguage')
    
    if not all([source_code, source_language, target_language]):
        return jsonify({
            'status': 'error',
            'message': 'Missing required parameters'
        }), 400
    
    try:
        start_time = time.time()
        
        # Initialize LangChain
        llm = initialize_langchain()
        
        # Generate prompt
        prompt = generate_conversion_prompt(source_language, target_language)
        
        # Create chain
        chain = LLMChain(llm=llm, prompt=prompt)
        
        # Execute chain
        result = chain.run(
            source_code=source_code,
            source_language=source_language,
            target_language=target_language
        )
        
        # Clean up the result
        code_pattern = re.compile(r'```.*?\n(.*?)```', re.DOTALL)
        match = code_pattern.search(result)
        if match:
            converted_code = match.group(1).strip()
        else:
            converted_code = result.strip()
        
        # Generate graph data for visualization
        graph_data = parse_ast(source_code, source_language)
        
        execution_time = time.time() - start_time
        
        return jsonify({
            'status': 'success',
            'originalCode': source_code,
            'transformedCode': converted_code,
            'graphData': graph_data,
            'executionTime': execution_time,
            'sourceLanguage': source_language,
            'targetLanguage': target_language
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
