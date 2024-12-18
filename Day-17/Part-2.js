const fs = require('fs');

function combo(reg, operand) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return BigInt(operand);
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

function dv(reg, operand) {
  return reg.a / (BigInt(1) << combo(reg, operand));
}

// 0
function adv(reg, operand) {
  reg.a = dv(reg, operand);
}

// 1
function bxl(reg, operand) {
  reg.b = reg.b ^ BigInt(operand);
}

// 2
function bst(reg, operand) {
  reg.b = combo(reg, operand) % BigInt(8);
}

// 3
function jnz(reg, operand, ip) {
  if (reg.a === BigInt(0)) {
    return -1;
  }

  ip.val = operand;
}

// 4
function bxc(reg, _operand) {
  reg.b = BigInt(reg.b) ^ BigInt(reg.c);
  if (reg.b < 0) {
    console.log(val, reg.b , reg.c);
    process.exit(1);
  }
}

// 5
function out(reg, operand, out) {
  const val = combo(reg, operand) % BigInt(8);
  out.push(val);
}

// 6
function bdv(reg, operand) {
  reg.b = dv(reg, operand);
}

// 7
function cdv(reg, operand) {
  reg.c = dv(reg, operand);
}

function exec(opcode, operand, reg, ip, ob) {
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
    const instStr = [...instructions];
    for (let i=0; i<instStr.length; i++) {
      if (i === ip.val) {
        instStr[i] = '^';
      } else {
        instStr[i] = ' ';
      }
    }

    const opcode = instructions[ip.val];
    const operand = instructions[ip.val + 1];
    exec(opcode, operand, reg, ip, ob);
  }

  return ob;
}

function getInput(file) {
  const lines =
    fs.readFileSync(file).toString('utf-8').split('\n');

  const a = BigInt(parseInt(lines[0].split(': ')[1], 10));
  const b = BigInt(parseInt(lines[1].split(': ')[1], 10));
  const c = BigInt(parseInt(lines[2].split(': ')[1], 10));
  const instStr = lines[4].split(': ')[1];
  const inst = instStr.split(',').map(s => parseInt(s, 10));
  return { inst, reg: [a, b, c] };
}


function find(inst, idx, a, prefix='') {
  for (let i=BigInt(0); i<BigInt(8); i++) {
    const ob = run(inst, (a << BigInt(3)) + i, 0, 0);
    const matchesVal = ob[0] === BigInt(inst[idx]);
    if (matchesVal && idx > 0) {
      console.log(prefix, i, ob.join(','));
      find(inst, idx - 1, (a << BigInt(3)) + i, prefix + '  ');
    } else if (matchesVal && idx === 0) {
      const answer = (a << BigInt(3)) + i;
      console.log(prefix, { answer });
      process.exit(0);
    }
  }
}

(() => {
  const { inst, reg } = getInput('./input.txt');
  console.log(inst.join(','));
  find(inst, inst.length - 1, BigInt(0));
})();

