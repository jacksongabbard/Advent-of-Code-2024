const fs = require('fs');

const input = fs.readFileSync('./test-input.txt').toString('utf-8');

let product = 0;

let ptr = 0;

const len = input.length;

const m = 0;
const u = 1;
const l = 2;
const leftParen = 3;
const firstNumber = 4;
const comma = 5;
const secondNumber = 6;
const rightParen = 7;
const digit = /\d/;
const states = ['m', 'u', 'l', '\\(', digit, ',', digit, '\\)'];

let state = 0;
let leftOperand = 0;
let rightOperand = 0;

for (let ptr = 0; ptr < len; ptr++) {

  const curr = input[ptr];

  console.log({curr, state});

  if (curr.match(states[m])) {
    state = 0;
  }

  if (state === m && curr.match(states[m])) {
    state++;
  }

  if (state === u && curr.match(states[u])) {
    state++;
  }


  if (state === l && curr.match(states[l])) {
    state++;
  }


  if (state === leftParen && curr.match(states[leftParen])) {
    state++;
  }


  if (state === firstNumber) {
    if (curr.match(states[firstNumber])) {
      const num = parseInt(curr, 10);
      leftOperand = 10*leftOperand + num;
    } else if (curr.match(states[comma])) {
      state++;
    }
  }

  if (state === comma) {
    if (curr.match(states[comma])) {
      state++;
    }
  }

  if (state === secondNumber) {
    if (curr.match(states[secondNumber])) {
      const num = parseInt(curr, 10);
      rightOperand = 10*rightOperand + num;
    } else if (curr.match(states[rightParen])) {
      state++;
    }
  }


  if (state === rightParen && curr.match(states[rightParen])) {
    console.log({ leftOperand, rightOperand });
    product += leftOperand * rightOperand;
    leftOperand = 0;
    rightOperand = 0;
    state = 0;
  }

}

console.log({ product });
