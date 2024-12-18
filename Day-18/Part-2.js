const fs = require('fs');

function g(grid, x, y) {
  if (!grid[y]) {
    return undefined;
  }
  return grid[y][x];
}

function makeGrid(size) {
  const grid = [];
  for (let y=0; y<size; y++) {
    grid.push([]);
    for (let x=0; x<size; x++) {
      grid[y][x] = '.';
    }
  }
  return grid;
}

function print(grid, size) {
  let out = [];
  for (let y=0; y<size; y++) {
    const row = [];
    for (let x=0; x<size; x++) {
      row.push(grid[y][x]);
    }
    out.push(row);
  }
  console.log(out.map(row => row.join('')).join('\n'));
}

function h(x, y) {
  return x + ',' + y;
}

function pathBackToOrigin(nodes, node, path=[]) {
  path.unshift(node);
  if (node.steps === 0) {
    return path;
  }

  let cheapestEdgeNode = undefined;
  for (const edge of node.edges) {
    if (!cheapestEdgeNode || nodes[edge].steps < cheapestEdgeNode.steps) {
      cheapestEdgeNode = nodes[edge];
    }
  }

  return pathBackToOrigin(nodes, cheapestEdgeNode, path);
}

// Basically just A*
function solve(nodes, size) {
  const seen=new Set();
  const queue=[{ hash: '0,0', steps: 0 }];
  const endHash = h(size - 1, size - 1);
  while (queue.length) {
    const {hash, steps} = queue.shift();
    const node = nodes[hash];
    node.steps = Math.min(node.steps, steps);

    if (hash === endHash) {
      console.log(node);
      return true;
      // return pathBackToOrigin(nodes, node);
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

function run(file, size, max)  {
  const input = fs.readFileSync(file).toString('utf-8');
  const lines = input.split('\n').filter(Boolean);
  const grid = makeGrid(size);

  let m = max;
  for (const line of lines) {
    const [x, y] = line.split(',').map(s => parseInt(s, 10));
    grid[y][x] = '#';
    m--;
    if (m === 0) {
      break;
    }
  }

  const nodes = nodesFromGrid(grid, size);
  const path = solve(nodes, size);
  if (!path) {
    console.log(max, lines[max - 1]);
    process.exit(0);
  }
}


// run('./test-input.txt', 7, 12);
for (let i=1024; i<3450; i++) {
  console.log(i);
  run('./input.txt', 71, i);
}

