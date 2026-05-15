'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Formula from '@/components/Formula';

const exhibits = [
  {
    id: 'taylor',
    eyebrow: 'Local prediction',
    title: '泰勒公式',
    question: '只知道一个点附近的信息，能不能猜出整条曲线？',
    idea: '高度给起点，斜率给方向，二阶导数给弯曲，更多阶导数继续修误差。',
    formula: 'f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)',
  },
  {
    id: 'newton',
    eyebrow: 'Shape correction',
    title: '平方根迭代',
    question: '怎样在几秒内把 √51 算得很准？',
    idea: '把面积固定为 N 的长方形，两边取平均，长方形就被压向正方形。',
    formula: 'x_{n+1}=\\frac{1}{2}\\left(x_n+\\frac{N}{x_n}\\right)',
  },
  {
    id: 'squeeze',
    eyebrow: 'Boundary thinking',
    title: '夹逼定理',
    question: '看不清一个函数时，能不能用两条更简单的函数夹住它？',
    idea: '上界和下界在同一个点收拢，中间那个再调皮也只能一起收拢。',
    formula: 'g(x)\\le f(x)\\le h(x),\\quad \\lim g=\\lim h=L\\Rightarrow \\lim f=L',
  },
  {
    id: 'eml',
    eyebrow: 'Generative grammar',
    title: 'EML 单一算子',
    question: '一个操作能不能像语法一样生成一族复杂函数？',
    idea: '把 exp 与 ln 收进一个二元算子，再用表达式树不断组合。',
    formula: '\\text{eml}(x,y)=e^x-\\ln(y)',
  },
];

const taylorTerms = [
  { degree: 0, label: '高度', formula: '1' },
  { degree: 1, label: '斜率', formula: '1+x' },
  { degree: 2, label: '弯曲', formula: '1+x+\\frac{x^2}{2}' },
  { degree: 3, label: '三阶修正', formula: '1+x+\\frac{x^2}{2}+\\frac{x^3}{6}' },
  { degree: 4, label: '四阶近似', formula: '1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}' },
  { degree: 5, label: '五阶近似', formula: '1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\frac{x^5}{120}' },
];

const readingPath = [
  ['先问问题', '公式不是从天上掉下来的，它通常在回答一个很具体的麻烦。'],
  ['看几何图', '把符号翻译成长度、面积、斜率、边界或树，抽象会突然变近。'],
  ['试一个数', '用 51、0、sin x 这类小例子跑一遍，比背定义更牢。'],
  ['看误差', '真正的理解不是“算出答案”，而是知道为什么会越来越接近。'],
];

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function taylorExp(x, degree) {
  let total = 0;
  for (let k = 0; k <= degree; k += 1) {
    total += x ** k / factorial(k);
  }
  return total;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildCurvePath(fn, options = {}) {
  const {
    width = 620,
    height = 330,
    padding = 36,
    minX = -2.4,
    maxX = 2.4,
    minY = -1.2,
    maxY = 8.2,
    steps = 160,
  } = options;

  const toX = (x) => padding + ((x - minX) / (maxX - minX)) * (width - padding * 2);
  const toY = (y) => height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2);

  const path = Array.from({ length: steps + 1 }, (_, index) => {
    const x = minX + (index / steps) * (maxX - minX);
    const y = clamp(fn(x), minY, maxY);
    return `${index === 0 ? 'M' : 'L'} ${toX(x).toFixed(2)} ${toY(y).toFixed(2)}`;
  }).join(' ');

  return {
    path,
    width,
    height,
    axisX: toY(0),
    axisY: toX(0),
    originX: toX(0),
    originY: toY(1),
  };
}

function buildRootSteps(number, count) {
  const start = Math.max(1, Math.floor(Math.sqrt(number)));
  const steps = [];
  let guess = start;

  for (let index = 0; index <= count; index += 1) {
    const partner = number / guess;
    const next = (guess + partner) / 2;
    steps.push({
      index,
      guess,
      partner,
      next,
      error: Math.abs(next * next - number),
    });
    guess = next;
  }

  return steps;
}

