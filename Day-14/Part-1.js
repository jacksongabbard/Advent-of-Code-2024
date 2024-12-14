const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

console.log(lines);

const regex = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/;
const robots = [];
for (const line of lines) {
  console.log(line);
  const [_, x, y, vx, vy] = line.match(regex);
  robots.push({
    px: parseInt(x, 10),
    py: parseInt(y, 10),
    vx: parseInt(vx, 10),
    vy: parseInt(vy, 10),
  });
}


let w = 101;
let h = 103;

for (let t=0; t<100; t++) {
  for (const r of robots) {
    r.px = (w + (r.px + r.vx)) % w;
    r.py = (h + (r.py + r.vy)) % h;
  }
}

const quadrants = { nw: 0, ne: 0, se: 0, sw: 0 };

const midX = Math.floor(w/2);
const midY = Math.floor(h/2);
for (let robot of robots) {
  if (robot.px < midX && robot.py < midY) {
    quadrants.nw++;
  } else if (robot.px > midX && robot.py < midY) {
    quadrants.ne++;
  } else if (robot.px > midX && robot.py > midY) {
    quadrants.se++;
  } else if (robot.px < midX && robot.py > midY) {
    quadrants.sw++;
  }
}

console.log(quadrants);
const { nw, ne, se, sw } = quadrants;
console.log(nw * ne * se * sw);
