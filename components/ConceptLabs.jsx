'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Formula from '@/components/Formula';

const labs = [
  { id: 'taylor', label: '泰勒', title: '泰勒公式实验室' },
  { id: 'derivative', label: '导数', title: '割线变切线实验室' },
  { id: 'newton', label: '平方根', title: '平方根迭代实验室' },
  { id: 'squeeze', label: '夹逼', title: '夹逼定理实验室' },
  { id: 'eml', label: 'EML', title: 'EML 树实验室' },
];

const functionModels = {
  exp: {
    name: 'e^x',
    tex: 'e^x',
    exact: (x) => Math.exp(x),
    derivative: (order, a) => Math.exp(a),
    minX: -2.5,
    maxX: 2.5,
    minY: -2,
    maxY: 9,
    note: '指数函数最适合入门：每一阶导数仍然是 e^x，所以每多一项都在补同一种增长。',
  },
  sin: {
    name: 'sin x',
    tex: '\\sin x',
    exact: (x) => Math.sin(x),
    derivative: (order, a) => {
      const cycle = [Math.sin, Math.cos, (value) => -Math.sin(value), (value) => -Math.cos(value)];
      return cycle[order % 4](a);
    },
    minX: -Math.PI * 1.4,
    maxX: Math.PI * 1.4,
    minY: -2,
    maxY: 2,
    note: 'sin 的展开会交替出现奇数次幂。你可以移动展开中心，看局部近似怎样跟着平移。',
  },
  cos: {
    name: 'cos x',
    tex: '\\cos x',
    exact: (x) => Math.cos(x),
    derivative: (order, a) => {
      const cycle = [Math.cos, (value) => -Math.sin(value), (value) => -Math.cos(value), Math.sin];
      return cycle[order % 4](a);
    },
    minX: -Math.PI * 1.4,
    maxX: Math.PI * 1.4,
    minY: -2,
    maxY: 2,
    note: 'cos 在 0 附近的偶函数结构很明显：0、2、4、6 阶会越来越像原曲线。',
  },
  log1p: {
    name: 'ln(1+x)',
    tex: '\\ln(1+x)',
    exact: (x) => Math.log1p(x),
    derivative: (order, a) => {
      if (order === 0) return Math.log1p(a);
      const sign = order % 2 === 1 ? 1 : -1;
      return (sign * factorial(order - 1)) / ((1 + a) ** order);
    },
    minX: -0.85,
    maxX: 2.5,
    minY: -2.4,
    maxY: 1.8,
    centerMin: -0.6,
    centerMax: 1.4,
    defaultProbe: 0.8,
    note: '对数函数很适合观察“有效范围”：在 x=-1 附近有边界，展开中心越靠近边界，低阶近似越容易失真。',
  },
  sqrt1p: {
    name: 'sqrt(1+x)',
    tex: '\\sqrt{1+x}',
    exact: (x) => Math.sqrt(1 + x),
    derivative: (order, a) => {
      if (order === 0) return Math.sqrt(1 + a);
      return fallingCoefficient(0.5, order) * ((1 + a) ** (0.5 - order));
    },
    minX: -0.88,
    maxX: 2.8,
    minY: -0.2,
    maxY: 2.3,
    centerMin: -0.6,
    centerMax: 1.5,
    defaultProbe: 1,
    note: '根号函数的高阶项会不断修正弯曲程度；把测试点拖到左边，可以看到它对定义域边界非常敏感。',
  },
  cosh: {
    name: 'cosh x',
    tex: '\\cosh x',
    exact: (x) => Math.cosh(x),
    derivative: (order, a) => (order % 2 === 0 ? Math.cosh(a) : Math.sinh(a)),
    minX: -2.4,
    maxX: 2.4,
    minY: -0.5,
    maxY: 5.8,
    defaultProbe: 1.2,
    note: 'cosh 是偶函数，围绕 0 展开时只留下偶数次项；它能帮你把“对称性”和泰勒项联系起来。',
  },
  cubic: {
    name: 'x^3 - 2x + 1',
    tex: 'x^3-2x+1',
    exact: (x) => (x ** 3) - (2 * x) + 1,
    derivative: (order, a) => {
      if (order === 0) return (a ** 3) - (2 * a) + 1;
      if (order === 1) return (3 * (a ** 2)) - 2;
      if (order === 2) return 6 * a;
      if (order === 3) return 6;
      return 0;
    },
    minX: -2.2,
    maxX: 2.2,
    minY: -5.8,
    maxY: 8,
    defaultProbe: 1.4,
    note: '多项式是一个反例式的好教材：阶数达到 3 以后，泰勒多项式不再只是近似，而是完全等于原函数。',
  },
  rational: {
    name: '1/(1-x)',
    tex: '\\frac{1}{1-x}',
    exact: (x) => 1 / (1 - x),
    derivative: (order, a) => factorial(order) / ((1 - a) ** (order + 1)),
    minX: -2,
    maxX: 0.86,
    minY: -1,
    maxY: 8,
    note: '这个例子提醒你：泰勒多项式有有效半径。靠近 x=1 的竖直渐近线时，低阶近似会迅速失控。',
  },
};

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function fallingCoefficient(base, order) {
  let result = 1;
  for (let i = 0; i < order; i += 1) result *= base - i;
  return result;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function taylorValue(model, x, center, degree) {
  let total = 0;
  for (let k = 0; k <= degree; k += 1) {
    total += (model.derivative(k, center) / factorial(k)) * ((x - center) ** k);
  }
  return total;
}

function makePath(fn, bounds) {
  const width = 680;
  const height = 380;
  const padding = 38;
  const steps = 180;
  const { minX, maxX, minY, maxY } = bounds;
  const toX = (x) => padding + ((x - minX) / (maxX - minX)) * (width - padding * 2);
  const toY = (y) => height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2);
  const path = Array.from({ length: steps + 1 }, (_, index) => {
    const x = minX + (index / steps) * (maxX - minX);
    const y = clamp(fn(x), minY, maxY);
    return `${index === 0 ? 'M' : 'L'} ${toX(x).toFixed(2)} ${toY(y).toFixed(2)}`;
  }).join(' ');

  return { width, height, path, toX, toY, axisX: toY(0), axisY: toX(0) };
}

