const fs = require('fs');

function makeMazeFromInput(input) {
  const lines = input.split('\n').filter(Boolean);
  const grid = [];
  for (const line of lines) {
    grid.push(line.split(''));
  }

  const pos = { x: 1, y: grid.length - 2, dir: '>' };
  const end = { x: grid[0].length -2, y: 1 };
  return { grid, pos, end };
}

function print(grid, path) {
  const out = [];
  for (let y=0; y<grid.length; y++) {
    const row = [];
    for (let x=0; x<grid[0].length; x++) {
      if (path[x + ',' + y]) {
        row.push('\x1b[32m' + '█' + '\x1b[0m');
      } else {
        row.push(grid[y][x] !== '.' ? grid[y][x] : ' ');
      }
    }
    out.push(row.join(''));
  }

  console.log(out.join('\n'));
}

function solveCheapest(grid, pos, end, cost, path={}, seen= new Set()) {
  if (
    pos.x < 1 || pos.x > grid[0].length - 2 ||
    pos.y < 1 || pos.y > grid.length - 2
  ) {
    return Infinity;
  }

  if (pos.x === end.x && pos.y === end.y) {
    print(grid, path);
    return cost;
  }

  let cheapestFromHere = Infinity;
  for (const dir of ['^', '>', 'v', '<']) {
    const next = { ...pos, dir };
    let nextCost = cost;
    if (dir !== pos.dir) {
      nextCost+=1000;
    }

    if (dir === '>') {
      next.x++;
    } else if (dir === 'v') {
      next.y++;
    } else if (dir === '<') {
      next.x--;
    } else if (dir === '^') {
      next.y--;
    } else {
      throw new Error('Unexpected direction');
    }
    nextCost++;

    if (seen.has(next.x + ',' + next.y) || path[next.x + ',' + next.y] || grid[next.y][next.x] === '#') {
      continue;
    }

    const nextPath = {...path};
    nextPath[next.x + ',' + next.y] = dir;
    seen.add(next.x + ',' + next.y);
    cheapestFromHere = Math.min(
      solveCheapest(grid, next, end, nextCost, nextPath, seen),
      cheapestFromHere,
    );
  }

  return cheapestFromHere;
}

function run(file) {
  const input = fs.readFileSync(file).toString('utf-8');
  const { grid, pos, end } = makeMazeFromInput(input);

  const cheapestPath =
    solveCheapest(
      grid, pos, end, 0, { [pos.x + ',' + pos.y]: pos.dir },
    );

  console.log(cheapestPath);
}

run('./test-input-small.txt');
run('./test-input-large.txt');
run('./input.txt');
