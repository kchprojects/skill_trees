import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { getLayoutedElements } from './layout';
import { generateNodesAndEdges } from './flowElements';
import { getAllDescendants } from './nodeUtils';
import skillTreeData from '../data/skillTreeData';

function FlowGraph({ setSelectedSkill, goalCompletion, handlePaneClick }) {
  // Generate nodes and edges from skill tree data
  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(skillTreeData);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [hiddenSubtrees, setHiddenSubtrees] = useState({});

  // Handle single-click event to show description and goals
  const handleNodeClick = useCallback(
    (event, node) => {
      const selectedNode = nodes.find((n) => n.id === node.id);
      if (selectedNode) {
        setSelectedSkill({
          id: node.id,
          description: selectedNode?.data?.description || "No description available.",
          goals: selectedNode?.data?.goals || [],
          exercises: selectedNode?.data?.exercises || [],
          lesson: selectedNode?.data?.lesson || null,
        });
      }
    },
    [nodes, setSelectedSkill]
  );

  // Handle double-click event to toggle subtree visibility
  const handleNodeDoubleClick = useCallback(
    (event, node) => {
      setHiddenSubtrees((prev) => {
        const newHiddenSubtrees = { ...prev };
        if (newHiddenSubtrees[node.id]) {
          delete newHiddenSubtrees[node.id]; // Show subtree if hidden
        } else {
          const allDescendants = getAllDescendants(node.id, nodes);
          newHiddenSubtrees[node.id] = allDescendants; // Hide all descendants
        }
        return newHiddenSubtrees;
      });
    },
    [nodes]
  );

  // Check if all goals for a skill are completed
  const areAllGoalsCompleted = (skillId, goals) => {
    const skillGoals = goalCompletion[skillId] || [];
    // Check if all goals are true, and the length matches
    return goals.length > 0 && skillGoals.length === goals.length && skillGoals.every(Boolean);
  };

  // Update the node styles based on goal completion
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const skillGoals = node.data?.goals || [];
        const allGoalsCompleted = areAllGoalsCompleted(node.id, skillGoals);

        return {
          ...node,
          style: {
            ...node.style,
            backgroundColor: allGoalsCompleted ? 'green' : 'white', // Turn the node green if all goals are completed
            color: allGoalsCompleted ? 'white' : 'black', // Change the text color to white for better visibility
          },
        };
      })
    );
  }, [goalCompletion]); // Rerun whenever goalCompletion changes

  // Filter nodes and edges based on hidden subtrees
  const getVisibleNodesAndEdges = useCallback(() => {
    const visibleNodes = [];
    const visibleEdges = [];

    const hiddenNodeIds = new Set();

    nodes.forEach((node) => {
      const parentHidden = Object.keys(hiddenSubtrees).some((hiddenNodeId) =>
        hiddenSubtrees[hiddenNodeId].includes(node.id)
      );
      if (parentHidden) {
        hiddenNodeIds.add(node.id); // Hide all descendants
      } else {
        visibleNodes.push(node); // Show node
      }
    });

    edges.forEach((edge) => {
      if (!hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target)) {
        visibleEdges.push(edge); // Show edge if both nodes are visible
      }
    });

    return { visibleNodes, visibleEdges };
  }, [nodes, edges, hiddenSubtrees]);

  // Get visible nodes and edges, then layout them using Dagre
  const { visibleNodes, visibleEdges } = getVisibleNodesAndEdges();
  const layoutedElements = getLayoutedElements(visibleNodes, visibleEdges); // Recalculate layout

  return (
    <div style={{ width: '100%' }}>
      <ReactFlow
        nodes={layoutedElements.nodes}
        edges={layoutedElements.edges}
        fitView
        onNodeClick={handleNodeClick}          // Handle single-click event
        onNodeDoubleClick={handleNodeDoubleClick} // Handle double-click event
        onPaneClick={handlePaneClick}          // Handle click on background to hide info
        style={{ backgroundColor: '#f0f0f0', height: '100%' }}
      />
    </div>
  );
}

export default FlowGraph;
