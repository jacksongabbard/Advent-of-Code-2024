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

// Basically just A*
function solve(nodes, size) {
  const seen=new Set();
  const queue=[{ hash: '0,0', steps: 0 }];
  const endHash = h(size - 1, size - 1);
  while (queue.length) {
    const {hash, steps} = queue.shift();
    const node = nodes[hash];
    console.log('Looking at ' + hash, endHash, steps, node.steps, node.dist);

    node.steps = Math.min(node.steps, steps);

    if (hash === endHash) {
      console.log(node);
      break;
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

  for (const line of lines) {
    const [x, y] = line.split(',').map(s => parseInt(s, 10));
    console.log({ x, y });
    grid[y][x] = '#';
    max--;
    if (max === 0) {
      break;
    }
  }

  print(grid, size);

  const nodes = nodesFromGrid(grid, size);

  console.log('Nodes: ' + nodes.length);
  console.log('>', solve(nodes, size));
}


// run('./test-input.txt', 7, 12);
run('./input.txt', 71, 1024);

