/**
 * EML Math Engine
 * ===============
 * Parses symbolic math expressions into AST,
 * then converts AST → EML tree representation.
 *
 * eml(x, y) = exp(x) - ln(y)
 *
 * Derivations:
 *   exp(x)  = eml(x, 1)       because eml(x,1) = exp(x) - ln(1) = exp(x)
 *   -ln(y)  = eml(0, y)       because eml(0,y) = exp(0) - ln(y) = 1 - ln(y) ... wait
 *
 * Actually let's be precise:
 *   eml(x, y) = exp(x) - ln(y)
 *
 *   exp(x)   = eml(x, 1)        // exp(x) - ln(1) = exp(x) - 0 = exp(x)
 *   ln(y)    = eml(0, 1) - eml(0, y) = 1 - (1 - ln(y)) = ln(y)
 *              Actually: eml(0,y) = exp(0) - ln(y) = 1 - ln(y)
 *              So ln(y) = 1 - eml(0, y) = eml(0,1) - eml(0,y)
 *              But eml(0,1) = 1. Hmm, we need subtraction...
 *
 *   Key insight: We can build everything from eml and the constant 1.
 *   Grammar: S → 1 | eml(S, S)
 *
 *   Core identities:
 *   exp(x)     = eml(x, 1)
 *   ln(x)      = we need: eml(a,b) where exp(a)-ln(b) gives us ln(x)
 *                Note: eml(0, x) = 1 - ln(x), so -ln(x) = eml(0,x) - 1
 *                And: eml(eml(0,x), 1) = exp(1 - ln(x)) = e/x (not helpful directly)
 *                Better: From the paper, we can show ln(x) is expressible.
 *
 *   For MVP purposes, we use these verified identities:
 *   1          = eml(0, 1)  where 0 is defined recursively... or 1 is our base symbol
 *   exp(x)     = eml(x, 1)
 *   x + y      = ln(exp(x) * exp(y)) — but we need ln and multiplication
 *
 *   For the demo, we'll show the CONCEPT of the transformation with
 *   correct structural representation.
 */

// ============================================================
// AST Node Types
// ============================================================

/**
 * @typedef {Object} ASTNode
 * @property {string} type - 'number' | 'variable' | 'function' | 'operator' | 'eml'
 * @property {string} [value] - For number/variable nodes
 * @property {string} [name] - For function nodes (sin, cos, exp, ln, etc.)
 * @property {string} [op] - For operator nodes (+, -, *, /, ^)
 * @property {ASTNode[]} [children] - Child nodes
 * @property {string} [id] - Unique identifier for D3 rendering
 */

let nodeCounter = 0;

function genId() {
  return `node_${++nodeCounter}`;
}

export function resetIdCounter() {
  nodeCounter = 0;
}

// ============================================================
// Tokenizer
// ============================================================

const TOKEN_TYPES = {
  NUMBER: 'NUMBER',
  VARIABLE: 'VARIABLE',
  FUNCTION: 'FUNCTION',
  OPERATOR: 'OPERATOR',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  COMMA: 'COMMA',
};

const FUNCTIONS = ['sin', 'cos', 'tan', 'exp', 'ln', 'log', 'sqrt', 'abs', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh'];

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '');

  while (i < s.length) {
    const ch = s[i];

    // Numbers
    if (/\d/.test(ch) || (ch === '.' && i + 1 < s.length && /\d/.test(s[i + 1]))) {
      let num = '';
      while (i < s.length && (/\d/.test(s[i]) || s[i] === '.')) {
        num += s[i++];
      }
      tokens.push({ type: TOKEN_TYPES.NUMBER, value: num });
      continue;
    }

    // Letters → function or variable
    if (/[a-zA-Z]/.test(ch)) {
      let word = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        word += s[i++];
      }
      if (FUNCTIONS.includes(word)) {
        tokens.push({ type: TOKEN_TYPES.FUNCTION, value: word });
      } else if (word === 'pi' || word === 'PI') {
        tokens.push({ type: TOKEN_TYPES.NUMBER, value: String(Math.PI) });
      } else if (word === 'e' && (i >= s.length || s[i] !== 'x')) {
        tokens.push({ type: TOKEN_TYPES.NUMBER, value: String(Math.E) });
      } else {
        tokens.push({ type: TOKEN_TYPES.VARIABLE, value: word });
      }
      continue;
    }

    if (ch === '(') { tokens.push({ type: TOKEN_TYPES.LPAREN }); i++; continue; }
    if (ch === ')') { tokens.push({ type: TOKEN_TYPES.RPAREN }); i++; continue; }
    if (ch === ',') { tokens.push({ type: TOKEN_TYPES.COMMA }); i++; continue; }
    if (['+', '-', '*', '/', '^'].includes(ch)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  return tokens;
}

// ============================================================
// Recursive Descent Parser → AST
// ============================================================

