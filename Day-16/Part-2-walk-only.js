const fs = require('fs');

function g(grid, x, y) {
  if (grid[y]) {
    return grid[y][x];
  }
  return undefined;
}

const dirs = {
  '^': ['^', '<', '>'],
  '>': ['^', 'v', '>'],
  'v': ['<', 'v', '>'],
  '<': ['<', 'v', '^'],
};
function getDirs(dir) {
  if (dir === undefined) {
    return ['<', 'v'];
  }

  return dirs[dir];
}

function step(next) {
  if (next.dir === '>') {
    next.x++;
  } else if (next.dir === '^') {
    next.y--;
  } else if (next.dir === 'v') {
    next.y++;
  } else if (next.dir === '<') {
    next.x--;
  }
}

let iter = 0;
function walk(grid, pos, end, path, magicNumber, cost, coords) {
  //console.log(pos, cost);
  //print(grid, path, pos, end);
  if (pos.x === end.x && pos.y === end.y) {
    if (pos.dir !== '<') {
      cost += 1000;
    }

    if (cost !== magicNumber) {
      console.log('not a winner', iter++);
      return;
    }

    console.log('Found a cheap path: ' + cost);
    print(grid, path, pos);
    for (let k in path) {
      coords.add(k);
    }
    return;
  }

  if (cost > magicNumber) {
    return;
  }

  const dirs = getDirs(pos.dir);

  for (const dir of dirs) {
    const next = { ...pos, dir };
    let nextCost = cost + 1;
    if (pos.dir && next.dir !== pos.dir) {
      nextCost += 1000;
    }

    step(next);

    const nextChar = g(grid, next.x, next.y);
    if (path[next.x + ',' + next.y] || nextChar === '#') {
      continue;
    }

    const newPath = {...path};
    newPath[next.x + ',' + next.y] = nextCost;
    walk(grid, next, end, newPath, magicNumber, nextCost, coords);
  }

}

function print(grid, path, pos) {
  const out = [];
  for (let y=0; y<grid.length; y++) {
    const row = [];
    for (let x=0; x<grid[0].length; x++) {
      if (pos && pos.x === x && pos.y === y) {
        row.push('\x1b[35m' + (pos.dir || 'X') + '\x1b[0m');
      } else if (path[x + ',' + y]) {
        row.push('\x1b[33m' + '█' + '\x1b[0m');
      } else {
        row.push(grid[y][x] !== '.' ? grid[y][x] : ' ');
      }
    }
    out.push(row.join(''));
  }

  console.log(out.join('\n'));
}


function run(file, magicNumber) {
  const input = fs.readFileSync(file).toString('utf-8');
  const { grid, start, end } = makeMazeFromInput(input);

  const coords = new Set();
  walk(
    grid,
    { x: end.x, y: end.y, dir: undefined },
    start,
    {
      [end.x + ',' + end.y]: 0,
    },
    magicNumber,
    0,
    coords,
  );

  console.log(coords.size, coords);
}

function makeMazeFromInput(input) {
  const lines = input.split('\n').filter(Boolean);
  const grid = [];
  for (const line of lines) {
    grid.push(line.split(''));
  }

  const start = { x: 1, y: grid.length - 2, dir: '>' };
  const end = { x: grid[0].length - 2, y: 1 };
  return { grid, start, end };
}


// run('jg-test.txt');
// run('./test-input-small.txt', 7036);
// run('./test-input-small-jg.txt', );
// run('./test-input-large.txt', 11048);
run('./input.txt', 135512);