function buildTaylorFormula(model, center, degree) {
  if (Math.abs(center) < 0.001) {
    if (model.name === 'e^x') return `e^x\\approx \\sum_{k=0}^{${degree}}\\frac{x^k}{k!}`;
    if (model.name === 'sin x') {
      if (degree === 0) return '\\sin x\\approx 0';
      return `\\sin x\\approx \\sum_{k=0}^{${Math.floor((degree - 1) / 2)}}(-1)^k\\frac{x^{2k+1}}{(2k+1)!}`;
    }
    if (model.name === 'cos x') return `\\cos x\\approx \\sum_{k=0}^{${Math.floor(degree / 2)}}(-1)^k\\frac{x^{2k}}{(2k)!}`;
    if (model.name === 'ln(1+x)') {
      if (degree === 0) return '\\ln(1+x)\\approx 0';
      return `\\ln(1+x)\\approx \\sum_{k=1}^{${degree}}(-1)^{k+1}\\frac{x^k}{k}`;
    }
    if (model.name === 'sqrt(1+x)') return `\\sqrt{1+x}\\approx \\sum_{k=0}^{${degree}}\\binom{1/2}{k}x^k`;
    if (model.name === 'cosh x') return `\\cosh x\\approx \\sum_{k=0}^{${Math.floor(degree / 2)}}\\frac{x^{2k}}{(2k)!}`;
  }

  return `${model.tex}\\approx \\sum_{k=0}^{${degree}}\\frac{f^{(k)}(${center.toFixed(1)})}{k!}(x-${center.toFixed(1)})^k`;
}

