const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');
const lines = input.split('\n');

const grid = [];
let idx = 0;
let curr = lines[idx];
while (curr.startsWith('#')) {
  grid.push(curr.split(''));
  idx++;
  curr = lines[idx];
}

idx++; // skip the empty line

let instructions = [];
for (idx; idx < lines.length; idx++) {
  instructions = [...instructions, ...lines[idx].split('')];
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
function findEmpty(grid, pos, vec) {
  let testPos = { ...pos };
  while (
    testPos.x >= 1 &&
    testPos.y >= 1 &&
    testPos.x <= grid[0].length - 2 &&
    testPos.y <= grid.length - 2
  ) {
    testPos.x += vec.x;
    testPos.y += vec.y;
    console.log(
      'at ', pos,
    );
    if (grid[testPos.y][testPos.x] === '#') {
      console.log('hit a wall', testPos);
      return;
    }
    if (grid[testPos.y][testPos.x] === '.') {
      console.log(
      'found', testPos, grid[testPos.y][testPos.x]);
      return testPos;
    }
  }
  console.log('cant go anywhere');
}

function shiftPositions(grid, pos, dest, vec) {
  // Reverse the direction of the vector to work back to the starting
  // point.
  let b = { ...dest };
  let a = { ...dest };
  while (true) {
    a.x -= vec.x;
    a.y -= vec.y;

    console.log(
      'copying ' + grid[a.y][a.x], curr, ' onto ',
      grid[b.y][b.x], dest
    );
    grid[b.y][b.x] = grid[a.y][a.x];
    if (a.x === pos.x && a.y === pos.y) {
      break;
    }
    b.x = a.x;
    b.y = a.y;
  }
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
  const firstEmptySpace = findEmpty(grid, pos, dirs[instruction]);
  if (!firstEmptySpace) {
    return;
  }
  shiftPositions(grid, pos, firstEmptySpace, dirs[instruction]);
}

function sum(grid) {
  let runningTotal = 0;
  for (let y=1; y<grid.length - 1; y++) {
    for (let x=1; x<grid[0].length - 1; x++) {
      if (grid[y][x] === 'O') {
        runningTotal += y * 100 + x;
      }
    }
  }
  return runningTotal;
}

// print(grid);
for (let i=0; i<instructions.length; i++) {
  console.log('Step ' + i, instructions[i]);
  move(grid, instructions[i]);
  // print(grid);
}

console.log(sum(grid));


