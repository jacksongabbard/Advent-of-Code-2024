const fs = require('fs');

const input =
  fs.readFileSync('./input.txt')
    .toString('utf-8')
    .split('\n')
    .filter(Boolean)
    .map(
      s => s.split('').map(s => s === '.' ? '.' : parseInt(s, 10))
    );


function print(input, path) {
  let output = '';
  for (let y=0; y<input.length; y++) {
    for (let x=0; x<input.length; x++) {
      if (path.find(c => c.x === x && c.y === y)) {
        output += '\x1b[32m' + input[y][x].toString() + '\x1b[0m';
      } else {
        output += input[y][x].toString();
      }
    }
    output += '\n';
  }

  console.log(output);
}


const height = input.length;
const width = input[0].length;

const nexts = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
];

function followTrail(input, width, height, x, y, curr, seen, path) {
  if (curr === 9) {
    // print(input, path);
    return 1;
  }

  const nextVal = curr + 1;
  let trailCountFromHere = 0;
  for (let nextVec of nexts) {
    const nx = x + nextVec.x;
    const ny = y + nextVec.y;
    if (
      nx >= 0 &&
      nx < width &&
      ny >= 0 &&
      ny < height
    ) {
      if (input[ny][nx] === nextVal && !seen.has(nx + ',' + ny)) {

        const nPath = [ ...path, { x: nx, y: ny  }];
        seen.add(nx + ',' + ny);
        trailCountFromHere +=
          followTrail(input, width, height, nx, ny, nextVal, seen, nPath);
      }
    }
  }

  return trailCountFromHere;
}


let trailCount = 0;
for (let y=0; y<height; y++) {
  for (let x=0; x<width; x++) {
    if (input[y][x] === 0) {
      const localTotal = followTrail(input, width, height, x, y, 0, new Set(), [{ x, y }]);
      trailCount += localTotal;
    }
  }
}


console.log(trailCount);


