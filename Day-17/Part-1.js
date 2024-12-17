const fs = require('fs');


function combo(reg, operand) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return reg.a;
    case 5:
      return reg.b;
    case 6:
      return reg.c;
    case 7:
      throw new Error('Invalid input');
  }
}

// 0
function adv(reg, operand) {

  const val = Math.floor(
    reg.a / Math.pow(2, combo(reg, operand))
  );
  reg.a = val;
}

// 1
function bxl(reg, operand) {
  reg.b = reg.b ^ operand;
}

// 2
function bst(reg, operand) {
  reg.b = combo(reg, operand) % 8;
}

// 3
function jnz(reg, operand, ip) {
  if (reg.a === 0) {
    return -1;
  }

  ip.val = operand;
}

// 4
function bxc(reg, _operand) {
  reg.b = reg.b ^ reg.c;
}

// 5
function out(reg, operand, out) {
  const val = combo(reg, operand) % 8;
  out.push(val);
}

// 6
function bdv(reg, operand) {
  const val = Math.floor(
    reg.a / Math.pow(2, combo(reg, operand))
  );
  reg.b = val;
}

// 7
function cdv(reg, operand) {
  const val = Math.floor(
    reg.a / Math.pow(2, combo(reg, operand))
  );
  reg.c = val;
}

function exec(opcode, operand, reg, ip, ob) {
  console.log('exec: ', JSON.stringify({ opcode, operand }), reg);
  switch (opcode) {
    case 0:
      adv(reg, operand);
      ip.val += 2;
      return;

    case 1:
      bxl(reg, operand);
      ip.val += 2;
      return;

    case 2:
      bst(reg, operand);
      ip.val += 2;
      return;

    case 3:
      const didJump = jnz(reg, operand, ip);
      if (didJump === -1) {
        ip.val+=2; // i guess?
      }
      return;

    case 4:
      bxc(reg, operand);
      ip.val += 2;
      return;

    case 5:
      out(reg, operand, ob);
      ip.val += 2;
      return;

    case 6:
      bdv(reg, operand);
      ip.val += 2;
      return;

    case 7:
      cdv(reg, operand);
      ip.val += 2;
      return;


    default:
      throw new Error('Unknown opcode: ' + opcode);
  }
}

function run(instructions, a=0, b=0, c=0) {

  console.log('#################################################');
  console.log(instructions);

  const reg = {
    a,
    b,
    c,
  };
  const ip = {
    val: 0,
  };
  const ob = [];

  while (ip.val < instructions.length) {
    const opcode = instructions[ip.val];
    const operand = instructions[ip.val + 1];
    exec(opcode, operand, reg, ip, ob);
  }

  console.log(reg);
  console.log('output buffer: ' + ob.join(','));
}

function getInput(file) {
  const lines =
    fs.readFileSync(file).toString('utf-8').split('\n');

  const a = parseInt(lines[0].split(': ')[1], 10);
  const b = parseInt(lines[1].split(': ')[1], 10);
  const c = parseInt(lines[2].split(': ')[1], 10);
  const instStr = lines[4].split(': ')[1];
  const inst = instStr.split(',').map(s => parseInt(s, 10));

  return { inst, reg: [a, b, c] };
}


run([2,6], 0, 0, 9);

run([5,0,5,1,5,4], 10, 0, 0);

run([0,1,5,4,3,0], 2024, 0, 0);

run([1,7], 0, 29, 0);

run([4,0], 0, 2024, 43690);

(() => {
  const { inst, reg } = getInput('./test-input.txt');
  run(inst, ...reg);
})();

(() => {
  const { inst, reg } = getInput('./input.txt');
  run(inst, ...reg);
})();

