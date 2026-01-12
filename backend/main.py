from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from collections import defaultdict, deque

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        # Parse the pipeline data
        pipeline_data = json.loads(pipeline)

        nodes = pipeline_data.get('nodes', [])
        edges = pipeline_data.get('edges', [])

        # Count nodes and edges
        num_nodes = len(nodes)
        num_edges = len(edges)

        # Check if it's a DAG
        is_dag = check_if_dag(nodes, edges)

        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag
        }

    except json.JSONDecodeError:
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False,
            'error': 'Invalid JSON format'
        }
    except Exception as e:
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False,
            'error': str(e)
        }

def check_if_dag(nodes, edges):
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sort algorithm with Kahn's algorithm.
    """
    if not nodes or not edges:
        return True  # Empty graph or no edges is considered a DAG

    # Create adjacency list and indegree map
    adj_list = defaultdict(list)
    indegree = {node['id']: 0 for node in nodes}

    # Build the graph
    for edge in edges:
        source = edge['source']
        target = edge['target']

        # Only add edge if both source and target nodes exist
        if source in indegree and target in indegree:
            adj_list[source].append(target)
            indegree[target] += 1

    # Kahn's algorithm: topological sort using BFS
    queue = deque([node_id for node_id, degree in indegree.items() if degree == 0])
    processed_count = 0

    while queue:
        current = queue.popleft()
        processed_count += 1

        # Reduce indegree of neighbors
        for neighbor in adj_list[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    # If we processed all nodes, it's a DAG
    return processed_count == len(nodes)

@app.post('/pipelines/execute')
def execute_pipeline(pipeline: str = Form(...)): # Accept pipeline as a string
    try:
        data = json.loads(pipeline)
        
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])
        inputs = data.get('inputs', {}) # Dictionary of {node_id: value}

        if not check_if_dag(nodes, edges):
             return {'error': 'Pipeline contains cycles and cannot be executed.'}

        # 1. Build Dependency Graph
        # adj_list: node_id -> [child_node_ids]
        # node_map: node_id -> node_data
        adj_list = defaultdict(list)
        node_map = {node['id']: node for node in nodes}
        incoming_edges = defaultdict(list) # node_id -> [edge_objects]

        for edge in edges:
            source = edge['source']
            target = edge['target']
            adj_list[source].append(target)
            incoming_edges[target].append(edge)

        # 2. Topological Sort (Execution Order)
        # We can reuse the logic, but we need the sorted list this time.
        indegree = {node['id']: 0 for node in nodes}
        for edge in edges:
            indegree[edge['target']] += 1
        
        queue = deque([node_id for node_id, degree in indegree.items() if degree == 0])
        execution_order = []
        
        while queue:
            current = queue.popleft()
            execution_order.append(current)
            
            for neighbor in adj_list[current]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        
        # 3. Execution Engine
        results = {} # node_id -> output_value

        for node_id in execution_order:
            node = node_map[node_id]
            node_type = node.get('type') # e.g., 'customInput', 'textNode', etc.
            
            # Fetch inputs for this node
            node_inputs = {} # handle_id -> value
            for edge in incoming_edges[node_id]:
                # edge['sourceHandle'] gives us which output of the parent was used
                # edge['targetHandle'] gives us which input of the current node it goes to
                
                # Simple logic: Single output from source?
                source_val = results.get(edge['source'])
                
                # In robust systems, we'd map handles strictly. 
                # For this assesssment, we might need to be flexible or check handle IDs.
                handle_id = edge['targetHandle']
                node_inputs[handle_id] = source_val


            # --- NODE LOGIC HANDLERS ---
            
            # Normalize type for checks
            node_type = node_type.lower() if node_type else ''
            
            # --- NODE LOGIC HANDLERS ---
            
            if 'input' in node_type or 'input' in node_id: # Heuristic for Input Node
                # Logic: Return the user-provided input, or default
                # The frontend sends inputs keyed by node ID
                results[node_id] = inputs.get(node_id, "Default Input")
            
            elif 'text' in node_type:
                # Logic: Replace {{variables}}
                # 'currText' is where the template is
                text_template = node['data'].get('currText', '')
                
                # Find all variables in the template
                # Inputs for text node are hooked to handles like "nodeId-var-variableName"
                # We need to map edges to variable names.
                
                final_text = text_template
                for handle_id, val in node_inputs.items():
                    # Handle ID format from textNode.js: `${props.id}-var-${variable}`
                    # Extract variable name
                    if '-var-' in handle_id:
                        var_name = handle_id.split('-var-')[-1]
                        final_text = final_text.replace(f'{{{{{var_name}}}}}', str(val))
                
                results[node_id] = final_text

            elif 'transform' in node_type:
                # Logic: Apply transformation
                # Takes the first available input
                input_val = next(iter(node_inputs.values()), "")
                transform_type = node['data'].get('transformation', 'uppercase')
                
                if isinstance(input_val, str):
                    if transform_type == 'uppercase':
                        results[node_id] = input_val.upper()
                    elif transform_type == 'lowercase':
                        results[node_id] = input_val.lower()
                    else:
                        results[node_id] = input_val # Fallback
                else:
                    results[node_id] = input_val

            elif 'math' in node_type:
                 op = node['data'].get('operation', 'add')
                 
                 # Default operands from state
                 try:
                    val1 = float(node['data'].get('operand1', 0))
                 except:
                    val1 = 0.0
                    
                 try:
                    val2 = float(node['data'].get('operand2', 0))
                 except:
                    val2 = 0.0
                 
                 # Override with connected inputs if they exist
                 # Debug: print(f"Processing Math node {node_id}, inputs: {node_inputs}")
                 for handle, val in node_inputs.items():
                     if not handle: continue
                     
                     # Ensure we are matching the correct handle suffix
                     if handle.endswith('-input1'):
                         try: val1 = float(val)
                         except: pass
                     elif handle.endswith('-input2'):
                         try: val2 = float(val)
                         except: pass
                
                 res = 0
                 if op == 'add': res = val1 + val2
                 elif op == 'subtract': res = val1 - val2
                 elif op == 'multiply': res = val1 * val2
                 elif op == 'divide': res = val1 / val2 if val2 != 0 else 0
                 elif op == 'power': res = pow(val1, val2)
                 
                 results[node_id] = res

            elif 'llm' in node_type:
                # Mock LLM
                results[node_id] = "This is a mock LLM response."

            elif 'output' in node_type:
               # Just pass through the input value
               results[node_id] = next(iter(node_inputs.values()), "No Output")
            
            else:
                 # Default pass-through
                 results[node_id] = next(iter(node_inputs.values()), None)

        return {
            'status': 'success',
            'results': results,
            'num_nodes': len(nodes),
            'num_edges': len(edges),
            'is_dag': True 
        }

    except Exception as e:
        return {'error': str(e)}
