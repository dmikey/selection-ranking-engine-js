export function calculateNascar(computers, tasks, distribution, results) {
  const taskIdToTask = tasks.reduce((map, task) => {
    map[task.taskId] = task;
    return map;
  }, {});

  const computerToResults = results.reduce((map, result) => {
    const task = taskIdToTask[result.taskId];
    if (!task) {
      return map;
    }
    const computer = Object.keys(distribution).find((key) => {
      const match = Object.values(distribution[key]).find(
        (distributedTask) => distributedTask.taskId === task.taskId
      );

      if (match) {
        return true;
      }
      return false;
    });

    if (!computer) {
      return map;
    }
    if (!map[computer]) {
      map[computer] = [];
    }
    map[computer].push(result);
    return map;
  }, {});

  const computersWithResults = Object.keys(computerToResults).map((key) => ({
    name: key,
    results: computerToResults[key],
  }));

  computersWithResults.sort((a, b) => {
    const aAvg =
      a.results.reduce((acc, result) => acc + result.executionTime, 0) /
      a.results.length;
    const bAvg =
      b.results.reduce((acc, result) => acc + result.executionTime, 0) /
      b.results.length;
    return aAvg - bAvg;
  });

  return computers.map((computer) => {
    const computerWithResults = computersWithResults.find(
      (c) => c.name === computer.name
    );
    let updatedNascar = {};
    if (!computerWithResults) {
      // Check to see if results were in the distribution.
      const distributed = distribution[computer.name];
      if (distributed) {
        if (!computer.nascar) {
          computer.nascar = {};
        }
        updatedNascar = {
          ...computer.nascar,
          finish: (computer.nascar.finish || 0) - 5,
        };
      } else {
        updatedNascar = computer.nascar || {};
      }
    } else {
      updatedNascar = {
        finish: computersWithResults.indexOf(computerWithResults) + 1,
      };
    }

    updatedNascar.finish = isNaN(updatedNascar.finish)
      ? 0
      : updatedNascar.finish;
    return {
      ...computer,
      nascar: updatedNascar,
    };
  });
}
