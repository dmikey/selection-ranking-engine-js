export function calculateNascar(computers, tasks, distribution, results) {
  // Create a map of task IDs to tasks
  const taskIdToTask = tasks.reduce((map, task) => {
    // For each task, add an entry to the map with the task ID as the key and the task object as the value
    map[task.taskId] = task;
    // Return the updated map
    return map;
  }, {});

  // Create a map of computer names to their results
  const computerToResults = results.reduce((map, result) => {
    // Get the task associated with the result
    const task = taskIdToTask[result.taskId];
    // If the task does not exist, return the map as-is
    if (!task) {
      return map;
    }
    // Get the computer that was assigned the task
    const computer = Object.keys(distribution).find((key) => {
      // Find the task in the list of tasks assigned to the computer
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
    // If the computer was not found, return the map as-is
    if (!computer) {
      return map;
    }
    // If this is the first result for the computer, create an array for the results
    if (!map[computer]) {
      map[computer] = [];
    }
    // Add the result to the array of results for the computer
    map[computer].push(result);
    // Return the updated map
    return map;
  }, {});

  // Create an array of objects, each representing a computer and its results
  const computersWithResults = Object.keys(computerToResults).map((key) => ({
    name: key,
    results: computerToResults[key],
  }));

  // Sort the computers based on their average execution time
  computersWithResults.sort((a, b) => {
    // Calculate the average execution time for each computer
    const aAvg =
      a.results.reduce((acc, result) => acc + result.executionTime, 0) /
      a.results.length;
    const bAvg =
      b.results.reduce((acc, result) => acc + result.executionTime, 0) /
      b.results.length;
    // Compare the average execution times
    return aAvg - bAvg;
  });

  // Get the total number of computers with results
  const totalComputers = computersWithResults.length;
  // Set the top score to 1
  const topScore = 1;

  // Update the NASCAR ranking for each computer
  return computers.map((computer) => {
    // Find the computer in the list of computers with results
    const computerWithResults = computersWithResults.find(
      (c) => c.name === computer.name
    );
    let updatedNascar = {};
    // If the computer does not have any results
    if (!computerWithResults) {
      // Check to see if results were in the distribution.
      const distributed = distribution[computer.name];
      if (distributed) {
        if (!computer.nascar) {
          computer.nascar = {};
        }
        updatedNascar = {
          ...computer.nascar,
          rank: computer.nascar.rank
            ? computer.nascar.rank - topScore / totalComputers
            : 0,
        };
      } else {
        updatedNascar = computer.nascar || {};
      }
    } else {
      updatedNascar = {
        rank:
          topScore -
          (topScore / totalComputers) *
            computersWithResults.indexOf(computerWithResults),
      };
    }

    updatedNascar.rank = isNaN(updatedNascar.rank) ? 0 : updatedNascar.rank;
    return {
      ...computer,
      nascar: updatedNascar,
    };
  });
}
