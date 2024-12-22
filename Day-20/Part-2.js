const fs = require('fs');
const { performance } = require('perf_hooks');

// This is marginally better than bruteforce. I look at
// the steps along the path and then check all of dist < 20
// positions around each point, checking to see if there's
// another path node there. If so, tally up the distance
// saved and stick it in a hash table based on the coords.
// This finishes in a smidge under 2 minutes, which is
// bearable, but I know there's something far, far faster.
// The amount of re-walking the grid this code does
// makes my brain itch for something faster. But alas,
// I did not find that solution today.

function g(grid, x, y) {
  if (!grid[y]) {
    return undefined;
  }
  return grid[y][x];
}

function makeGrid(input) {
  const lines = input.split('\n').filter(Boolean);
  const grid = [];
  for (const line of lines) {
    grid.push(line.split(''));
  }
  return grid;
}


function print(grid, size, path, start = {}, end = {}, cheatNodeMap={}) {

  const pathSet = new Set();
  for (let p of path) {
    pathSet.add(h(p.x, p.y));
  }


  let out = [];
  for (let y=0; y<size; y++) {
    const row = [];
    for (let x=0; x<size; x++) {

      if (start.x === x && start.y === y) {
        row.push('\x1b[43m\x1b[30m' + grid[y][x] + '\x1b[0m');
      } else if (end.x === x && end.y === y) {
        row.push('\x1b[44m\x1b[30m' + grid[y][x] + '\x1b[0m');
      } else if (cheatNodeMap[x + ',' + y]) {
        row.push('\x1b[45m\x1b[30m' + grid[y][x] + '\x1b[0m');
      } else if (!pathSet.has(h(x, y))) {
        row.push(grid[y][x]);
      } else {
        row.push('\x1b[46m\x1b[30m' + grid[y][x] + '\x1b[0m');
      }
    }
    out.push(row);
  }
  console.log(out.map(row => row.join('')).join('\n'));
}

function h(x, y) {
  return x + ',' + y;
}

function pathBackToOrigin(nodes, node, path=[]) {


  while (node.steps > 0) {
    path.unshift(node);
    let cheapestEdgeNode = undefined;
    for (const edge of node.edges) {
      if (!cheapestEdgeNode || nodes[edge].steps < cheapestEdgeNode.steps) {
        cheapestEdgeNode = nodes[edge];
      }
    }
    node = cheapestEdgeNode;
  }

  return path;
}

// Basically just A*
function solve(nodes, size, start, end) {
  const seen=new Set();
  const queue=[{ hash: h(start.x, start.y), steps: 0 }];
  const endHash = h(end.x, end.y);
  while (queue.length) {
    const {hash, steps} = queue.shift();
    const node = nodes[hash];
    node.steps = Math.min(node.steps, steps);

    if (hash === endHash) {
      return pathBackToOrigin(nodes, node);
    }

    if (seen.has(hash)) {
      continue;
    }
    seen.add(hash);

    for (const edge of node.edges) {
      nodes[edge].steps = Math.min(nodes[edge].steps, steps + 1);

      if (!seen.has(edge)) {
        queue.push({ hash: edge, steps: steps + 1 });
      }
    }
    queue.sort((a, b) => {
      const aHeur = nodes[a.hash].steps + nodes[a.hash].dist ;
      const bHeur = nodes[b.hash].steps + nodes[b.hash].dist;
      return aHeur - bHeur;
    });

    /*
    console.log('Queue dump: ');
    for (let i=0; i<queue.length; i++) {
      console.log(i, nodes[queue[i].hash] );
    }
    */

  }

  return undefined;
}

function nodesFromGrid(grid, size, adjacent) {
  const nodes = {};
  for (let y=0; y<size; y++) {
    for (let x=0; x<size; x++) {
      if (grid[y][x] !== '#') {
        const node = {
          x,
          y,
          steps: Infinity,
          dist: Math.sqrt(
            Math.pow(size - x, 2) + Math.pow(size - y, 2)
          ),
          edges: [],
        };
        nodes[h(x, y)] = node;

        // Look up
        if (g(grid, x, y - 1) && g(grid, x, y - 1) !== '#') {
          node.edges.push(h(x, y - 1));
        }

        // Look right
        if (g(grid, x + 1, y) && g(grid, x + 1, y) !== '#') {
          node.edges.push(h(x + 1, y));
        }

        // Look down
        if (g(grid, x, y + 1) && g(grid, x, y + 1) !== '#') {
          node.edges.push(h(x, y + 1));
        }

        // Look left
        if (g(grid, x - 1, y) && g(grid, x - 1, y) !== '#') {
          node.edges.push(h(x - 1, y));
        }
      }
    }
  }
  return nodes;
}

