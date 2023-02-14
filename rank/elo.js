export function calculateElo(computers, tasks, distribution, results) {
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

  return computers.map((computer) => {
    const results = computerToResults[computer.name];
    if (!results || results.length === 0) {
      // Check to see if results were in the distribution.
      const distributed = distribution[computer.name];
      if (distributed) {
        let updatedElo = Object.keys(computer.elo).reduce((acc, key) => {
          acc[key] = computer.elo[key] - 0.1;
          acc[key] = isNaN(acc[key]) ? 0 : acc[key];
          return acc;
        }, {});

        return {
          ...computer,
          elo: updatedElo,
        };
      }
      return computer;
    }

    const averageResult = results.reduce(
      (acc, result) => {
        acc.executionTime += result.executionTime;
        return acc;
      },
      { executionTime: 0 }
    );

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
