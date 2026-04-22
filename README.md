# All-in-One: All elementary functions from a single binary operator

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=flat-square&logo=vercel)](https://dsy1412.dev/eml)
[![Research](https://img.shields.io/badge/Research-arXiv%3A2603.21852-B31B1B?style=flat-square)](https://arxiv.org/abs/2603.21852)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

An interactive, academic scrollytelling visualization demonstrating how all elementary functions — including exponential, logarithmic, trigonometric, and algebraic — can be generated from a single binary operator:

$$eml(x, y) = e^x - \ln(y)$$

## 🔗 Live Demo

- **Main Article:** [dsy1412.dev/eml](https://dsy1412.dev/eml)
- **Interactive Lab:** [dsy1412.dev/eml/lab](https://dsy1412.dev/eml/lab)

---

## 📖 Background

In Boolean logic, the **NAND** gate is functionally complete: a single primitive can construct every possible logical function. This project explores the same concept for continuous mathematics.

Based on the research paper **"All elementary functions from a single binary operator"** (arXiv:2603.21852), this site visualizes the functional completeness of the EML operator.

## 🚀 Key Features

- **Cinematic Scrollytelling:** Narrative journey explaining the mathematical foundation using GSAP and Framer Motion.
- **Recursive Grammar Visualization:** Interactive demonstration of the binary grammar $S \to 1 \mid eml(S, S)$.
- **Transformation Pipeline:** Real-time conversion of standard mathematical expressions into their EML tree representations.
- **Interactive Lab:** A playground to test any expression, visualize its AST vs EML structure, and inspect individual nodes.
- **Academic Design:** High-fidelity "Dark Academic" aesthetic with KaTeX-rendered formulas and D3.js tree visualizations.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS (Custom Dark Academic Design System)
- **Animation:** GSAP (Scroll-driven), Motion for React (Layout transitions)
- **Visualization:** D3.js (Tree hierarchies)
- **Math:** KaTeX (LaTeX rendering), Custom recursive-descent parser
- **State:** Zustand

## 🧑‍🔬 Credits & Attribution

This is an independent interactive implementation and educational project. The core mathematical concept and the $eml(x, y)$ operator were discovered and formulated in the paper:

> **"All elementary functions from a single binary operator"**
> *arXiv:2603.21852 [cs.SC], 2026.*

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
