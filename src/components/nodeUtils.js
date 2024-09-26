// Recursive function to get all descendants of a node
export const getAllDescendants = (nodeId, nodes) => {
    const descendants = [];
    nodes.forEach((node) => {
      if (node.parent === nodeId) {
        descendants.push(node.id);
        descendants.push(...getAllDescendants(node.id, nodes)); // Recursively get descendants
      }
    });
    return descendants;
  };
  