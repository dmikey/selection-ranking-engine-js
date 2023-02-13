import { selectComputers } from "./select.js"
import { distributeTasks } from "./distribute.js"
import { calculateElo, calculateNascar } from "./rank.js"

// test
import { computers } from "./data/computers.js"
import { tasks } from "./data/tasks.js"

console.log("Computers: ");
console.table(computers);
console.log("\nTasks: ");
console.table(tasks);

// get eligible computers from a criteria selection
// this selection can include ELOs based on attributes
let eligibleComputers = selectComputers(computers)
  .where({
    cores: { min: 4, max: 8 },
    memory: { min: 8, max: 16 },
    minFreq: { min: 2.5, max: 3.7 },
    maxFreq: { min: 4.2, max: 4.8 },
  })
  .get();

console.log("\nEligible Computers: ");
console.table(eligibleComputers);

// get the distribution of tasks to send out
let distribution = distributeTasks(eligibleComputers, tasks);
console.log("\nTask Distribution:");
console.table(distribution)

let distributed = distribution[0];
let queued = distributed[1];

// what a result set should look like after executing
let results = [
  { taskId: 1, executionTime: 0.0123 },
  { taskId: 2, executionTime: 0.0456 },
  { taskId: 3, executionTime: 0.0689 },
  { taskId: 4, executionTime: 0.0123 },
  { taskId: 5, executionTime: 0.0456 },
  { taskId: 6, executionTime: 0.0689 }
];

console.log("\nTask Results: ");
console.table(results);

let elo = calculateElo(computers, tasks, distributed, results)
let nascar = calculateNascar(elo, tasks, distributed, results)

console.log("\nRankings: ");
console.table(nascar);