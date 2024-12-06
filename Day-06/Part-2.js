const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

const grid = lines.map(l => l.split(''));

const upVec =    { x:  0, y: -1 };
const rightVec = { x:  1, y:  0 };
const downVec =  { x:  0, y:  1 };
const leftVec =  { x: -1, y:  0 };

const vecFromChar = {
  '^': 0,
  '>': 1,
  'v': 2,
  '<': 3,
};

const vecs = [
  upVec,
  rightVec,
  downVec,
  leftVec,
];


const width = grid[0].length;
const height = grid.length;

const startingPos = { x: -1, y: -1 }
let startingVec = 0;
outer: for (let x=0; x<width; x++) {
  inner: for (let y=0; y<height; y++) {
    const curr = grid[y][x];

    if (curr === '#' || curr === '.') {
      continue inner;
    } else {
      grid[y][x] = '.';
      startingPos.y = y;
      startingPos.x = x;
      startingVec = vecFromChar[curr];
    }
  }
}

function walk(grid, _pos, vec, newObstaclePos) {
  const pos = { ..._pos };
  let steps = 0;
  const positions = {};
  outer: while (steps < 25000) {
    const posHash = pos.x + ',' + pos.y;

    if (positions[posHash] === vec) {
      return { steps, positions, loopPos: pos, loopVec: vec };
    }

    positions[posHash] = vec;

    let newPos = {  x: pos.x + vecs[vec].x, y: pos.y + vecs[vec].y };
    while (!grid[newPos.y] || grid[newPos.y][newPos.x] !== '.') {
      if (newPos.x < 0 || newPos.y < 0 || newPos.x >= width || newPos.y >= height) {
        break outer;
      }

      vec = (vec + 1) % 4;
      newPos.x = pos.x + vecs[vec].x;
      newPos.y = pos.y + vecs[vec].y;
    }

    steps++;
    pos.x = newPos.x;
    pos.y = newPos.y;
  }

  return { steps, positions };
}


const { steps, positions } = walk(grid, { ...startingPos }, startingVec);


let newObstacles = 0;
for (let x=0; x<width; x++) {
  inner: for (let y=0; y<width; y++) {
    if (x === startingPos.x && y === startingPos.y) {
      continue inner;
    }
    if (grid[y][x] === '#') {
      continue inner;
    }

    const _grid = JSON.parse(JSON.stringify(grid));
    _grid[y][x] = '#';
    const { loopPos, steps } = walk(_grid, { ...startingPos }, startingVec);
    if (loopPos) {
      newObstacles++;
    }
  }
}

console.log({ newObstacles });
