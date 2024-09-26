import React from 'react';

function GoalPanel({ selectedSkill, goalCompletion, handleCheckboxChange }) {
    // Check if a goal is completed
    const isGoalCompleted = (skillId, goalIndex) => {
        return goalCompletion[skillId]?.[goalIndex] || false;
    };

    if (!selectedSkill) return null; // If no skill is selected, don't render the panel

    return (
        <div style={{ width: '30%', padding: '10px', borderLeft: '1px solid #ddd', overflowY: 'auto', background:'#333333', color:'#f0f0f0'}}>
            <h3>Skill Description</h3>
            <p>{selectedSkill?.description || 'Click a skill to see its description.'}</p>
            <h4> Lesson </h4>
            {
                selectedSkill?.lesson?
                    (<p>{selectedSkill.lesson}</p>)
                    : "No lesson available"
            }
            <h4>Exercises</h4>
            {selectedSkill?.exercises?.length > 0 ? (
                <ul>
                    {selectedSkill.exercises.map((exercise, index) => (
                        <li key={index}>
                            <label>
                                {exercise}
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No exercises available for this skill.</p>
            )}

            <h4>Measurable Goals</h4>
            {selectedSkill?.goals?.length > 0 ? (
                <ul>
                    {selectedSkill.goals.map((goal, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isGoalCompleted(selectedSkill.id, index)}  // Check if the goal is completed
                                    onChange={() => handleCheckboxChange(selectedSkill.id, index)}  // Toggle checkbox
                                />
                                {goal}
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No measurable goals available for this skill.</p>
            )}
        </div>
    );
}

export default GoalPanel;
