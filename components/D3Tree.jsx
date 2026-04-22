'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const NODE_COLORS = {
  eml: '#6c63ff',
  number: '#34d399',
  variable: '#f59e0b',
  operator: '#f472b6',
  function: '#22d3ee',
};

const NODE_RADIUS = {
  eml: 22,
  number: 16,
  variable: 18,
  operator: 18,
  function: 20,
};

export default function D3Tree({
  data,
  width = 700,
  height = 500,
  onNodeClick,
  activeNodeId,
  className = '',
}) {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);

  const renderTree = useCallback(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create a group for zoom/pan
    const g = svg.append('g');
    gRef.current = g;

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Create hierarchy
    const root = d3.hierarchy(data);
    
    // Tree layout
    const treeLayout = d3.tree()
      .size([width - 100, height - 120])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.8));

    treeLayout(root);

    // Center the tree
    const initialTransform = d3.zoomIdentity
      .translate(50, 60)
      .scale(0.9);
    svg.call(zoom.transform, initialTransform);

    // Links
    const links = g.selectAll('.tree-link')
      .data(root.links())
      .join('path')
      .attr('class', 'tree-link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none');

    // Animate links
    links.each(function () {
      const totalLength = this.getTotalLength();
      d3.select(this)
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .delay((_, i) => i * 60)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', 0)
        .attr('stroke', 'rgba(255,255,255,0.12)');
    });

    // Nodes
    const nodes = g.selectAll('.tree-node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'tree-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d.data);
      });

    // Node background glow
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => {
        const color = NODE_COLORS[d.data.nodeType] || '#6c63ff';
        return color;
      })
      .attr('opacity', 0.15)
      .attr('filter', 'blur(8px)')
      .transition()
      .duration(600)
      .delay((_, i) => i * 50 + 200)
      .attr('r', d => (NODE_RADIUS[d.data.nodeType] || 18) + 10);

    // Node circle
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => {
        const color = NODE_COLORS[d.data.nodeType] || '#6c63ff';
        return `${color}22`;
      })
      .attr('stroke', d => NODE_COLORS[d.data.nodeType] || '#6c63ff')
      .attr('stroke-width', d => {
        if (activeNodeId && d.data.id === activeNodeId) return 3;
        return 1.5;
      })
      .transition()
      .duration(500)
      .delay((_, i) => i * 50 + 200)
      .ease(d3.easeBackOut.overshoot(1.2))
      .attr('r', d => NODE_RADIUS[d.data.nodeType] || 18);

    // Node label
    nodes.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', d => NODE_COLORS[d.data.nodeType] || '#e8e6f0')
      .attr('font-family', '"JetBrains Mono", monospace')
      .attr('font-size', d => d.data.nodeType === 'eml' ? '11px' : '11px')
      .attr('font-weight', 600)
      .text(d => d.data.name)
      .attr('opacity', 0)
      .transition()
      .duration(400)
      .delay((_, i) => i * 50 + 400)
      .attr('opacity', 1);

    // Hover effects
    nodes.on('mouseenter', function (event, d) {
      d3.select(this).select('circle:nth-child(2)')
        .transition().duration(200)
        .attr('r', (NODE_RADIUS[d.data.nodeType] || 18) + 4)
        .attr('stroke-width', 2.5);
    }).on('mouseleave', function (event, d) {
      d3.select(this).select('circle:nth-child(2)')
        .transition().duration(200)
        .attr('r', NODE_RADIUS[d.data.nodeType] || 18)
        .attr('stroke-width', 1.5);
    });

  }, [data, width, height, onNodeClick, activeNodeId]);

  useEffect(() => {
    renderTree();
  }, [renderTree]);

  return (
    <div className={`tree-container ${className}`} style={{ width, height, position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          background: 'transparent',
          borderRadius: '1rem',
        }}
      />
    </div>
  );
}
