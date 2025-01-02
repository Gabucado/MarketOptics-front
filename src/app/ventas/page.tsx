'use client'
import { useState, useEffect, FC } from 'react';
import * as d3 from 'd3';

const VentasPage: FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Obteniendo los datos de backend
    fetch('backend/ventas')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error al cargar datos:', error));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select('#ventas-chart')
      .append('svg')
      .attr('width', 400)
      .attr('height', 400);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 60)
      .attr('y', (d, i) => 300 - 10 * d)
      .attr('width', 50)
      .attr('height', (d, i) => d * 10)
      .attr('fill', 'black');
  }, [data]);

  return (
    <div className='center'>
      <h1>Ventas Page</h1>
      <div style={{ margin: '20px 0' }}>
        <div id='ventas-chart' className='w-500px h-300px'></div>
        <select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </div>
    </div>
  );
};

export default VentasPage;