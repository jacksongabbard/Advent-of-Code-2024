const fs = require('fs');

const input =
  fs.readFileSync('./input.txt')
    .toString('utf-8')
    .replace('\n', '')
    .split(' ');

function node(val) {
  return { val, next: undefined };
}

function makeLinkedList(input) {
  if (input.length === 0) {
    return undefined;
  }
  let linkedList = node(input[0]);
  let tail = linkedList;
  for (let i=1; i<input.length; i++) {
    tail.next = node(input[i]);
    tail = tail.next;
  }

  return linkedList;
}

function print(ll) {
  let t = ll;
  let out = '';
  while (t) {
    out += t.val + ' ';
    t = t.next;
  }
  console.log(out);
}

function count(ll) {
  let stones = 0;
  let curr = ll;
  while (curr) {
    stones++;
    curr = curr.next;
  }
  return stones;
}

function blink(ll) {
  let curr = ll;
  while (curr) {
    if (curr.val === '0') {
      curr.val = '1';
    } else if (curr.val.length % 2 === 0) {
      const v = curr.val;
      const left = v.substring(0, v.length / 2);
      const right = parseInt(v.substring(v.length / 2), 10).toString();
      curr.val = left;
      const temp = curr.next;
      curr.next = node(right);
      curr.next.next = temp;
      curr = curr.next;
    } else {
      curr.val = (parseInt(curr.val, 10) * 2024).toString();
    }
    curr = curr.next;
  }
}

let mem = {};
function recursiveBlink(ll, blinksToGo) {
  if (!mem[ll.val]) {
    mem[ll.val] = {};
  }
  if (mem[ll.val][blinksToGo] !== undefined) {
    return mem[ll.val][blinksToGo];
  }

  if (blinksToGo === 0) {
    mem[ll.val][blinksToGo] = 1;
    return 1;
  }

  let stones = 0;

  const myLL = { ...ll };
  blink(myLL);

  let right;
  if (myLL.next) {
    right = myLL.next;
    myLL.next = undefined;
  }

  stones = recursiveBlink(myLL, blinksToGo - 1);


  if (right) {
    stones += recursiveBlink(right, blinksToGo - 1);
  }

  mem[ll.val][blinksToGo] = stones;
  return stones;
}

const blinks = 75;
let runningTotal = 0;
for (let i=0; i<input.length; i++) {
  const ll = makeLinkedList([input[i]]);
  runningTotal += recursiveBlink(ll, blinks);
}

console.log({ stones: runningTotal });
