const fs = require('fs');

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

function g(grid, x, y) {
  if (grid[y]) {
    return grid[y][x];
  }
  return undefined;
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

function stopHere(grid, x, y, dir) {
  if (!g(grid, x, y)) {
    return false;
  }

  const canGoUp =    g(grid, x,     y - 1) !== '#';
  const canGoRight = g(grid, x + 1, y    ) !== '#';
  const canGoDown =  g(grid, x,     y + 1) !== '#';
  const canGoLeft =  g(grid, x - 1, y    ) !== '#';

  if (dir === '^') {
    return canGoRight || canGoLeft || !canGoUp ;
  }

  if (dir === '>') {
    return canGoUp || canGoDown || !canGoRight;
  }

  if (dir === 'v') {
    return canGoRight || canGoLeft || !canGoDown ;
  }

  if (dir === '<') {
    return canGoUp || canGoDown || !canGoLeft;
  }
}

function advance(grid, pos, xd, yd, nextPath) {
  let steps = 0;
  do {
    steps++;
    pos.x += xd;
    pos.y += yd;
    nextPath[pos.x + ',' + pos.y] = true;
  }  while (!stopHere(grid, pos.x, pos.y, pos.dir));
  return steps;
}

function solveCheapest(grid, pos, path, memo) {
  if (
    pos.x < 1 || pos.x > grid[0].length - 2 ||
    pos.y < 1 || pos.y > grid.length - 2
  ) {
    return;
  }


  if (pos.x === 1 && pos.y === grid.length - 2) {
    // This is clowny
    if (pos.dir !== '>') {
      memo[pos.x + ',' + pos.y] += 1000;
    }
    console.log('Found a solution: ', memo[pos.x + ',' + pos.y]);
    print(grid, path);
    return;
  }

  for (const dir of ['^', '>', 'v', '<']) {
    let nextCost = memo[pos.x + ',' + pos.y];
    if (pos.dir && dir !== pos.dir) {
      nextCost+=1000;
    }

    let xd = 0, yd = 0;
    if (dir === '>') {
      xd = 1;
    } else if (dir === 'v') {
      yd = 1;
    } else if (dir === '<') {
      xd = -1;
    } else if (dir === '^') {
      yd = -1;
    } else {
      throw new Error('Unexpected direction');
    }

    const peek = g(grid, pos.x + xd, pos.y + yd);
    if (!peek || peek === '#') {
      continue;
    }

    const next = { ...pos, dir };
    const nextPath = {...path};
    nextCost += advance(grid, next, xd, yd, nextPath);

    // Ensure we don't backtrack
    if (path[next.x + ',' + next.y]) {
      continue;
    }

    if (
      !memo[next.x + ',' + next.y] ||
      memo[next.x + ',' + next.y] > nextCost
    ) {
      // yay, found a faster way
      memo[next.x + ',' + next.y] = nextCost;
    } else {
      continue;
    }


    nextPath[next.x + ',' + next.y] = dir;
    solveCheapest(grid, next, nextPath, memo);
  }
}

function run(file) {
  const input = fs.readFileSync(file).toString('utf-8');
  const { grid, start, end } = makeMazeFromInput(input);
  const memo = {
    [end.x + ',' + end.y]: 0,
  };
  solveCheapest(
    grid,
    { x: end.x, y: end.y, dir: undefined },
    {
      [end.x + ',' + end.y]: true,
    },
    memo,
  );

  console.log(memo);
  console.log(start, memo[start.x + ',' + start.y]);
}

// run('jg-test.txt');
// run('./test-input-small.txt');
// run('./test-input-large.txt');
run('./input.txt');
