const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

// console.log(lines);


function findOperations(outcome, parts, runningTotal, runningOperations) {

  if (parts.length === 0) {
    if (runningTotal === outcome) {
      return runningOperations;
    }

    return undefined;
  }

  const rest = parts.slice(1);

  const forkA = [...runningOperations, '+', parts[0]];

  const a = runningTotal + parts[0];

  if (a <= outcome) {
    const ops = findOperations(outcome, rest, a, forkA);
    if (ops) {
      return ops;
    }
  }

  const forkB = [...runningOperations, '*', parts[0]];
  const b = runningTotal * parts[0];

  if (b <= outcome) {
    const ops = findOperations(outcome, rest, b, forkB);
    if (ops) {
      return ops;
    }
  }

  const forkC = [...runningOperations, '||', parts[0]];
  const c = parseInt(runningTotal.toString() +  parts[0].toString(), 10);

  if (c <= outcome) {
    const ops = findOperations(outcome, rest, c, forkC);
    if (ops) {
      return ops;
    }
  }


  return undefined;
}


let sum = 0;
for (const line of lines) {
  let [outcome, ...parts] = line.split(/:?\s/).map(s => parseInt(s, 10));
  const ops = findOperations(outcome, parts.slice(1), parts[0], [parts[0]]);
  if (ops) {
    sum += outcome;
  } else {
    console.log(outcome + ': ' +  parts.join(' '));
  }
}
console.log('Sum: ' + sum);

