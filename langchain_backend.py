
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
import re
import ast
import json

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

class AstNodeVisitor(ast.NodeVisitor):
    """Visit AST nodes and generate a structured representation."""
    
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.node_index = 0
        self.parent_stack = ["n0"]  # Start with root node
        
        # Create root node
        self.nodes.append({
            "id": "n0",
            "type": "Program",
            "value": "Program",
            "children": []
        })
    
    def generic_visit(self, node):
        """Default visitor method for all node types."""
        node_id = f"n{self.node_index + 1}"
        node_type = node.__class__.__name__
        node_value = self._get_node_value(node)
        
        # Add node to the list
        self.nodes.append({
            "id": node_id,
            "type": node_type,
            "value": node_value,
            "children": []
        })
        
        # Add edge from parent to this node
        parent_id = self.parent_stack[-1]
        self.edges.append({
            "source": parent_id,
            "target": node_id,
            "type": "child"
        })
        
        # Add node to parent's children
        parent = next((n for n in self.nodes if n["id"] == parent_id), None)
        if parent:
            parent["children"].append(node_id)
        
        # Increment node index
        self.node_index += 1
        
        # Push this node as new parent
        self.parent_stack.append(node_id)
        
        # Visit children
        super().generic_visit(node)
        
        # Pop parent stack after visiting children
        self.parent_stack.pop()
    
    def _get_node_value(self, node):
        """Extract a meaningful value from the node based on its type."""
        if isinstance(node, ast.FunctionDef):
            return f"def {node.name}(...)"
        elif isinstance(node, ast.ClassDef):
            return f"class {node.name}(...)"
        elif isinstance(node, ast.Assign):
            targets = []
            for target in node.targets:
                if isinstance(target, ast.Name):
                    targets.append(target.id)
                else:
                    targets.append("...")
            return f"{', '.join(targets)} = ..."
        elif isinstance(node, ast.Import):
            names = [name.name for name in node.names]
            return f"import {', '.join(names)}"
        elif isinstance(node, ast.ImportFrom):
            return f"from {node.module or '.'} import ..."
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                return f"{node.func.id}(...)"
            elif isinstance(node.func, ast.Attribute):
                return f"...{node.func.attr}(...)"
            return "call(...)"
        elif isinstance(node, ast.Return):
            return "return ..."
        elif isinstance(node, ast.If):
            return "if ...:"
        elif isinstance(node, ast.For):
            return "for ...:"
        elif isinstance(node, ast.While):
            return "while ...:"
        elif isinstance(node, ast.Try):
            return "try:"
        elif isinstance(node, ast.ExceptHandler):
            return "except:"
        else:
            return node.__class__.__name__
    
    def get_result(self):
        """Return the nodes and edges."""
        return {"nodes": self.nodes, "edges": self.edges}

def parse_python_ast(code):
    """Parse Python code to generate an AST representation."""
    try:
        tree = ast.parse(code)
        visitor = AstNodeVisitor()
        visitor.visit(tree)
        return visitor.get_result()
    except SyntaxError as e:
        print(f"Python parsing error: {e}")
        # Fall back to simple parsing if the code has syntax errors
        return parse_ast(code, "python")

def parse_ast(code, language):
    """
    Simple parsing to create a basic Abstract Syntax Tree (AST) structure.
    Used as a fallback and for non-Python languages.
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
        
        # Generate graph data for visualization using the appropriate parser
        if source_language == "python":
            graph_data = parse_python_ast(source_code)
        else:
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
