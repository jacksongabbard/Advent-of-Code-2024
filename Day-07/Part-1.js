const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

console.log(lines);


function findOperations(outcome, parts, runningTotal, runningOperations) {

  const rest = parts.slice(1);

  const forkA = [...runningOperations, '+', parts[0]];
  const a = runningTotal + parts[0];

  if (a === outcome) {
    return forkA;
  } else if (a < outcome && rest.length) {
    const ops = findOperations(outcome, rest, a, forkA);
    if (ops) {
      return ops;
    }
  }

  const forkB = [...runningOperations, '*', parts[0]];
  const b = runningTotal * parts[0];

  if (b === outcome) {
    return forkB;
  } else if (b < outcome && rest.length) {
    const ops = findOperations(outcome, rest, b, forkB);
    if (ops) {
      return ops;
    }
  }

  return undefined;
}


let sum = 0;
for (const line of lines) {

  let [outcome, ...parts] = line.split(/:?\s/).map(s => parseInt(s, 10));

  console.log(outcome, parts);

  const outcomeOps = findOperations(outcome, parts.slice(1), parts[0], [parts[0]]);
  if (outcomeOps) {
    console.log('>',
      [outcome, '===',  ...outcomeOps].join(' '),
    );
    sum += outcome;
  }
}

console.log('Sum: ' + sum);

