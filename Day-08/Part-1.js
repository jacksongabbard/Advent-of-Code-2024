const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

const antennae = {};

let y = 0;
for (let line of lines) {
  const chars = line.split('');

  let x = 0;
  for (const c of chars) {
    if (c !== '.') {
      if (!antennae[c]) {
        antennae[c] = [];
      }
      antennae[c].push({ x, y });
    }
    x++;
  }

  y++;
}

const height = lines.length;
const width = lines[0].length;

const uniqueAntinodes = new Set();

for (const freq in antennae) {
  const ants = antennae[freq];

  for (let a of ants) {
    inner: for (let b of ants) {
      if (a.x === b.x && a.y === b.y) {
        continue inner;
      }

      const xDist = b.x - a.x;
      const yDist = b.y - a.y;
      const antinode = { x: b.x + xDist, y: b.y + yDist };

      if (antinode.x >= 0 &&
          antinode.y >= 0 &&
          antinode.x < width &&
          antinode.y < height
      ) {
        uniqueAntinodes.add(antinode.x + ',' + antinode.y);
      }
    }
  }
}

console.log(uniqueAntinodes.size);