function TaylorLab() {
  const [modelKey, setModelKey] = useState('exp');
  const [degree, setDegree] = useState(3);
  const [center, setCenter] = useState(0);
  const [probe, setProbe] = useState(1);
  const model = functionModels[modelKey];

  const centerRange = useMemo(() => ({
    min: model.centerMin ?? Math.max(model.minX + 0.2, -1.5),
    max: model.centerMax ?? Math.min(model.maxX - 0.2, 1.5),
  }), [model]);

  const probeRange = useMemo(() => ({
    min: model.probeMin ?? model.minX,
    max: model.probeMax ?? model.maxX,
  }), [model]);

  const bounds = useMemo(() => ({
    minX: model.minX,
    maxX: model.maxX,
    minY: model.minY,
    maxY: model.maxY,
  }), [model]);

  const activeCenter = clamp(center, centerRange.min, centerRange.max);
  const activeProbe = clamp(probe, probeRange.min, probeRange.max);
  const exact = model.exact(activeProbe);
  const approx = taylorValue(model, activeProbe, activeCenter, degree);
  const error = Math.abs(exact - approx);
  const exactPath = makePath((x) => model.exact(x), bounds);
  const approxPath = makePath((x) => taylorValue(model, x, activeCenter, degree), bounds);
  const chart = { ...exactPath, exactPath: exactPath.path, approxPath: approxPath.path };

  const centerX = chart.toX(activeCenter);
  const centerY = chart.toY(clamp(model.exact(activeCenter), bounds.minY, bounds.maxY));
  const probeX = chart.toX(activeProbe);
  const probeExactY = chart.toY(clamp(exact, bounds.minY, bounds.maxY));
  const probeApproxY = chart.toY(clamp(approx, bounds.minY, bounds.maxY));
  const handleModelChange = (event) => {
    const nextModel = functionModels[event.target.value];
    setModelKey(event.target.value);
    setCenter(nextModel.defaultCenter ?? 0);
    setProbe(nextModel.defaultProbe ?? 1);
  };

  return (
    <div className="concept-lab-panel">
      <aside className="concept-lab-controls">
        <p className="atlas-kicker">Taylor controls</p>
        <h2>改变函数、阶数和展开中心</h2>
        <p>观察橙色多项式怎样在展开中心附近贴住真实曲线，离得越远误差怎样变大。</p>

        <label>
          函数
          <select value={modelKey} onChange={handleModelChange}>
            {Object.entries(functionModels).map(([key, item]) => (
              <option key={key} value={key}>{item.name}</option>
            ))}
          </select>
        </label>

        <label>
          展开阶数：{degree}
          <input type="range" min="0" max="8" value={degree} onChange={(event) => setDegree(Number(event.target.value))} />
        </label>

        <label>
          展开中心 a：{activeCenter.toFixed(1)}
          <input type="range" min={centerRange.min} max={centerRange.max} step="0.1" value={activeCenter} onChange={(event) => setCenter(Number(event.target.value))} />
        </label>

        <label>
          测试点 x：{activeProbe.toFixed(1)}
          <input type="range" min={probeRange.min} max={probeRange.max} step="0.1" value={activeProbe} onChange={(event) => setProbe(Number(event.target.value))} />
        </label>

        <div className="concept-lab-formula">
          <Formula tex={buildTaylorFormula(model, activeCenter, degree)} displayMode={true} />
        </div>
        <p className="concept-lab-note">{model.note}</p>
      </aside>

      <section className="concept-lab-stage">
        <div className="concept-lab-readout">
          <div><span>真实值</span><strong>{exact.toFixed(6)}</strong></div>
          <div><span>近似值</span><strong>{approx.toFixed(6)}</strong></div>
          <div><span>误差</span><strong>{error.toExponential(2)}</strong></div>
        </div>
        <svg className="concept-lab-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="泰勒公式实验曲线">
          <line x1="38" y1={chart.axisX} x2="642" y2={chart.axisX} className="axis-line" />
          <line x1={chart.axisY} y1="38" x2={chart.axisY} y2="342" className="axis-line" />
          <path d={chart.exactPath} className="exact-path" />
          <path d={chart.approxPath} className="approx-path" />
          <line x1={centerX} y1="38" x2={centerX} y2="342" className="lab-guide-line" />
          <line x1={probeX} y1={probeExactY} x2={probeX} y2={probeApproxY} className="lab-error-line" />
          <circle cx={centerX} cy={centerY} r="6" className="anchor-dot" />
          <circle cx={probeX} cy={probeExactY} r="5" className="lab-probe exact" />
          <circle cx={probeX} cy={probeApproxY} r="5" className="lab-probe approx" />
          <text x="470" y="72" className="curve-label exact">真实函数</text>
          <text x="450" y="318" className="curve-label approx">泰勒多项式</text>
        </svg>
      </section>
    </div>
  );
}

