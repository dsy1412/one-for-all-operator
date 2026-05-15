'use client';

import Link from 'next/link';
import MathAtlas from '@/components/MathAtlas';

export default function Home() {
  return (
    <main>
      <MathAtlas />
      <footer className="atlas-footer">
        <div>
          <p className="atlas-kicker">Interactive Math Atlas</p>
          <p>
            从泰勒公式、平方根迭代、夹逼定理到 EML：这个站点把抽象公式改写成能看见、
            能试探、能被新手顺着逻辑读懂的数学展馆。
          </p>
        </div>
        <Link href="/labs" className="atlas-footer-link">
          进入数学公式实验室
        </Link>
      </footer>
    </main>
  );
}
