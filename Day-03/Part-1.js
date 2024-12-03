const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

let product = 0;
let ptr = 0;
const len = input.length;

while (ptr < len) {
  const substr = input.substring(ptr);
  const res = substr.match(/^mul\((\d+),(\d+)\)/);
  if (res) {
    ptr += res[0].length;
    product += parseInt(res[1], 10) * parseInt(res[2], 10);
  } else {
    ptr++;
  }
}

console.log({ product });