function DerivativeLab() {
  const [modelKey, setModelKey] = useState('sin');
  const [point, setPoint] = useState(0.7);
  const [gap, setGap] = useState(1);
  const model = functionModels[modelKey];
  const bounds = useMemo(() => ({
    minX: model.minX,
    maxX: model.maxX,
    minY: model.minY,
    maxY: model.maxY,
  }), [model]);

  const anchorX = clamp(point, bounds.minX + 0.15, bounds.maxX - 0.15);
  const secondX = clamp(anchorX + gap, bounds.minX + 0.05, bounds.maxX - 0.05);
  const effectiveGap = secondX - anchorX || 0.001;
  const anchorY = model.exact(anchorX);
  const secondY = model.exact(secondX);
  const secantSlope = (secondY - anchorY) / effectiveGap;
  const tangentSlope = model.derivative(1, anchorX);
  const slopeError = Math.abs(secantSlope - tangentSlope);

  const chart = useMemo(() => makePath((x) => model.exact(x), bounds), [model, bounds]);
  const linePath = (slope) => {
    const leftY = anchorY + slope * (bounds.minX - anchorX);
    const rightY = anchorY + slope * (bounds.maxX - anchorX);
    return `M ${chart.toX(bounds.minX).toFixed(2)} ${chart.toY(clamp(leftY, bounds.minY, bounds.maxY)).toFixed(2)} L ${chart.toX(bounds.maxX).toFixed(2)} ${chart.toY(clamp(rightY, bounds.minY, bounds.maxY)).toFixed(2)}`;
  };

  const anchorScreenX = chart.toX(anchorX);
  const anchorScreenY = chart.toY(clamp(anchorY, bounds.minY, bounds.maxY));
  const secondScreenX = chart.toX(secondX);
  const secondScreenY = chart.toY(clamp(secondY, bounds.minY, bounds.maxY));

  return (
    <div className="concept-lab-panel">
      <aside className="concept-lab-controls">
        <p className="atlas-kicker">Derivative controls</p>
        <h2>让割线慢慢变成切线</h2>
        <p>导数不是一个神秘符号，它是两个点靠得越来越近时，平均变化率留下来的极限。</p>

        <label>
          函数
          <select value={modelKey} onChange={(event) => setModelKey(event.target.value)}>
            {Object.entries(functionModels).map(([key, item]) => (
              <option key={key} value={key}>{item.name}</option>
            ))}
          </select>
        </label>

        <label>
          观察点 a：{anchorX.toFixed(2)}
          <input type="range" min={bounds.minX + 0.2} max={bounds.maxX - 0.2} step="0.05" value={point} onChange={(event) => setPoint(Number(event.target.value))} />
        </label>

        <label>
          两点距离 h：{Math.abs(effectiveGap).toFixed(2)}
          <input type="range" min="0.05" max="1.8" step="0.05" value={gap} onChange={(event) => setGap(Number(event.target.value))} />
        </label>

        <div className="concept-lab-formula">
          <Formula tex={"f'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}"} displayMode={true} />
        </div>
        <p className="concept-lab-note">把 h 往小拖，蓝色割线会贴近绿色切线；泰勒公式的一阶项就是这条切线。</p>
      </aside>

      <section className="concept-lab-stage">
        <div className="concept-lab-readout">
          <div><span>割线斜率</span><strong>{secantSlope.toFixed(6)}</strong></div>
          <div><span>切线斜率</span><strong>{tangentSlope.toFixed(6)}</strong></div>
          <div><span>斜率差</span><strong>{slopeError.toExponential(2)}</strong></div>
        </div>
        <svg className="concept-lab-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="导数实验曲线">
          <line x1="38" y1={chart.axisX} x2="642" y2={chart.axisX} className="axis-line" />
          <line x1={chart.axisY} y1="38" x2={chart.axisY} y2="342" className="axis-line" />
          <path d={chart.path} className="exact-path" />
          <path d={linePath(tangentSlope)} className="derivative-tangent" />
          <path d={linePath(secantSlope)} className="derivative-secant" />
          <line x1={anchorScreenX} y1={anchorScreenY} x2={secondScreenX} y2={secondScreenY} className="lab-error-line" />
          <circle cx={anchorScreenX} cy={anchorScreenY} r="6" className="anchor-dot" />
          <circle cx={secondScreenX} cy={secondScreenY} r="6" className="lab-probe approx" />
          <text x="430" y="78" className="curve-label exact">函数曲线</text>
          <text x="410" y="118" className="curve-label derivative">切线</text>
          <text x="410" y="154" className="curve-label approx">割线</text>
        </svg>
      </section>
    </div>
  );
}

