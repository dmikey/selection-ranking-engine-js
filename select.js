export function selectComputers(computers) {
  return {
    where: function(filters) {
      this.filters = filters;
      return this;
    },
    get: function() {
      const filteredComputers = [];
      let currentComputer = computers[Math.floor(Math.random() * computers.length)];
      let temperature = 10;

      for (let i = 0; i < computers.length; i++) {
        const candidateComputer = computers[Math.floor(Math.random() * computers.length)];
        const deltaE =
          getSuitabilityScore(candidateComputer, this.filters) -
          getSuitabilityScore(currentComputer, this.filters);
        const acceptanceProbability = Math.min(
          1,
          Math.exp(-deltaE / temperature)
        );
        if (Math.random() < acceptanceProbability) {
          currentComputer = candidateComputer;
        }
        filteredComputers.push(currentComputer);
        temperature *= 0.99;
      }

      return filteredComputers;
    },
  };
}

function getSuitabilityScore(computer, filters) {
  return Object.entries(filters).reduce((score, [key, filterValue]) => {
    if (typeof filterValue === "boolean") {
      return score + (computer[key] === filterValue ? 1 : 0);
    } else if (typeof filterValue === "object") {
      return score + (compareValues(computer[key], filterValue) ? 1 : 0);
    }
  }, 0);
}

function compareValues(value, filter) {
  const { min, max } = filter;
  return value >= min && value <= max;
}
