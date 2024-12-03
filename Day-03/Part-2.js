const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

let product = 0;
let ptr = 0;

const len = input.length;

let enabled = true;
while (ptr < len) {
  let substr = input.substring(ptr);
  if (substr.match(/^do\(\)/)) {
    enabled = true;
    ptr+=4;
    continue;
  }

  if (substr.match(/^don't\(\)/)) {
    enabled = false;
    ptr+= 7;
  }

  const res = substr.match(/^mul\((\d+),(\d+)\)/);
  if (res) {
    ptr += res[0].length;
    if (enabled) {
      product += parseInt(res[1], 10) * parseInt(res[2], 10);
    }
    continue;
  }

  ptr++;
}

console.log({ product });