function startAndEndFromGrid(grid) {
  const start = { x: -1, y: -1 };
  const end = { x: -1, y: -1 };
  for (let y=0; y<grid.length; y++) {
    for (let x=0; x<grid.length; x++) {
      if (grid[y][x] == 'S') {
        start.x = x;
        start.y = y;
      } else if (grid[y][x] === 'E') {
        end.x = x;
        end.y = y;
      }
      if (start.x > -1  && end.x > -1) {
        return { start, end };
      }
    }
  }
}

function clone(grid) {
  const out = [];
  for (let y=0; y<grid.length; y++) {
    out.push([]);
    for (let x=0; x<grid.length; x++) {
      out[y][x] = grid[y][x];
    }
  }
  return out;
}

function report(cheats, threshold) {
  console.log(cheats);
  const groupedBySize = {};
  let counted = 0;
  for (let coord in cheats) {
    const saved = cheats[coord];
    if (saved >= threshold) {
      counted++;
    }
    if (groupedBySize[saved] === undefined) {
      groupedBySize[saved] = 1;
    } else {
      groupedBySize[saved]++;
    }
  }
  console.log(groupedBySize);
  console.log({ counted });
}

function makeCheatPathHash(a, b) {
  const cph = {};
  let xDir = (b.x - a.x) / Math.abs(b.x - a.x);
  let x=a.x;
  for (; x!==b.x; x+=xDir) {
    cph[x + ',' + a.y] = true;
  }
  let yDir = (b.y - a.y) / Math.abs(b.y - a.y);
  let y=a.y;
  for (; y!==b.y; y+=yDir) {
    cph[b.x + ',' + y] = true;
  }
  return cph;
}

function nne(pathHash, a, limit, onFind) {
  for (let y=1; y<=limit; y++) {
    for (let x=0; x+y <=limit; x++) {
      const b = pathHash[h(a.x + x, a.y - y)];
      if (b) {
        onFind(a, b, x+y);
      }
    }
  }
}

function ees(pathHash, a, limit, onFind) {
  for (let x=1; x<=limit; x++) {
    for (let y=0; x+y <=limit; y++) {
      const b = pathHash[h(a.x + x, a.y + y)];
      if (b) {
        onFind(a, b, x+y);
      }
    }
  }
}

function ssw(pathHash, a, limit, onFind) {
  for (let y=1; y<=limit; y++) {
    for (let x=0; x+y <=limit; x++) {
      const b = pathHash[h(a.x - x, a.y + y)];
      if (b) {
        onFind(a, b, x+y);
      }
    }
  }
}

function wwn(pathHash, a, limit, onFind) {
  for (let x=1; x<=limit; x++) {
    for (let y=0; x+y <= limit; y++) {
      const b = pathHash[h(a.x - x, a.y - y)];
      if (b) {
        onFind(a, b, x+y);
      }
    }
  }
}


function findCheatsFromPoint(
  grid, path, noCheatPathLength, cheats, pathHash, a, limit, threshold
) {
  const onFind = (a, b, dist) => {
      const cph = makeCheatPathHash(a, b);
        const newPathLength =
          a.steps + dist + (noCheatPathLength - b.steps);
        const thisPath = [
          ...path.slice(0, path.indexOf(a) + 1),
          ...path.slice(path.indexOf(b))
        ];


        const saved = noCheatPathLength - newPathLength;
        if (saved >= threshold) {
          /*
          if (Math.random() * 1000  < 1) {
            print(
              grid,
              grid.length,
              thisPath,
              undefined,
              undefined,
              cph,
            );
            console.log({ a , b });
            console.log('saves: ' + saved);
          }
          */
          const c = h(a.x, a.y) + ' -> ' + h(b.x, b.y);
          cheats[c] = Math.max(cheats[c] || -Infinity, saved);
        }
  };

  nne(pathHash, a, limit, onFind);
  ees(pathHash, a, limit, onFind);
  ssw(pathHash, a, limit, onFind);
  wwn(pathHash, a, limit, onFind);
}

function run(file, limit, threshold)  {
  const input = fs.readFileSync(file).toString('utf-8');
  const grid = makeGrid(input);
  const size = grid.length;
  const nodes = nodesFromGrid(grid, size);
  const { start, end } = startAndEndFromGrid(grid);

  const path = solve(nodes, size, start, end);
  // console.log(path);
  if (!path) {
    console.log('no exit, my guy');
    process.exit(1);
  }

  const cheats = {};
  const noCheatPathLength = path.length;
  print(grid, size, path, start, end);

  path.unshift({ x: start.x, y: start.y, steps: 0 });
  const pathHash = {};
  path.forEach(node => {
    pathHash[h(node.x, node.y)] = node;
  });


  for (let i=0; i<path.length-1; i++) {
    const a = path[i];
    findCheatsFromPoint(
      grid,
      path,
      noCheatPathLength,
      cheats,
      pathHash,
      a,
      limit,
      threshold,
    );
  }

  report(cheats, threshold);
}


//run('./test-input.txt', 2, 0);
run('./input.txt', 20, 100);
