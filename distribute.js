// function that implements a greco-latin square distribution to distribute tasks evenly across 
// all computers, keeping track of the reserved resources for each round and returning any tasks 
// that are not compatible as part of a tuple [result, queued]:
export function distributeTasks(computers, tasks) {
  const result = {};
  const queued = [];
  for (const computer of computers) {
    result[computer.name] = [];
  }
  const n = computers.length;

  // create a matrix to store the distribution of tasks
  const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => []));

  // fill the matrix with tasks
  let currentRow = 0;
  for (const task of tasks) {
    let isCompatible = true;
    for (const [attribute, value] of Object.entries(task)) {
      if (attribute === 'taskId') continue;
      if (computers[currentRow][attribute] < value) {
        isCompatible = false;
        break;
      }
    }
    if (isCompatible) {
      matrix[currentRow][currentRow % n].push(task);
    } else {
      queued.push(task);
    }
    currentRow = (currentRow + 1) % n;
  }

  // flatten the matrix into a result object
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[computers[i].name].push(...matrix[j][i % n]);
    }
  }
  return [result, queued];
}
