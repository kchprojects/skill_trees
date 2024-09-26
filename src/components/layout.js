import dagre from 'dagre';

// Node width and height for layout
const nodeWidth = 200;
const nodeHeight = 60;

// Initialize the Dagre graph layout

// Function to apply Dagre layout to nodes and edges
export const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    // Set direction to TB (Top-to-Bottom) for normal tree layout
    const isHorizontal = false; // Set to true for horizontal layout
    dagreGraph.setGraph({ rankdir: isHorizontal ? 'LR' : 'TB' }); // Change BT to TB for top-to-bottom

    // Add nodes to Dagre graph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    // Add edges to Dagre graph
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Apply Dagre layout
    dagre.layout(dagreGraph);

    // Set the positions of the nodes based on the layout
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    // Revert edges for normal parent-child connections (from bottom of parent to top of child)
    const updatedEdges = edges.map((edge) => ({
        ...edge,
        type: 'smoothstep', // Use smoothstep edge for better curve control
        sourceHandle: 'bottom', // Connect from the bottom of the parent node
        targetHandle: 'top', // Connect to the top of the child node
    }));

    return { nodes, edges: updatedEdges };
};
