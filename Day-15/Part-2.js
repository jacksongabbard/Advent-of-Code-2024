const fs = require('fs');

function makeGridFromInput(input) {
  const lines = input.split('\n');
  const grid = [];
  let idx = 0;
  let curr = lines[idx];
  while (curr.startsWith('#')) {
    const row = [];
    const bits = curr.split('');
    for (let bit of bits) {
      if (bit === 'O') {
        row.push('[');
        row.push(']');
      } else if (bit === '@') {
        row.push('@');
        row.push('.');
      } else if (bit === '.') {
        row.push('.');
        row.push('.');
      } else if (bit === '#') {
        row.push('#');
        row.push('#');
      }
    }

    grid.push(row);
    idx++;
    curr = lines[idx];
  }

  idx++; // skip the empty line

  let instructions = [];
  for (idx; idx < lines.length; idx++) {
    instructions = [...instructions, ...lines[idx].split('')];
  }
  return { grid, instructions };
}



function print(grid) {
  let out = '';
  for (let row of grid) {
    out += row.join('') + '\n';
  }
  console.log(out);
}

function botPos(grid) {
  for (let y=1; y<grid.length - 1; y++) {
    for (let x=1; x<grid[0].length - 1; x++) {
      if (grid[y][x] === '@') {
        return { x, y };
      }
    }
  }
}

// Assuming we're starting on the bot's position, which ought
// to be filled with the bot
function canMove(grid, x, y, vec) {
  const testX = x + vec.x;
  const testY = y + vec.y;
  if (testX < 0 || testX > grid[0].length - 1) {
    return false;
  }

  if (testY < 0 || testY > grid.length - 1) {
    return false;
  }

  const currThing = grid[y][x];
  const foundThing = grid[testY][testX];
  if (foundThing === '#') {
    return false;
  } else if (foundThing === '[')  {
    if (vec.y && currThing !== '[') {
      return (
        canMove(grid, testX, testY, vec) &&
        canMove(grid, testX + 1, testY, vec)
      );
    }

    return canMove(grid, testX, testY, vec);
  } else if (foundThing === ']')  {
    if (vec.y && currThing !== ']') {
      return (
        canMove(grid, testX, testY, vec) &&
        canMove(grid, testX - 1, testY, vec)
      );
    }

    return canMove(grid, testX, testY, vec);

  } else if (foundThing === '.') {
    return true;
  }
  throw new Error('Unexpected thing in the grid: ' + foundThing);
}

function shiftPositions(grid, pos, vec) {
  const startVal = grid[pos.y][pos.x];
  const dest = { x: pos.x + vec.x, y: pos.y + vec.y };
  const destVal = grid[dest.y][dest.x];
  if (destVal !== '.') {
    if (vec.y) {
      // We've got a ] box edge hanging off to the right
      if (destVal === '[' && startVal !== '[') {
        shiftPositions(grid, { x: 1 + dest.x, y: dest.y }, vec);
      } else if (destVal === ']' && startVal !== ']') {
        // In this case, it's a [ box edge hanging off the left
        shiftPositions(grid, { x: -1 + dest.x, y: dest.y }, vec);
      }
    }

    shiftPositions(grid, dest, vec);
  }

  grid[dest.y][dest.x] = grid[pos.y][pos.x];
  grid[pos.y][pos.x] = '.';
}


const dirs = {
  '^': { x:  0, y: -1 },
  '>': { x:  1, y:  0 },
  'v': { x:  0, y:  1 },
  '<': { x: -1, y:  0 },
};

function move(grid, instruction) {
  const pos = botPos(grid);
  const can = canMove(grid, pos.x, pos.y, dirs[instruction]);
  if (!can) {
    console.log('cannot move ', pos);
    return;
  }

  shiftPositions(grid, pos, dirs[instruction]);
}

function sum(grid) {
  let runningTotal = 0;
  for (let y=1; y<grid.length - 1; y++) {
    for (let x=1; x<grid[0].length - 1; x++) {
      if (grid[y][x] === '[') {
        runningTotal += y * 100 + x;
      }
    }
  }
  return runningTotal;
}

function main() {

  const input = fs.readFileSync('./input.txt').toString('utf-8');
  const { grid, instructions } = makeGridFromInput(input);
  print(grid);

  for (let i=0; i<instructions.length; i++) {
    console.log('Step ' + i, instructions[i], dirs[instructions[i]]);
    move(grid, instructions[i]);
    // print(grid);
  }
  console.log(sum(grid));
}

main();
