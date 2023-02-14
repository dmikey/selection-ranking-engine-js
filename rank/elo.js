export function calculateElo(computers, tasks, distribution, results) {
  // Create an object mapping task IDs to task objects
  const taskIdToTask = tasks.reduce((map, task) => {
    map[task.taskId] = task;
    return map;
  }, {});

  // Create an object mapping computer names to arrays of results for that computer
  const computerToResults = results.reduce((map, result) => {
    // Find the task associated with this result
    const task = taskIdToTask[result.taskId];
    // If there is no task associated with this result, return the map as is
    if (!task) {
      return map;
    }
    // Find the computer that was assigned this task
    const computer = Object.keys(distribution).find((key) => {
      const match = Object.values(distribution[key]).find(
        (distributedTask) => distributedTask.taskId === task.taskId
      );
      // If a match is found, return true
      if (match) {
        return true;
      }
      // Otherwise, return false
      return false;
    });
    // If there is no computer assigned to this task, return the map as is
    if (!computer) {
      return map;
    }
    // If this is the first result for this computer, create an array for it
    if (!map[computer]) {
      map[computer] = [];
    }
    // Add this result to the array for this computer
    map[computer].push(result);
    // Return the updated map
    return map;
  }, {});

  // For each computer, calculate its updated ELO score
  return computers.map((computer) => {
    // Find the results for this computer
    const results = computerToResults[computer.name];
    // If there are no results for this computer
    if (!results || results.length === 0) {
      // Check to see if this computer was assigned any tasks
      const distributed = distribution[computer.name];
      if (distributed) {
        // If this computer was assigned tasks but there are no results, decrease its ELO score
        let updatedElo = Object.keys(computer.elo).reduce((acc, key) => {
          acc[key] = computer.elo[key] - 0.1;
          acc[key] = isNaN(acc[key]) ? 0 : acc[key];
          return acc;
        }, {});
        // Return the computer with the updated ELo score
        return {
          ...computer,
          elo: updatedElo,
        };
      }
      // If this computer was not assigned any tasks, return it as is
      return computer;
    }
    // If there are results for this computer, calculate its average execution time
    const averageResult = results.reduce(
      (acc, result) => {
        acc.executionTime += result.executionTime;
        return acc;
      },
      { executionTime: 0 }
    );
    // Update the ELO score for this computer based on its average execution time
    let updatedElo = {
      execution:
        computer.elo.execution + averageResult.executionTime / results.length,
    };

    updatedElo.execution = isNaN(updatedElo.execution)
      ? 0
      : updatedElo.execution;
    return {
      ...computer,
      elo: updatedElo,
    };
  });
}
