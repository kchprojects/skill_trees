import React, { useState, useEffect, useCallback } from 'react';
import FlowGraph from './FlowGraph';
import GoalPanel from './GoalPanel';
import skillTreeData from '../data/skillTreeData';
import { generateNodesAndEdges } from './flowElements'; // Import the function to get nodes and edges

function FlowContainer() {
  const [selectedSkill, setSelectedSkill] = useState(null);  // State for selected node details
  const [goalCompletion, setGoalCompletion] = useState({});  // State for goal completion

  // Initialize goalCompletion using node IDs when skills are loaded
  useEffect(() => {
    const initialGoalCompletion = {};
    
    // Generate nodes and edges (we only need nodes here)
    const { nodes } = generateNodesAndEdges(skillTreeData);

    // Initialize the goal completion for each node by ID
    nodes.forEach((node) => {
      if (node.data.goals && node.data.goals.length > 0) {
        // Initialize all goals to false for this node (using node ID)
        initialGoalCompletion[node.id] = new Array(node.data.goals.length).fill(false);
      }
    });

    setGoalCompletion(initialGoalCompletion);
  }, []);

  // Handle click outside of any node (on the background)
  const handlePaneClick = useCallback(() => {
    setSelectedSkill(null); // Deselect skill and hide info panel
  }, []);

  // Toggle checkbox state for goal completion
  const handleCheckboxChange = useCallback(
    (skillId, goalIndex) => {
      setGoalCompletion((prev) => {
        const skillGoals = prev[skillId] || [];
        const newSkillGoals = [...skillGoals];

        // Toggle the checkbox state for the specific goal
        newSkillGoals[goalIndex] = !newSkillGoals[goalIndex];

        return {
          ...prev,
          [skillId]: newSkillGoals,
        };
      });
    },
    []
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <FlowGraph
        setSelectedSkill={setSelectedSkill}       // Pass setter to update selected skill
        goalCompletion={goalCompletion}           // Pass the goal completion state
        handlePaneClick={handlePaneClick}         // Handle clicks outside nodes
      />
      <GoalPanel
        selectedSkill={selectedSkill}             // Pass the selected skill data
        goalCompletion={goalCompletion}           // Pass the goal completion state
        handleCheckboxChange={handleCheckboxChange} // Handle checkbox changes
      />
    </div>
  );
}

export default FlowContainer;
