const fs = require('fs');

const input =
  fs.readFileSync('./input.txt')
    .toString('utf-8')
    .trim()
    .split('')
    .map(s => parseInt(s, 10));

const fileblocks = [];

for (let i=0; i<input.length; i++) {
  let id = (i / 2);
  if (i % 2 === 1) {
    id = '.';
  }
  const blockSize = input[i];
  fileblocks.push({ id, size: blockSize});
}

function print(fb) {
  const output = [];
  for (let i=0; i<fb.length; i++) {
    for (let j=0; j<fb[i].size; j++) {
      output.push(fb[i].id);
    }
  }
  console.log(output.join(''));
}

outer: for (let right = fileblocks.length - 1; right>0; right--) {
  const rightFile = fileblocks[right];
  if (rightFile.id === '.') {
    continue;
  }

  inner: for (let left=0; left<right; left++) {
    const leftFile = fileblocks[left];
    if (leftFile.id !== '.') {
      continue inner;
    }

    if (leftFile.size >= rightFile.size) {

      const sizeDiff = leftFile.size - rightFile.size;
      fileblocks[left].id = fileblocks[right].id;
      fileblocks[left].size = fileblocks[right].size;
      fileblocks[right].id = '.';
      if (sizeDiff > 0) {
        fileblocks.splice(left + 1, 0, { 'id': '.', size: sizeDiff });
        right++;
      }
      continue outer;
    }
  }
}


let sum = 0;
let runningPos = 0;
for (let i=0; i<fileblocks.length; i++) {
  for (let x=0; x<fileblocks[i].size; x++) {
    if (fileblocks[i].id !== '.') {
      sum += runningPos * fileblocks[i].id;
    }
    runningPos++;
  }
}

console.log(sum);

