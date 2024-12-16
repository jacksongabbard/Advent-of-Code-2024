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
        row.push(grid[y][x] !== '.' ? '\x1b[34m' + '█' + '\x1b[0m' : ' ');
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

function solveCheapest(grid, queue, memo) {
  while (queue.length) {
    const { pos, path } = queue.shift();
    console.log(pos);
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
      }
      console.log('Found a solution: ', memo[pos.x + ',' + pos.y + ',<'], path);
      print(grid, path);
      continue;
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
      let nextCost = memo[pos.x + ',' + pos.y + ',' + dir];
      if (
        nextCost === undefined &&
        memo[pos.x + ',' + pos.y + ',' + rot(dir, 1)] !== undefined
      ) {
        nextCost = memo[pos.x + ',' + pos.y + ',' + rot(dir, 1)] + 1000;
      } else if (
        nextCost === undefined &&
        memo[pos.x + ',' + pos.y + ',' + rot(dir, 3)] !== undefined
      ) {
        nextCost = memo[pos.x + ',' + pos.y + ',' + rot(dir, 3)] + 1000;
      } else if (nextCost === undefined) {
        console.log(pos, dir, memo, rot(dir, 1), rot(dir, 3));
        throw new Error('Memoization is busted.');
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
        queue.push({ pos: next, path: nextPath});
      }

    }
  }
}

function run(file) {
  const input = fs.readFileSync(file).toString('utf-8');
  const { grid, start, end } = makeMazeFromInput(input);
  //end.x = 137;
  //end.y = 33;

  const memo = {
    [end.x + ',' + end.y + ',<']: 0,
    [end.x + ',' + end.y + ',v']: 0,
  };
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
  );

  /*
  const keys = Object.keys(memo);
  keys.sort((a, b) => memo[a] - memo[b]);
  for (let key of keys) {
    console.log(key, memo[key]);
  }
  */

  console.log(
    start,
    memo,
    memo[start.x + ',' + start.y + ',<']
  );
}

// run('jg-test.txt');
// run('./test-input-small.txt');
// run('./test-input-small-jg.txt');
// run('./test-input-large.txt');
run('./input.txt');
