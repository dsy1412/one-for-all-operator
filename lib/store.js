import { create } from 'zustand';
import { parseExpression, astToEml, astToLatex, treeToD3Hierarchy, resetIdCounter } from './mathEngine';

const useExpressionStore = create((set, get) => ({
  // Raw input
  rawExpression: 'exp(x)',
  
  // Parsed data
  ast: null,
  emlTree: null,
  d3AstData: null,
  d3EmlData: null,
  latexOriginal: '',
  latexEml: '',
  
  // State
  error: null,
  activeNodeId: null,
  viewMode: 'eml', // 'ast' | 'eml'
  
  // Actions
  setRawExpression: (expr) => {
    set({ rawExpression: expr, error: null });
    // Debounce parse
    clearTimeout(get()._parseTimeout);
    const timeout = setTimeout(() => {
      get().parseAndConvert(expr);
    }, 300);
    set({ _parseTimeout: timeout });
  },
  
  parseAndConvert: (expr) => {
    try {
      resetIdCounter();
      const ast = parseExpression(expr);
      const latexOriginal = astToLatex(ast);
      const d3AstData = treeToD3Hierarchy(ast);
      
      resetIdCounter();
      const ast2 = parseExpression(expr);
      const emlTree = astToEml(ast2);
      const latexEml = astToLatex(emlTree);
      const d3EmlData = treeToD3Hierarchy(emlTree);
      
      set({
        ast,
        emlTree,
        d3AstData,
        d3EmlData,
        latexOriginal,
        latexEml,
        error: null,
      });
    } catch (e) {
      set({
        error: e.message,
        ast: null,
        emlTree: null,
        d3AstData: null,
        d3EmlData: null,
        latexOriginal: '',
        latexEml: '',
      });
    }
  },
  
  setActiveNode: (nodeId) => set({ activeNodeId: nodeId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // Internal
  _parseTimeout: null,
}));

export default useExpressionStore;
