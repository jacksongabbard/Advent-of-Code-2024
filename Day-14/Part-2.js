const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

const regex = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/;
const robots = [];
for (const line of lines) {
  const [_, x, y, vx, vy] = line.match(regex);
  robots.push({
    sx: parseInt(x, 10),
    sy: parseInt(y, 10),
    px: parseInt(x, 10),
    py: parseInt(y, 10),
    vx: parseInt(vx, 10),
    vy: parseInt(vy, 10),
  });
}


let w = 101;
let h = 103;

// let w = 11;
// let h = 7;

function maybeHasTree(robots) {
  const posMap = {};
  robots.forEach(r => { posMap[r.px + ',' + r.py] = true; });

  for (let r of robots) {
    if (posMap[(r.px + 1) + ',' + r.py]) {
      console.log('found right neighbor', r);
      return true;
    }

    if (posMap[(r.px - 1) + ',' + r.py]) {
      console.log('found left neighbor', r);
      return true;
    }

  }

  return false;
}

function print(tick, robots) {
  let grid = [];
  for (let y=0; y<h; y++) {
    grid.push([]);
    for (let x=0; x<w; x++) {
      grid[y][x] = 0;
    }
  }

  for (let r of robots) {
    grid[r.py][r.px]++;
  }


  let out = [];
  for (let y=0; y<h; y++) {
    out.push([]);
    for (let x=0; x<w; x++) {
      out[y][x] = grid[y][x] === 0 ? '.' : grid[y][x];
    }
  }

  console.log('tick: ' + tick);
  console.log(out.map(row => row.join('')).join('\n') + '\n');
}

function jumpTo(t) {
  for (const r of robots) {
    r.px = (w*t + (r.sx + r.vx * t)) % w;
    r.py = (h*t + (r.sy + r.vy * t)) % h;
  }
}
// 98, 101
// 53, 103

for (let t=98; t<10000; t+=101) {
  jumpTo(t);
  print(t, robots);
}
