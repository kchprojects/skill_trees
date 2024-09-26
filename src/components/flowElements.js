// Generate unique node IDs
let id = 0;
const getId = () => `node_${id++}`;

// Convert skill tree into nodes and edges for React Flow
export const generateNodesAndEdges = (skill, parent = null, level = 0) => {
    const nodes = [];
    const edges = [];

    const nodeId = getId();
    nodes.push({
        id: nodeId,
        data: { label: skill.name, description: skill.description, goals: skill.goals, lesson: skill.lesson, exercises: skill.exercises },
        position: { x: 0, y: 0 }, // Position will be set by Dagre layout
        parent, // Track the parent node
    });

    if (parent) {
        edges.push({
            id: `edge_${parent}-${nodeId}`,
            source: parent,
            target: nodeId,
            type: 'smoothstep',
        });
    }

    if (skill.subskills) {
        skill.subskills.forEach((subskill) => {
            const { nodes: childNodes, edges: childEdges } = generateNodesAndEdges(
                subskill,
                nodeId,
                level + 1
            );
            nodes.push(...childNodes);
            edges.push(...childEdges);
        });
    }

    return { nodes, edges };
};
