'use client'
import { useState, useEffect, FC, use } from 'react';
import * as d3 from 'd3';
import { Venta, VentaPlot } from '@/types/venta';

const VentasPage: FC = () => {
  const [data, setData] = useState<VentaPlot[]>([]);
  const [aggregation, setAggreation] = useState<string>('diario');

  useEffect(() => {
    // Obteniendo los datos de backend
    fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/ventas`)
      .then(response => response.json())
      .then((ventas: Venta[]) => {
        let cost_accumulated = 0;
        const aggregatedData = ventas.reduce<{ [key: string]: { total: number; cuenta: number } }>((acc, venta) => {
          const fecha = aggregation === 'diario' ? venta.fecha : venta.fecha.slice(0, 7);
          const totalVenta = venta.detalleProductos.reduce((sum, producto) => sum + parseFloat(producto.precio), 0);
          const totalCuenta = venta.detalleProductos.reduce((sum, producto) => sum + producto.cantidad, 0);

          if (!acc[fecha]) {
            acc[fecha] = { total: 0, cuenta: 0 };
          }

          cost_accumulated += totalVenta
          acc[fecha].total += cost_accumulated;
          acc[fecha].cuenta += totalCuenta;


          return acc
        }, {})
        const newData = Object.entries(aggregatedData).map(([fecha, {total, cuenta}]) => ({fecha, total, cuenta}));
        setData(newData);
        console.log(newData);
      })
      .catch(error => console.error('Error al cargar datos:', error));
  }, [aggregation]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select('#ventas-chart').html('')
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);

    const x = d3.scaleBand()
      .domain(data.map(d => d.fecha))
      .range([0, 500])
      .padding(0.1);

    const yTotal = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) || 0])
      .range([300, 0]);

    const yCount = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.cuenta) || 0])
      .range([300, 50]);

    // Dibujar las barras
    const bars = svg.selectAll('rect')
      .data(data, d => d.fecha);

    // Transición para eliminar barras antiguas
    bars.exit()
      .transition()
      .duration(500)
      .attr('y', 300)
      .attr('height', 0)
      .remove();

    // Transición para actualizar barras existentes
    bars.transition()
      .duration(500)
      .attr('x', d => x(d.fecha)!)
      .attr('y', d => yTotal(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => 300 - yTotal(d.total))
      .attr('fill', 'blue');

    // Transición para agregar nuevas barras
    bars.enter()
      .append('rect')
      .attr('x', d => x(d.fecha)!)
      .attr('y', 300)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'blue')
      .transition()
      .duration(500)
      .attr('y', d => yTotal(d.total))
      .attr('height', d => 300 - yTotal(d.total));

    const line = d3.line<VentaPlot>()
      .x(d => (x(d.fecha) || 0) + x.bandwidth() / 2)
      .y(d => yCount(d.cuenta))

    const path = svg.selectAll('.line-count').data([data]);

    path.exit().remove();

    path.enter()
      .append('path')
      .attr('class', 'line-count')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('d', line)
      .merge(path)
      .transition()
      .duration(500)
      .attr('d', line);

  }, [data]);

  return (
    <div className='center'>
      <h1>Ventas Page</h1>
      <div style={{ margin: '20px 0' }}>
        <div id='ventas-chart'></div>
        <select onChange={(e) => setAggreation(e.target.value)}>
          <option value="diario">diario</option>
          <option value="mensual">mensual</option>
        </select>
      </div>
    </div>
  );
};

export default VentasPage;