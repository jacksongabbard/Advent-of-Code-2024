const fs = require('fs');

function ways(towels, design, memo) {

  if (memo[design] !== undefined) {
    return memo[design];
  }

  let count = 0;
  for (let towel of towels) {
    if (towel === design) {
      count+= 1;
    } else if (design.startsWith(towel)) {
      let rest = design.substring(towel.length);
      count += ways(towels, rest, memo);
    }
  }


  console.log({ design, count });
  memo[design] = count;
  return count;
}


function run(file) {
  const input = fs.readFileSync(file).toString('utf-8');
  const lines = input.split('\n').filter(Boolean);

  const towels = lines.shift().split(',').map(s => s.trim());
  const designs = lines;

  console.log({ towels, designs });
  let possibleCount = 0;
  let memo = {};
  for (let design of designs) {
    possibleCount += ways(towels, design, memo);
  }

  console.log(possibleCount);
}

//run('./test-input.txt');
run('./input.txt');