function buildRootSteps(number, iterations) {
  const steps = [];
  let guess = Math.max(1, Math.floor(Math.sqrt(number)));
  for (let index = 0; index <= iterations; index += 1) {
    const partner = number / guess;
    const next = (guess + partner) / 2;
    steps.push({ index, guess, partner, next, error: Math.abs(next * next - number) });
    guess = next;
  }
  return steps;
}

function NewtonLab() {
  const [number, setNumber] = useState(51);
  const [iterations, setIterations] = useState(3);
  const safeNumber = clamp(number || 51, 2, 999);
  const steps = buildRootSteps(safeNumber, iterations);
  const current = steps[steps.length - 1];
  const root = Math.sqrt(safeNumber);
  const scale = 210 / Math.max(root, current.guess, current.partner);
  const width = current.guess * scale;
  const height = current.partner * scale;
  const square = root * scale;

  return (
    <div className="concept-lab-panel">
      <aside className="concept-lab-controls">
        <p className="atlas-kicker">Newton controls</p>
        <h2>用面积反复修正平方根</h2>
        <p>把 N 看成长方形面积。你猜一条边，另一条边就是 N 除以它；两边取平均后，形状更接近正方形。</p>
        <label>
          面积 N
          <input type="number" min="2" max="999" value={number} onChange={(event) => setNumber(Number(event.target.value))} />
        </label>
        <div className="concept-button-row">
          {[49, 51, 97, 222].map((value) => (
            <button key={value} type="button" onClick={() => setNumber(value)}>N={value}</button>
          ))}
        </div>
        <label>
          迭代次数：{iterations}
          <input type="range" min="0" max="6" value={iterations} onChange={(event) => setIterations(Number(event.target.value))} />
        </label>
        <div className="concept-lab-formula">
          <Formula tex={`x_{n+1}=\\frac{1}{2}\\left(x_n+\\frac{${safeNumber.toFixed(0)}}{x_n}\\right)`} displayMode={true} />
        </div>
      </aside>

      <section className="concept-lab-stage">
        <div className="concept-root-grid">
          <div className="concept-root-shape">
            <div className="target-square" style={{ width: `${square}px`, height: `${square}px` }} />
            <div className="current-rectangle" style={{ width: `${width}px`, height: `${height}px` }} />
          </div>
          <div className="concept-lab-readout stacked">
            <div><span>当前估计</span><strong>{current.next.toFixed(8)}</strong></div>
            <div><span>真实平方根</span><strong>{root.toFixed(8)}</strong></div>
            <div><span>平方误差</span><strong>{current.error.toExponential(2)}</strong></div>
          </div>
        </div>
        <div className="concept-iteration-list">
          {steps.map((step) => (
            <div key={step.index}>
              <span>第 {step.index} 轮</span>
              <strong>{step.guess.toFixed(6)} 和 {step.partner.toFixed(6)}</strong>
              <p>平均后得到 {step.next.toFixed(8)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SqueezeLab() {
  const [frequency, setFrequency] = useState(1);
  const [power, setPower] = useState(1);
  const [windowSize, setWindowSize] = useState(2);
  const bounds = useMemo(() => ({
    minX: -windowSize,
    maxX: windowSize,
    minY: -2.2,
    maxY: 2.2,
  }), [windowSize]);
  const chart = useMemo(() => {
    const upper = makePath((x) => Math.abs(x) ** power, bounds);
    const lower = makePath((x) => -(Math.abs(x) ** power), bounds);
    const middle = makePath((x) => (x === 0 ? 0 : (Math.abs(x) ** power) * Math.sin(frequency / x)), bounds);
    return { ...upper, upper: upper.path, lower: lower.path, middle: middle.path };
  }, [frequency, power, bounds]);

  return (
    <div className="concept-lab-panel">
      <aside className="concept-lab-controls">
        <p className="atlas-kicker">Squeeze controls</p>
        <h2>把振荡函数关进边界里</h2>
        <p>蓝色曲线可以疯狂振荡，但只要绿色和橙色边界同时收向 0，它就被迫一起收向 0。</p>
        <label>
          振荡频率：{frequency.toFixed(1)}
          <input type="range" min="0.5" max="5" step="0.1" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} />
        </label>
        <label>
          边界幂次：{power.toFixed(1)}
          <input type="range" min="0.5" max="2" step="0.1" value={power} onChange={(event) => setPower(Number(event.target.value))} />
        </label>
        <label>
          观察窗口：±{windowSize.toFixed(1)}
          <input type="range" min="0.5" max="3" step="0.1" value={windowSize} onChange={(event) => setWindowSize(Number(event.target.value))} />
        </label>
        <div className="concept-lab-formula">
          <Formula tex={`-|x|^{${power.toFixed(1)}}\\le |x|^{${power.toFixed(1)}}\\sin\\frac{${frequency.toFixed(1)}}{x}\\le |x|^{${power.toFixed(1)}}`} displayMode={true} />
        </div>
        <p className="concept-lab-note">拖小观察窗口时，注意上下边界怎样在 0 附近收口。</p>
      </aside>

      <section className="concept-lab-stage">
        <svg className="concept-lab-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="夹逼定理实验曲线">
          <line x1="38" y1={chart.axisX} x2="642" y2={chart.axisX} className="axis-line" />
          <line x1={chart.axisY} y1="38" x2={chart.axisY} y2="342" className="axis-line" />
          <path d={chart.upper} className="squeeze-bound upper" />
          <path d={chart.lower} className="squeeze-bound lower" />
          <path d={chart.middle} className="squeeze-middle" />
          <text x="455" y="98" className="curve-label exact">上界</text>
          <text x="455" y="302" className="curve-label approx">下界</text>
        </svg>
        <div className="concept-lab-readout">
          <div><span>结论</span><strong>极限为 0</strong></div>
          <div><span>逻辑</span><strong>两边收口</strong></div>
          <div><span>中间</span><strong>只能跟随</strong></div>
        </div>
      </section>
    </div>
  );
}

function EmlLabCard() {
  return (
    <div className="concept-lab-panel">
      <aside className="concept-lab-controls">
        <p className="atlas-kicker">EML tree lab</p>
        <h2>现有的 EML 实验室继续保留</h2>
        <p>这里不重复造一个简化版，而是把用户送到已有的表达式树实验室：输入函数，看 AST 如何被转换成 EML 树。</p>
        <div className="concept-lab-formula">
          <Formula tex={'\\text{eml}(x,y)=e^x-\\ln(y)'} displayMode={true} />
        </div>
        <Link className="atlas-inline-link" href="/lab">打开 EML 树实验室</Link>
      </aside>
      <section className="concept-lab-stage concept-eml-preview">
        <svg viewBox="0 0 560 360" role="img" aria-label="EML 树预览">
          <line x1="280" y1="60" x2="180" y2="160" />
          <line x1="280" y1="60" x2="380" y2="160" />
          <line x1="180" y1="160" x2="130" y2="280" />
          <line x1="180" y1="160" x2="230" y2="280" />
          <line x1="380" y1="160" x2="330" y2="280" />
          <line x1="380" y1="160" x2="430" y2="280" />
          {[
            [280, 60, 'eml'], [180, 160, 'eml'], [380, 160, 'eml'],
            [130, 280, 'x'], [230, 280, '1'], [330, 280, 'x'], [430, 280, '1'],
          ].map(([x, y, text]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r={text === 'eml' ? 34 : 25} />
              <text x={x} y={y + 7} textAnchor="middle">{text}</text>
            </g>
          ))}
        </svg>
      </section>
    </div>
  );
}

export default function ConceptLabs() {
  const [activeLab, setActiveLab] = useState('taylor');
  const active = labs.find((lab) => lab.id === activeLab);

  return (
    <main className="concept-labs-page">
      <section className="concept-labs-hero">
        <p className="atlas-kicker">interactive formula labs</p>
        <h1>数学公式实验室</h1>
        <p>这里专门给用户动手：拖动参数、观察误差、改变边界和迭代次数。理解不是只看讲解，而是亲手把公式推一遍。</p>
      </section>

      <nav className="concept-lab-tabs" aria-label="实验室切换">
        {labs.map((lab) => (
          <button
            key={lab.id}
            type="button"
            className={activeLab === lab.id ? 'active' : ''}
            onClick={() => setActiveLab(lab.id)}
          >
            <span>{lab.label}</span>
            <strong>{lab.title}</strong>
          </button>
        ))}
      </nav>

      <section className="concept-lab-shell" aria-label={active?.title}>
        {activeLab === 'taylor' && <TaylorLab />}
        {activeLab === 'derivative' && <DerivativeLab />}
        {activeLab === 'newton' && <NewtonLab />}
        {activeLab === 'squeeze' && <SqueezeLab />}
        {activeLab === 'eml' && <EmlLabCard />}
      </section>
    </main>
  );
}
