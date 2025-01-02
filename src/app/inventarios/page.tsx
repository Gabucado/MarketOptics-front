'use client'
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

const VentasPage: React.FC = () => {
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
  
      const svg = d3.select('#inventarios-chart')
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
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Inventarios Page</h1>
      <div id="invantarios-chart" className='w-500px h-300px'></div>
      <div style={{ margin: '20px 0' }}>
        <select>
          <option value="option1">Diario</option>
          <option value="option2">Mensual</option>
        </select>
      </div>
    </div>
  );
};

export default VentasPage;