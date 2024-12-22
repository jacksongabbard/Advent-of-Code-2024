const fs = require('fs');
const { performance } = require('perf_hooks');

// This is just the bruteforce solution, deleting
// one wall at a time and re-finding the shortest
// path. I'm sure AoC is going to wreck me for
// this is Part 2. This completes in about 2min.

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
        row.push('\x1b[33m' + '█' + '\x1b[0m');
      } else if (end.x === x && end.y === y) {
        row.push('\x1b[34m' + '█' + '\x1b[0m');
      } else if (cheatNodeMap[x + ',' + y]) {
        row.push('\x1b[35m' + '█' + '\x1b[0m');
      } else if (!pathSet.has(h(x, y))) {
        row.push(grid[y][x]);
      } else {
        row.push('\x1b[32m' + '█' + '\x1b[0m');
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

function report(cheats) {
  console.log(cheats);
  const groupedBySize = {};
  let counted = 0;
  for (let coord in cheats) {
    const saved = cheats[coord];
    if (saved >= 100) {
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

const dirs = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];
function findCheatsFromPoint(
  grid, path, noCheatPathLength, cheats, pathHash, a, cheatPos, stepsToA, xd=0,
  yd=0, seen, cheatPathHash,
) {
  if (xd === 0 && yd === 0) {
    return;
  }

  const bx = a.x + xd;
  const by = a.y + yd;
  if (seen.has(bx + ',' + by)) {
    return;
  }
  seen.add(bx + ',' + by);

  const limit = 20;
  const manhattanDistance = Math.abs(xd) + Math.abs(yd);
  const cheatSteps = Object.keys(cheatPathHash).length + 1;

  if (cheatSteps <= limit) {
    const cph = { ...cheatPathHash, [h(a.x + xd, a.y + yd)]: true };
    const b = pathHash[h(bx, by)];
    if (b) {
      const newPathLength =
        a.steps + cheatSteps + (noCheatPathLength - b.steps);
      const thisPath = [
        ...path.slice(0, path.indexOf(a) + 1),
        ...path.slice(path.indexOf(b))
      ];


      const saved = noCheatPathLength - newPathLength;
      if (saved > 0) {
        /*
        print(
          grid,
          grid.length,
          thisPath,
          undefined,
          undefined,
          cph,
        );
        console.log({ b, xd, yd, manhattanDistance });
        console.log('saves: ' + saved);
        */
        const c = h(cheatPos.x, cheatPos.y);
        cheats[c] = Math.min(cheats[c] || Infinity, saved);
      }
    } else {
      for (const dir of dirs) {
        findCheatsFromPoint(
          grid,
          path,
          noCheatPathLength,
          cheats,
          pathHash,
          a,
          cheatPos,
          stepsToA,
          xd + dir.x,
          yd + dir.y,
          seen,
          cph,
        );
      }
    }
  }
}

function run(file)  {
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

  const pathHash = {};
  path.forEach(node => {
    pathHash[h(node.x, node.y)] = node;
  });

  path.unshift({ x: start.x, y: start.y, steps: 0 });

  for (let i=0; i<path.length-1; i++) {
    const a = path[i];
    const hash = h(a.x, a.y);

    for (const dir of dirs) {
      if (g(grid, a.x + dir.x, a.y + dir.y) === "#") {
        // console.log('Looking at ' + (a.x + dir.x) + ',' + (a.y + dir.y) +
        // ' from ' + a.x + ',' + a.y);
        const cheatPos = { x: a.x + dir.x, y: a.y + dir.y };
        findCheatsFromPoint(
          grid,
          path,
          noCheatPathLength,
          cheats,
          pathHash,
          a,
          cheatPos,
          i + 1,
          dir.x,
          dir.y,
          new Set(hash),
          { [h(cheatPos.x, cheatPos.y)]: true },
        );
      }
    }
  }

  report(cheats);
}


run('./test-input.txt');
// run('./input.txt');
