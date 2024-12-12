const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const grid =
  input.split('\n')
    .filter(Boolean)
    .map(l => l.split(''));

const h = grid.length;
const w = grid[0].length;

const vecs = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
];

function mapFromPos(grid, letter, x, y, mapped, points=[]) {
  if (grid[y][x] !== letter) {
    return;
  }

  const newPoint = {
    x,
    y,
    upPerimeter: y === 0 || grid[y - 1][x] !== letter,
    rightPerimeter: x === grid[0].length - 1 || grid[y][x + 1] !== letter,
    downPerimeter:  y === grid.length - 1 || grid[y + 1][x] !== letter,
    leftPerimeter:  x === 0 || grid[y][x - 1] !== letter,
  };
  points.push(newPoint);
  mapped.add(x + ',' +y);


  forLoop: for (const vec of vecs) {
    const maybe = { x: x + vec.x, y: y + vec.y };
    if (
      maybe.x < 0 ||
      maybe.x >= grid[0].length ||
      maybe.y < 0 ||
      maybe.y >= grid.length ||
      mapped.has(maybe.x + ',' + maybe.y)
    ) {
      continue forLoop;
    }

    mapFromPos(grid, letter, maybe.x, maybe.y, mapped, points);
  }
  return points;
}


const mapped = new Set();
let currentLetter = '';
let runningTotal = 0;
for (let y=0; y<h; y++) {
  inner: for (let x=0; x<w; x++) {
    const letter = grid[y][x];
    if (mapped.has(x + ',' + y)) {
      currentLetter = letter;
      continue inner;
    }
    if (letter !== currentLetter) {
      const pointList = mapFromPos(grid, letter, x, y, mapped);
      const area = pointList.length;
      const perimeter = pointList.reduce((acc, point) => {
        acc += point.upPerimeter ? 1 : 0;
        acc += point.rightPerimeter ? 1 : 0;
        acc += point.downPerimeter ? 1 : 0;
        acc += point.leftPerimeter ? 1 : 0;
        return acc;
      }, 0);

      console.log(letter, pointList.length, perimeter);
      runningTotal += pointList.length * perimeter;
      currentLetter = letter;
    }
  }
}

console.log({ total: runningTotal });
