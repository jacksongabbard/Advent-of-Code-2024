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

function printStepByStep(grid, path) {
  const keys = Object.keys(path);
  keys.sort((a, b) => path[a] - path[b]);
  let orderedPath = {};
  for (let key of keys) {
    orderedPath[key] = path[key];
    console.log('Cost: ', path[key]);
    print(grid, orderedPath);
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

function advance(grid, pos, xd, yd, nextPath, cost) {
  let steps = 0;
  do {
    steps++;
    pos.x += xd;
    pos.y += yd;
    nextPath[pos.x + ',' + pos.y] = cost + steps;
  }  while (!stopHere(grid, pos.x, pos.y, pos.dir));
  return steps;
}

function rot(dir, amount) {
  const dirs = ['^', '>', 'v', '<'];
  return dirs[(dirs.indexOf(dir) + amount) % dirs.length];
}



function solveCheapest(grid, queue, memo, maxCost, coords) {
  let iter = 0;
  while (queue.length) {
    console.log(iter++);
    let { pos, path, cost } = queue.shift();
    //console.log('---------------------------');
    //print(grid, path, pos);

    if (
      pos.x < 1 || pos.x > grid[0].length - 2 ||
      pos.y < 1 || pos.y > grid.length - 2
    ) {
      continue;
    }


    if (pos.x === 1 && pos.y === grid.length - 2) {
      // This is clowny. If we're coming at this from any other direction than
      // west, it's as if we'd made a turn on the first move. The origin
      // direction is east (">"), so if we're not facing the complementary
      // direction, we need to account for it.
      if (pos.dir === 'v') {
        memo[pos.x + ',' + pos.y + ',<'] =
          Math.min(
            memo[pos.x + ',' + pos.y + ',<'] || Infinity,
            memo[pos.x + ',' + pos.y + ',v'] + 1000
          );
        cost += 1000;
      }


      if (cost === maxCost) {
        console.log('Found a solution: ', cost, path);
        for (let key in path) {
          coords.add(key);
        }

        //printStepByStep(grid, path);
        continue;
      } else if (cost > maxCost) {
        continue;
      }
    }

    let dirs = [];
    if (pos.dir === undefined) {
      dirs = ['<', 'v'];
    } else if (pos.dir === '^') {
      dirs = ['^', '<', '>'];
    } else if (pos.dir === '>') {
      dirs = ['^', 'v', '>'];
    } else if (pos.dir === 'v') {
      dirs = ['<', 'v', '>'];
    } else if (pos.dir === '<') {
      dirs = ['<', 'v', '^'];
    }

    inner: for (const dir of dirs) {

      let nextCost = 0;
      if (pos.dir) {
        nextCost = memo[pos.x + ',' + pos.y + ',' + pos.dir];
        if (dir !== pos.dir) {
          nextCost += 1000;
        }

        if (nextCost > memo[pos.x + ',' + pos.y + ',' + dir]) {
          // with the turn, this position is actually too expensive
          continue inner;
        }
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
        //console.log('not going ' + dir + ' -- hit a wall');
        continue inner;
      }

      const next = { ...pos, dir };
      const nextPath = {...path};
      nextCost += advance(grid, next, xd, yd, nextPath, nextCost);

      // Ensure we don't backtrack
      if (path[next.x + ',' + next.y]) {
        //console.log('not backtracking');
        continue inner;
      }


      if (
        !memo[next.x + ',' + next.y + ',' + rot(dir, 1)] ||
        memo[next.x + ',' + next.y + ',' + rot(dir, 1)] >= nextCost+1000
      ) {
        memo[next.x + ',' + next.y + ',' + rot(dir, 1)] = nextCost+1000;
      }

      if (
        !memo[next.x + ',' + next.y + ',' + rot(dir, 3)] ||
        memo[next.x + ',' + next.y + ',' + rot(dir, 3)] >= nextCost+1000
      ) {
        memo[next.x + ',' + next.y + ',' + rot(dir, 3)] = nextCost+1000;
      }

      if (
        !memo[next.x + ',' + next.y + ',' + dir] ||
        memo[next.x + ',' + next.y + ',' + dir] >= nextCost
      ) {
        // yay, found a faster way
        memo[next.x + ',' + next.y + ',' + dir] = nextCost;
        nextPath[next.x + ',' + next.y] = nextCost;
        //console.log(nextCost, 'Planning to go ' + dir + ' from here');
        queue.push({ pos: next, path: nextPath, cost: nextCost });
      }

    }
  }
}

function run(file, magicNumber) {
  const input = fs.readFileSync(file).toString('utf-8');
  const { grid, start, end } = makeMazeFromInput(input);

  const memo = {
    [end.x + ',' + end.y + ',<']: 0,
    [end.x + ',' + end.y + ',v']: 0,
  };

  const coords = new Set();
  solveCheapest(
    grid,
    [
      {
        pos: { x: end.x, y: end.y, dir: undefined },
        path: {
          [end.x + ',' + end.y]: 0,
          [end.x + ',' + end.y]: 0,
        },
      }
    ],
    memo,
    magicNumber,
    coords,
  );


  console.log(
    start,
    memo[start.x + ',' + start.y + ',<']
  );


  const fakePath = {};
  const cordArr = Array.from(coords);
  for (const coord of cordArr) {
    fakePath[coord] = true;
  }
  print(grid, fakePath);
  console.log(coords.size, coords);

}

// run('jg-test.txt', 9999);
// run('./test-input-small.txt', 7036);
// run('./test-input-small-jg.txt', );
// run('./test-input-large.txt', 11048);
run('./input.txt', 135512);