function Hero() {
  return (
    <section className="atlas-v2-hero">
      <div className="atlas-v2-hero-copy">
        <p className="atlas-kicker">visual math studio</p>
        <h1>把公式讲成<br />一场能看见的推理</h1>
        <p>
          这个网站现在不再只是 EML 的展示页，而是一座数学直觉展馆：
          每个展品都从问题出发，用图像解释逻辑，再用一个可操作例子把公式落地。
        </p>
        <div className="atlas-v2-actions">
          <a className="btn-primary" href="#gallery">进入展馆</a>
          <a className="btn-ghost" href="#newton">先看 √51</a>
        </div>
      </div>

      <div className="atlas-v2-hero-stage" aria-label="数学可视化展馆首屏图">
        <svg viewBox="0 0 620 460" role="img">
          <defs>
            <linearGradient id="heroLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="54%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" d="M60 360 C160 355 210 335 290 278 C370 220 420 120 560 96" />
          <path fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="8 10" d="M60 308 C158 302 238 296 300 278 C390 252 456 204 560 150" />
          <path fill="none" stroke="url(#heroLine)" strokeWidth="6" strokeLinecap="round" d="M60 360 C160 355 210 335 290 278 C370 220 420 120 560 96" />
          <circle fill="#22d3ee" cx="290" cy="278" r="8" />
          <rect fill="rgba(21,23,32,0.92)" stroke="rgba(255,255,255,0.12)" x="72" y="70" width="150" height="92" rx="8" />
          <text x="94" y="106" className="hero-small" fill="#f59e0b">Taylor</text>
          <text x="94" y="134" className="hero-large" fill="#e8e6f0">局部预测</text>
          <rect fill="rgba(21,23,32,0.92)" stroke="rgba(255,255,255,0.12)" x="384" y="286" width="162" height="100" rx="8" />
          <text x="406" y="324" className="hero-small" fill="#f59e0b">Newton</text>
          <text x="406" y="352" className="hero-large" fill="#e8e6f0">形状校正</text>
          <rect fill="rgba(21,23,32,0.92)" stroke="rgba(255,255,255,0.12)" x="254" y="154" width="150" height="86" rx="8" />
          <text x="278" y="188" className="hero-small" fill="#f59e0b">Squeeze</text>
          <text x="278" y="216" className="hero-large" fill="#e8e6f0">边界收拢</text>
        </svg>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="atlas-v2-section">
      <div className="atlas-v2-section-heading">
        <p className="atlas-kicker">exhibit map</p>
        <h2>每个公式都按同一种学习结构展开</h2>
        <p>
          我把内容重新整理成四个展品。你可以从任何一个入口进去，
          但每个入口都保持同样的阅读节奏：问题、直觉、公式、例子。
        </p>
      </div>

      <div className="atlas-v2-gallery">
        {exhibits.map((item, index) => (
          <a key={item.id} className="atlas-v2-exhibit" href={`#${item.id}`}>
            <span className="atlas-v2-index">{String(index + 1).padStart(2, '0')}</span>
            <p>{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <strong>{item.question}</strong>
            <span>{item.idea}</span>
            <div className="atlas-v2-formula">
              <Formula tex={item.formula} displayMode={true} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function TaylorExhibit() {
  const [degree, setDegree] = useState(3);
  const active = taylorTerms[degree];
  const exact = useMemo(() => buildCurvePath((x) => Math.exp(x)), []);
  const approx = useMemo(() => buildCurvePath((x) => taylorExp(x, degree)), [degree]);

  return (
    <section id="taylor" className="atlas-v2-section atlas-v2-split">
      <div>
        <p className="atlas-kicker">exhibit 01 / Taylor</p>
        <h2>泰勒公式：曲线的“局部身份证”</h2>
        <p>
          泰勒公式的逻辑不是硬背一串导数，而是问：如果我站在 x=0，
          只知道曲线在这里的高度、方向和弯曲，我能预测多远？
        </p>
        <div className="atlas-v2-proofline">
          <div><strong>高度</strong><span>f(0) 决定曲线从哪里出发。</span></div>
          <div><strong>斜率</strong><span>f′(0) 决定刚离开这一点时朝哪里走。</span></div>
          <div><strong>弯曲</strong><span>f″(0) 决定它不是直线，而是开始弯。</span></div>
          <div><strong>余项</strong><span>R_n(x) 告诉你“还差多少”，这是可靠性的来源。</span></div>
        </div>
      </div>

      <div className="atlas-v2-workbench">
        <div className="atlas-v2-workbench-head">
          <div>
            <p className="atlas-kicker">example / e^x at 0</p>
            <Formula tex={`e^x \\approx ${active.formula}`} displayMode={true} />
          </div>
          <span>{active.label}</span>
        </div>
        <div className="atlas-v2-stepper" role="group" aria-label="选择泰勒展开阶数">
          {taylorTerms.map((term) => (
            <button
              key={term.degree}
              type="button"
              className={degree === term.degree ? 'active' : ''}
              onClick={() => setDegree(term.degree)}
            >
              {term.degree}阶
            </button>
          ))}
        </div>
        <svg className="atlas-v2-curve" viewBox={`0 0 ${exact.width} ${exact.height}`} role="img" aria-label="泰勒多项式逼近 e 的 x 次方">
          <line x1="36" y1={exact.axisX} x2="584" y2={exact.axisX} className="axis-line" />
          <line x1={exact.axisY} y1="28" x2={exact.axisY} y2="294" className="axis-line" />
          <path d={exact.path} className="exact-path" />
          <path d={approx.path} className="approx-path" />
          <circle cx={exact.originX} cy={exact.originY} r="6" className="anchor-dot" />
          <text x="420" y="66" className="curve-label exact">真实 e^x</text>
          <text x="360" y="266" className="curve-label approx">{degree} 阶泰勒多项式</text>
        </svg>
      </div>
    </section>
  );
}

function NewtonExhibit() {
  const [number, setNumber] = useState(51);
  const [rounds, setRounds] = useState(2);
  const safeNumber = clamp(Number.isFinite(number) ? number : 51, 2, 999);
  const steps = buildRootSteps(safeNumber, rounds);
  const current = steps[steps.length - 1];
  const trueRoot = Math.sqrt(safeNumber);
  const scale = 190 / Math.max(current.guess, current.partner, trueRoot);
  const rectWidth = current.guess * scale;
  const rectHeight = current.partner * scale;
  const squareSide = trueRoot * scale;

  return (
    <section id="newton" className="atlas-v2-section atlas-v2-split reverse">
      <div className="atlas-v2-root-board">
        <div className="atlas-v2-root-controls">
          <label>
            面积 N
            <input
              value={number}
              type="number"
              min="2"
              max="999"
              onChange={(event) => setNumber(Number(event.target.value))}
            />
          </label>
          <div className="atlas-v2-stepper compact" role="group" aria-label="快速选择数字">
            {[49, 51, 97].map((value) => (
              <button key={value} type="button" onClick={() => setNumber(value)}>N={value}</button>
            ))}
          </div>
          <div className="atlas-v2-stepper compact" role="group" aria-label="选择迭代次数">
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                className={rounds === value ? 'active' : ''}
                onClick={() => setRounds(value)}
              >
                {value}次
              </button>
            ))}
          </div>
          <Formula tex={`x_{n+1}=\\frac{1}{2}\\left(x_n+\\frac{${safeNumber.toFixed(0)}}{x_n}\\right)`} displayMode={true} />
        </div>
        <div className="atlas-v2-root-stage">
          <div className="target-square" style={{ width: `${squareSide}px`, height: `${squareSide}px` }} />
          <div className="current-rectangle" style={{ width: `${rectWidth}px`, height: `${rectHeight}px` }} />
        </div>
        <div className="atlas-v2-readout">
          <span>当前估计</span>
          <strong>{current.next.toFixed(8)}</strong>
          <small>真实 √{safeNumber.toFixed(0)} = {trueRoot.toFixed(8)}，平方误差 {current.error.toExponential(2)}</small>
        </div>
      </div>

      <div>
        <p className="atlas-kicker">exhibit 02 / Newton</p>
        <h2>“挤压法”：固定面积，把长方形压成正方形</h2>
        <p>
          视频里的方法本质是牛顿迭代，也常被称作海伦法。它不是玄学速算，
          而是一个反复自我修正的几何动作：一边猜小了，另一边就会偏大，取平均以后两边同时被拉近。
        </p>
        <div className="atlas-v2-iterations">
          {steps.map((step) => (
            <div key={step.index}>
              <span>第 {step.index} 轮</span>
              <strong>{step.guess.toFixed(6)} 和 {step.partner.toFixed(6)}</strong>
              <p>平均后得到 {step.next.toFixed(8)}</p>
            </div>
          ))}
        </div>
        <p className="atlas-v2-note">提醒：49 的平方根是 7；49 的平方是 2401。</p>
      </div>
    </section>
  );
}

function SqueezeExhibit() {
  const squeeze = useMemo(() => {
    const options = { width: 620, height: 330, minX: -2.4, maxX: 2.4, minY: -0.5, maxY: 1.4 };
    return {
      upper: buildCurvePath((x) => Math.abs(x), options),
      lower: buildCurvePath((x) => -Math.abs(x), options),
      middle: buildCurvePath((x) => x === 0 ? 0 : x * Math.sin(1 / x), options),
    };
  }, []);

  return (
    <section id="squeeze" className="atlas-v2-section atlas-v2-split">
      <div>
        <p className="atlas-kicker">exhibit 03 / squeeze theorem</p>
        <h2>夹逼定理：看不清中间，就看两边</h2>
        <p>
          有些函数在某个点附近疯狂振荡，很难直接看极限。夹逼定理提供一种设计思路：
          不和中间那条曲线硬拼，改用两条更容易理解的边界把它夹住。
        </p>
        <div className="atlas-v2-proofline">
          <div><strong>上界</strong><span>找到 h(x)，保证 f(x) 永远不超过它。</span></div>
          <div><strong>下界</strong><span>找到 g(x)，保证 f(x) 永远不低于它。</span></div>
          <div><strong>收口</strong><span>如果 g 和 h 都挤向同一个 L，中间只能跟着去。</span></div>
        </div>
      </div>
      <div className="atlas-v2-workbench">
        <div className="atlas-v2-workbench-head">
          <div>
            <p className="atlas-kicker">example</p>
            <Formula tex={'-|x|\\le x\\sin\\frac{1}{x}\\le |x|'} displayMode={true} />
          </div>
          <span>极限为 0</span>
        </div>
        <svg className="atlas-v2-curve" viewBox="0 0 620 330" role="img" aria-label="夹逼定理上下界示意">
          <line x1="36" y1={squeeze.upper.axisX} x2="584" y2={squeeze.upper.axisX} className="axis-line" />
          <line x1={squeeze.upper.axisY} y1="28" x2={squeeze.upper.axisY} y2="294" className="axis-line" />
          <path d={squeeze.upper.path} className="squeeze-bound upper" />
          <path d={squeeze.lower.path} className="squeeze-bound lower" />
          <path d={squeeze.middle.path} className="squeeze-middle" />
          <text x="398" y="82" className="curve-label exact">上界 |x|</text>
          <text x="398" y="272" className="curve-label approx">下界 -|x|</text>
        </svg>
      </div>
    </section>
  );
}

function EmlExhibit() {
  return (
    <section id="eml" className="atlas-v2-section atlas-v2-split reverse">
      <div className="atlas-v2-eml-board">
        <Formula tex={'\\text{eml}(x,y)=e^x-\\ln(y)'} displayMode={true} />
        <svg viewBox="0 0 520 330" role="img" aria-label="EML 表达式树">
          <line x1="260" y1="56" x2="160" y2="142" />
          <line x1="260" y1="56" x2="360" y2="142" />
          <line x1="160" y1="142" x2="102" y2="252" />
          <line x1="160" y1="142" x2="218" y2="252" />
          <line x1="360" y1="142" x2="302" y2="252" />
          <line x1="360" y1="142" x2="418" y2="252" />
          {[
            [260, 56, 'eml', 'root'],
            [160, 142, 'eml', 'node'],
            [360, 142, 'eml', 'node'],
            [102, 252, 'x', 'leaf'],
            [218, 252, '1', 'leaf'],
            [302, 252, 'x', 'leaf'],
            [418, 252, '1', 'leaf'],
          ].map(([x, y, text, kind]) => (
            <g key={`${x}-${y}`} className={kind}>
              <circle cx={x} cy={y} r={kind === 'leaf' ? 22 : 30} />
              <text x={x} y={y + 6} textAnchor="middle">{text}</text>
            </g>
          ))}
        </svg>
      </div>
      <div>
        <p className="atlas-kicker">exhibit 04 / EML</p>
        <h2>EML：把函数看成一棵生成树</h2>
        <p>
          这个展品保留原网站最有特色的部分：一个二元算子如何递归生成复杂表达式。
          它适合放在汇总站里作为“生成式数学语法”的例子。
        </p>
        <div className="atlas-v2-proofline">
          <div><strong>定义积木</strong><span>先规定唯一操作 eml(x,y)。</span></div>
          <div><strong>替换输入</strong><span>x、常数、另一个 eml 都可以成为子节点。</span></div>
          <div><strong>树状组合</strong><span>复杂函数来自节点之间的嵌套关系。</span></div>
        </div>
        <Link href="/lab" className="atlas-inline-link">进入 EML 表达式实验室</Link>
      </div>
    </section>
  );
}

function ReadingGuide() {
  return (
    <section id="method" className="atlas-v2-section">
      <div className="atlas-v2-section-heading">
        <p className="atlas-kicker">how to read</p>
        <h2>给新手的读法：别急着背，先把动作看懂</h2>
        <p>
          数学可视化的价值不是把公式装饰得更漂亮，而是把“为什么这样做”暴露出来。
          这个站点之后可以继续扩展微积分、概率、线性代数和数论展品。
        </p>
      </div>
      <div className="atlas-v2-reading-grid">
        {readingPath.map(([title, body], index) => (
          <div key={title}>
            <span>{index + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MathAtlas() {
  return (
    <>
      <Hero />
      <Gallery />
      <TaylorExhibit />
      <NewtonExhibit />
      <SqueezeExhibit />
      <EmlExhibit />
      <ReadingGuide />
    </>
  );
}
