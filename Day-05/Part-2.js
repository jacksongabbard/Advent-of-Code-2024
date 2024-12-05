const fs = require('fs');

// const input = fs.readFileSync('./part-1-test-input.txt').toString('utf-8');
const input = fs.readFileSync('./input.txt').toString('utf-8');


const lines = input.split('\n').filter(Boolean);


const rules = [];
while (lines[0].includes('|')) {
  const line = lines.shift();
  const [x, y] = line.split('|');
  rules.push({ x: parseInt(x, 10), y: parseInt(y, 10) });
}

function check(update, rules) {

  const hash = {};
  for (let i=0; i<update.length; i++) {
    hash[update[i]] = i;
  }

  for (let r of rules) {
    if (hash[r.x] >= hash[r.y]) {
      throw new Error('Failed on case: ', r, update);
    }
  }
}

function orderRules(update, rules) {
  const hash = {};

  for (let num of update) {
    hash[num] = 0;
  }

  for (let r of rules) {
    hash[r.y]++;
  }

  const sortedUpdate = [...update];
  sortedUpdate.sort((a, b) => hash[a] - hash[b]);

  check(sortedUpdate, rules);

  if (update.join(',') !== sortedUpdate.join(',')) {
    const mid = sortedUpdate.length / 2;
    if (mid % 1 === 0) {
      throw new Error('Non-odd length?');
    }
    return sortedUpdate[Math.floor(mid)];
  }
  return 0;
}


let sum = 0;
for (const line of lines) {
  if (line.startsWith('#')) {
    continue;
  }
  const update = line.split(',').map(s => parseInt(s, 10));
  const nums = new Set(update);
  const rulesFiltered = rules.filter(r => nums.has(r.x) && nums.has(r.y));
  sum += orderRules(update, rulesFiltered);
}


console.log({ sum });


