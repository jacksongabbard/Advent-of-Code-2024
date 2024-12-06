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

const pos = { x: -1, y: -1 };
let vec = -1;

outer: for (let x=0; x<width; x++) {
  inner: for (let y=0; y<height; y++) {
    const curr = grid[y][x];
    if (curr === '#' || curr === '.') {
      continue inner;
    }

    grid[y][x] = '.';
    pos.y = y;
    pos.x = x;
    vec = vecFromChar[curr];
    break outer;
  }
}

function print() {
  for (let y=0; y<height; y++) {
    let str = '';
    for (let x=0; x < width; x++) {
      if (pos.x === x && pos.y === y) {
        str += '^>v<'[vec];
      } else {
        str+=grid[y][x];
      }
    }
    console.log(str);
  }
}

const positions = new Set();
// Runaway code prevention while I figure out what I'm doing.
let steps = 0;
outer: while (steps < 5000) {
  positions.add(pos.x + ',' + pos.y);

  let newPos = {  x: pos.x + vecs[vec].x, y: pos.y + vecs[vec].y };
  while (!grid[newPos.y] || grid[newPos.y][newPos.x] !== '.') {
    if (newPos.y < 0 || newPos.y < 0 || newPos.x >= width || newPos.y >= height) {
      console.log('Left the arena');
      break outer;
    }
    vec = (vec + 1) % 4;
    newPos.x = pos.x + vecs[vec].x;
    newPos.y = pos.y + vecs[vec].y;
  }

  // print();
  pos.x = newPos.x;
  pos.y = newPos.y;
}

console.log({ steps } );
console.log({ position: positions.size });

