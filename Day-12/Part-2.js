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
    topWall: y === 0 || grid[y - 1][x] !== letter,
    rightWall: x === grid[0].length - 1 || grid[y][x + 1] !== letter,
    bottomWall:  y === grid.length - 1 || grid[y + 1][x] !== letter,
    leftWall:  x === 0 || grid[y][x - 1] !== letter,
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

function g(pointMap, x, y) {
  const key = x + ',' + y;
  if (pointMap[key]) {
    return pointMap[key];
  }
  return { sirNotAppearingInThisFilm: true };
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

      const pointMap = {};
      for (const p of pointList) {
        pointMap[p.x + ',' + p.y] = p;
      }

      const perimeter = pointList.reduce((acc, p) => {
        let corners = 0;
        const {
          topWall, rightWall, bottomWall, leftWall
        } = p;

        if (topWall && rightWall) {
          corners++;
        }

        if (rightWall && bottomWall) {
          corners++
        }

        if (bottomWall && leftWall) {
          corners++
        }

        if (leftWall && topWall) {
          corners++
        }


        // This is undoubtedly not remotely close to an elegant
        // representation of this problem. But also... sh*t
        // works bro. Sh*t *** hurt tho. (https://genius.com/21079866)

        // I have a bottom and my south-west neighbor has a right, so it's a
        // corner
        if (
          bottomWall &&
          !g(pointMap, p.x - 1, p.y).sirNotAppearingInThisFilm &&
          g(pointMap, p.x - 1, p.y + 1).rightWall
        ) {
          corners++;
        }

        // I have a bottom and my south-east neighbor has a left
        if (
          bottomWall &&
          !g(pointMap, p.x + 1, p.y).sirNotAppearingInThisFilm &&
          g(pointMap, p.x + 1, p.y + 1).leftWall) {
          corners++;
        }

        // my top, my NW neighbor's right
        if (
          topWall &&
          !g(pointMap, p.x - 1, p.y).sirNotAppearingInThisFilm &&
          g(pointMap, p.x - 1, p.y - 1).rightWall
        ) {
          corners++;
        }

        // my top, my NE neighbor's left
        if (topWall &&
          !g(pointMap, p.x + 1, p.y).sirNotAppearingInThisFilm &&
          g(pointMap, p.x + 1, p.y - 1).leftWall
        ) {
          corners++;
        }

        return acc + corners;
      }, 0);

      console.log(letter, pointList.length, perimeter);
      runningTotal += pointList.length * perimeter;
      currentLetter = letter;
    }
  }
}

console.log({ total: runningTotal });
