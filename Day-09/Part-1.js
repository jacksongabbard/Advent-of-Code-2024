const fs = require('fs');

const input =
  fs.readFileSync('./input.txt')
    .toString('utf-8')
    .trim()
    .split('')
    .map(s => parseInt(s, 10));

console.log(input);

const fileblocks = [];

for (let i=0; i<input.length; i++) {
  let id = (i / 2);
  if (i % 2 === 1) {
    id = '.';
  }
  const blockSize = input[i];

  for (let s = 0; s<blockSize; s++) {
    fileblocks.push(id);
  }

}


let left = 0;
let right = fileblocks.length - 1;

while (left < right) {
  if (fileblocks[left] !== '.') {
    left++;
    continue;
  }

  while (fileblocks[right] === '.') {
    right--;
    continue;
  }

  fileblocks[left] = fileblocks[right];
  fileblocks[right] = '.';
}

let sum = 0;
for (let i=0; i<fileblocks.length; i++) {
  if (fileblocks[i] === '.') {
    break;
  }

  let product = i * fileblocks[i];
  sum += product;
}

console.log(sum);