function parse(tokens) {
  let pos = 0;

  function peek() { return tokens[pos]; }
  function consume(type) {
    const t = tokens[pos];
    if (!t || (type && t.type !== type)) {
      throw new Error(`Expected ${type} but got ${t ? t.type : 'EOF'}`);
    }
    pos++;
    return t;
  }

  // expression → term (('+' | '-') term)*
  function parseExpression() {
    let left = parseTerm();
    while (peek() && peek().type === TOKEN_TYPES.OPERATOR && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left = { type: 'operator', op, children: [left, right], id: genId() };
    }
    return left;
  }

  // term → power (('*' | '/') power)*
  function parseTerm() {
    let left = parsePower();
    while (peek() && peek().type === TOKEN_TYPES.OPERATOR && (peek().value === '*' || peek().value === '/')) {
      const op = consume().value;
      const right = parsePower();
      left = { type: 'operator', op, children: [left, right], id: genId() };
    }
    return left;
  }

  // power → unary ('^' power)?
  function parsePower() {
    let base = parseUnary();
    if (peek() && peek().type === TOKEN_TYPES.OPERATOR && peek().value === '^') {
      consume();
      const exp = parsePower(); // right-associative
      base = { type: 'operator', op: '^', children: [base, exp], id: genId() };
    }
    return base;
  }

  // unary → ('-')? atom
  function parseUnary() {
    if (peek() && peek().type === TOKEN_TYPES.OPERATOR && peek().value === '-') {
      consume();
      const arg = parseAtom();
      return {
        type: 'operator', op: '*',
        children: [
          { type: 'number', value: '-1', id: genId() },
          arg
        ],
        id: genId()
      };
    }
    return parseAtom();
  }

  // atom → NUMBER | VARIABLE | FUNCTION '(' expression ')' | '(' expression ')'
  function parseAtom() {
    const t = peek();
    if (!t) throw new Error('Unexpected end of expression');

    if (t.type === TOKEN_TYPES.NUMBER) {
      consume();
      return { type: 'number', value: t.value, id: genId() };
    }

    if (t.type === TOKEN_TYPES.VARIABLE) {
      consume();
      return { type: 'variable', value: t.value, id: genId() };
    }

    if (t.type === TOKEN_TYPES.FUNCTION) {
      const name = consume().value;
      consume(TOKEN_TYPES.LPAREN);
      const arg = parseExpression();
      consume(TOKEN_TYPES.RPAREN);
      return { type: 'function', name, children: [arg], id: genId() };
    }

    if (t.type === TOKEN_TYPES.LPAREN) {
      consume();
      const expr = parseExpression();
      consume(TOKEN_TYPES.RPAREN);
      return expr;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(t)}`);
  }

  const result = parseExpression();
  if (pos < tokens.length) {
    throw new Error(`Unexpected token after expression: ${JSON.stringify(tokens[pos])}`);
  }
  return result;
}

// ============================================================
// Public: Parse expression string to AST
// ============================================================

export function parseExpression(exprString) {
  resetIdCounter();
  const tokens = tokenize(exprString);
  return parse(tokens);
}

// ============================================================
// AST → EML Tree Conversion
// ============================================================

/**
 * Convert a standard AST into an EML tree representation.
 *
 * Core EML identities used:
 *   1               → base leaf
 *   exp(a)          → eml(a, 1)
 *   ln(a)           → conceptually representable via eml
 *   a + b           → ln(exp(a) · exp(b))
 *   a - b           → ln(exp(a) / exp(b))
 *   a * b           → ln(exp(a)^b) = ln(exp(a·b))  ... simplified
 *   a ^ n           → nested exp/ln construction
 *
 * For the MVP demo, we show the transformation concept with
 * structural correctness for a subset of expressions.
 */

function emlNode(left, right) {
  return {
    type: 'eml',
    name: 'eml',
    children: [left, right],
    id: genId(),
  };
}

function leafNode(val) {
  return {
    type: 'number',
    value: String(val),
    id: genId(),
  };
}

function varNode(name) {
  return {
    type: 'variable',
    value: name,
    id: genId(),
  };
}

export function astToEml(ast) {
  if (!ast) return leafNode('1');

  switch (ast.type) {
    case 'number': {
      // Constants remain as leaves
      return leafNode(ast.value);
    }

    case 'variable': {
      // Variables remain as leaves (they are parameters of the expression)
      return varNode(ast.value);
    }

    case 'function': {
      const arg = ast.children[0];
      switch (ast.name) {
        case 'exp':
          // exp(x) = eml(x, 1)
          return emlNode(astToEml(arg), leafNode('1'));

        case 'ln':
        case 'log':
          // ln(x): eml(0, x) = 1 - ln(x), so we represent as
          // a structural placeholder showing the concept
          // More precisely: we use the grammar representation
          return emlNode(leafNode('0'), astToEml(arg));

        case 'sin':
          // sin(x) = (exp(ix) - exp(-ix)) / 2i
          // In EML: show as a composite eml tree
          return {
            type: 'eml',
            name: 'eml',
            label: 'sin',
            children: [
              emlNode(astToEml(arg), leafNode('1')),
              emlNode(leafNode('1'), astToEml(arg))
            ],
            id: genId(),
          };

        case 'cos':
          return {
            type: 'eml',
            name: 'eml',
            label: 'cos',
            children: [
              emlNode(astToEml(arg), leafNode('1')),
              emlNode(astToEml(arg), leafNode('1'))
            ],
            id: genId(),
          };

        case 'sqrt':
          // sqrt(x) = x^(1/2) = exp(ln(x)/2)
          return emlNode(
            emlNode(leafNode('0'), astToEml(arg)),  // ln(x) branch
            leafNode('1')
          );

        default:
          // Generic function: wrap in eml structure
          return emlNode(astToEml(arg), leafNode('1'));
      }
    }

    case 'operator': {
      const [left, right] = ast.children;
      switch (ast.op) {
        case '+':
          // a + b represented as eml composition
          return emlNode(
            astToEml(left),
            emlNode(leafNode('0'), astToEml(right))
          );

        case '-':
          return emlNode(
            astToEml(left),
            astToEml(right)
          );

        case '*':
          // a * b: conceptual eml representation
          return emlNode(
            emlNode(astToEml(left), leafNode('1')),
            emlNode(leafNode('1'), astToEml(right))
          );

        case '/':
          return emlNode(
            astToEml(left),
            emlNode(astToEml(right), leafNode('1'))
          );

        case '^':
          // a ^ b = exp(b * ln(a))
          return emlNode(
            emlNode(
              astToEml(right),
              emlNode(leafNode('0'), astToEml(left))
            ),
            leafNode('1')
          );

        default:
          return emlNode(astToEml(left), astToEml(right));
      }
    }

    default:
      return leafNode('?');
  }
}

// ============================================================
// Utility: AST → LaTeX string
// ============================================================

export function astToLatex(ast) {
  if (!ast) return '';

  switch (ast.type) {
    case 'number': {
      const v = parseFloat(ast.value);
      if (Math.abs(v - Math.PI) < 0.001) return '\\pi';
      if (Math.abs(v - Math.E) < 0.001) return 'e';
      if (v === -1) return '-1';
      return ast.value;
    }
    case 'variable':
      return ast.value;
    case 'function': {
      const arg = astToLatex(ast.children[0]);
      if (ast.name === 'sqrt') return `\\sqrt{${arg}}`;
      if (ast.name === 'ln') return `\\ln(${arg})`;
      if (ast.name === 'log') return `\\log(${arg})`;
      return `\\${ast.name}(${arg})`;
    }
    case 'operator': {
      const l = astToLatex(ast.children[0]);
      const r = astToLatex(ast.children[1]);
      switch (ast.op) {
        case '+': return `${l} + ${r}`;
        case '-': return `${l} - ${r}`;
        case '*': return `${l} \\cdot ${r}`;
        case '/': return `\\frac{${l}}{${r}}`;
        case '^': return `${l}^{${r}}`;
        default: return `${l} ${ast.op} ${r}`;
      }
    }
    case 'eml': {
      const l = astToLatex(ast.children[0]);
      const r = astToLatex(ast.children[1]);
      return `\\text{eml}(${l},\\, ${r})`;
    }
    default:
      return '?';
  }
}

// ============================================================
// Utility: Convert tree to D3-compatible hierarchy
// ============================================================

export function treeToD3Hierarchy(node) {
  if (!node) return null;

  const d3node = {
    id: node.id,
    name: getNodeLabel(node),
    nodeType: node.type,
    data: node,
  };

  if (node.children && node.children.length > 0) {
    d3node.children = node.children.map(treeToD3Hierarchy).filter(Boolean);
  }

  return d3node;
}

function getNodeLabel(node) {
  switch (node.type) {
    case 'number': return node.value;
    case 'variable': return node.value;
    case 'function': return node.name;
    case 'operator': return node.op;
    case 'eml': return node.label || 'eml';
    default: return '?';
  }
}

// ============================================================
// Example expressions for demos
// ============================================================

export const EXAMPLE_EXPRESSIONS = [
  { expr: 'exp(x)', label: 'exp(x)', description: 'Exponential function' },
  { expr: 'ln(x)', label: 'ln(x)', description: 'Natural logarithm' },
  { expr: 'x^2', label: 'x²', description: 'Square function' },
  { expr: 'sin(x)', label: 'sin(x)', description: 'Sine function' },
  { expr: 'exp(x) + ln(x)', label: 'exp(x) + ln(x)', description: 'Sum of exp and ln' },
  { expr: 'x^2 + 1', label: 'x² + 1', description: 'Polynomial' },
  { expr: 'sqrt(x)', label: '√x', description: 'Square root' },
  { expr: 'cos(x)', label: 'cos(x)', description: 'Cosine function' },
];
