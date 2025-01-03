'use client'
import { useState, useEffect, FC, use } from 'react';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { Venta, VentaPlot } from '@/types/venta';

const VentasPage: FC = () => {
  const [data, setData] = useState<VentaPlot[]>([]);
  const [aggregation, setAggreation] = useState<string>('diario');
  const [detail, setDetail] = useState<string>('total');

  useEffect(() => {
    // Obteniendo los datos de backend
    fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/ventas`)
      .then(response => response.json())
      .then((ventas: Venta[]) => {
        let cost_accumulated = 0;
        const aggregatedData = ventas.reduce<{ [key: string]: { total: number; cuenta: number } }>((acc, venta) => {
          const fecha = aggregation === 'diario' ? venta.fecha : venta.fecha.slice(0, 7);
          const totalVenta = venta.detalleProductos.reduce((sum, producto) => sum + parseFloat(producto.precio), 0);

          if (!acc[fecha]) {
            acc[fecha] = { total: 0, cuenta: 0 };
          }

          cost_accumulated += totalVenta
          acc[fecha].total += cost_accumulated;
          acc[fecha].cuenta += totalVenta;


          return acc
        }, {})
        const newData = Object.entries(aggregatedData).map(([fecha, {total, cuenta}]) => ({fecha: new Date(fecha), total, cuenta}));
        setData(newData);
      })
      .catch(error => console.error('Error al cargar datos:', error));
  }, [aggregation]);

  useEffect(() => {
    if (data.length === 0) return;

    // const svg = d3.select('#ventas-chart').html('')
    //   .append('svg')
    //   .attr('width', 500)
    //   .attr('height', 300);

    // const x = d3.scaleBand()
    //   .domain(data.map(d => d.fecha))
    //   .range([0, 500])
    //   .padding(0.1);

    const yTotal = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) || 0])
      .range([300, 0]);

    const yCount = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.cuenta) || 0])
      .range([300, 50]);

    // // Dibujar las barras
    // const bars = svg.selectAll('rect')
    //   .data(data, d => d.fecha);

    // // Transición para eliminar barras antiguas
    // bars.exit()
    //   .transition()
    //   .duration(500)
    //   .attr('y', 300)
    //   .attr('height', 0)
    //   .remove();

    // // Transición para actualizar barras existentes
    // bars.transition()
    //   .duration(500)
    //   .attr('x', d => x(d.fecha)!)
    //   .attr('y', d => yTotal(d.total))
    //   .attr('width', x.bandwidth())
    //   .attr('height', d => 300 - yTotal(d.total))
    //   .attr('fill', 'blue');

    // // Transición para agregar nuevas barras
    // bars.enter()
    //   .append('rect')
    //   .attr('x', d => x(d.fecha)!)
    //   .attr('y', 300)
    //   .attr('width', x.bandwidth())
    //   .attr('height', 0)
    //   .attr('fill', 'blue')
    //   .transition()
    //   .duration(500)
    //   .attr('y', d => yTotal(d.total))
    //   .attr('height', d => 300 - yTotal(d.total));

    // const line = d3.line<VentaPlot>()
    //   .x(d => (x(d.fecha) || 0) + x.bandwidth() / 2)
    //   .y(d => yCount(d.cuenta))

    // const path = svg.selectAll('.line-count').data([data]);

    // path.exit().remove();

    // path.enter()
    //   .append('path')
    //   .attr('class', 'line-count')
    //   .attr('fill', 'none')
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', 2)
    //   .attr('d', line)
    //   .merge(path)
    //   .transition()
    //   .duration(500)
    //   .attr('d', line);


    // const plot = Plot.plot({
    //   marks: [
    //     Plot.barY(data, { x: 'fecha', y: 'total', fill: 'blue', scale: yTotal }),
    //     Plot.line(data, { x: 'fecha', y: 'cuenta', stroke: 'red', scale: yCount })
    //   ],
    //   x: {
    //     label: 'Fecha'
    //   },
    //   y: {
    //     label: 'Total'
    //   },
    //   color: {
    //     legend: true
    //   }
    // });

    // const plot = Plot.plot({
    //   marks: [
    //     Plot.barY(data, { x: 'fecha', y: 'total', fill: 'black', dx: 2, dy: 2 }),
    //     Plot.barY(data, { x: 'fecha', y: 'total', fill: '#ccc' }),
    //     (_, { x }, __, dimensions) => 
    //       Plot.plot({
    //         ...dimensions,
    //         marks: [
    //           Plot.line(data, { x: 'fecha', y: 'cuenta', stroke: 'steelblue', strokeWidth: 2 }),
    //           Plot.dot(data, { x: 'fecha', y: 'cuenta', stroke: 'steelblue', r: 4, fill: "white" })
    //         ],
    //         x: {
    //           type: "identity",
    //           transform: (v) => x(v) + x.bandwidth() / 2,
    //           axis: null
    //         },
    //         y: {axis: "right", nice: true, line: true},
    //         color: {legend: true, label: "Cuenta", scheme: "Viridis"}
    //       })
    //   ],
    //   marginLeft: 70,
    //   marginRight: 50,
    //   marginBottom: 50,
    //   width: Math.min(1000, 780),
    //   height: 400,

    //   x: { ticks: [], padding: 0.4 },
    //   y: { axis: "left" },
    //   color: { legend: true, label: "Total", scheme: "Viridis" }
    // })

    console.log(data);

    const minDate = d3.min(data, d => d.fecha);
    const maxDate = d3.max(data, d => d.fecha);

    const extendedMinDate = d3.utcMonth.offset(minDate, 0);
    const extendedMaxDate = d3.utcMonth.offset(maxDate, 1);
  
    const months = d3.utcMonths(extendedMinDate, extendedMaxDate);

    console.log(minDate, maxDate, extendedMaxDate, extendedMinDate, months);

    const plot = Plot.plot({
      caption: `Figura: ${detail === 'total' ? 'Agregado de Ventas' : 'Ventas por periodo'}`,
      x: {
        label: null,
        ticks: []
      },
      marginLeft: 0,
      marks: [
        Plot.gridY({
          strokeDasharray: "0.75,2",
          strokeOpacity: 1
        }),
        Plot.axisY({
          tickSize: 0, 
          dx: 60, 
          dy: -6, 
          
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => (i === _.length - 1 ? `$${d}` : d),
          label: detail === 'total' ? "Agregado de Ventas" : 'Ventas por periodo'
        }),
        Plot.ruleY([0]),
        Plot.ruleX(months, {
          x: d => d,
          stroke: "black",
          strokeWidth: 2,
          strokeOpacity: 0.5,
        }),

        Plot.text(months, {
          x: d => d,
          y: 0,
          text: d => d3.utcFormat("%B")(d),
          dy: 15,
          textAnchor: "middle",
          fill: "black"
        }),
        Plot.barY(data, { x: 'fecha', y: detail, fillOpacity: 0.2 }),
        Plot.tickY(data, { x: 'fecha', y: detail}),
      ]
    })

    const chartContainer = document.getElementById('ventas-chart');
    if (chartContainer) {
      chartContainer.innerHTML = '';
      chartContainer.appendChild(plot);
    }

    return () => plot.remove();

  }, [data, detail]);

  return (
    <div className='center'>
      <h1 className="text-4xl font-bold mb-4">Ventas</h1>
      <div style={{ margin: '20px 0' }}>
        <div id='ventas-chart'></div>
        <div className="flex space-x-4 mt-4">
          <div>
            <label className="mr-2 font-medium">Granularidad:</label>
            <select 
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={(e) => setAggreation(e.target.value)}
            >
              <option value="diario">Diario</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div>
            <label className="mr-2 font-medium">Ventas:</label>
            <select 
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={(e) => setDetail(e.target.value)}
            >
              <option value="total">Acumulado</option>
              <option value="cuenta">Periodo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentasPage;