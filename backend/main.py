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
