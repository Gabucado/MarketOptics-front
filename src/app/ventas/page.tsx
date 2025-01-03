'use client'
import { useState, useEffect, FC } from 'react';
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

    const minDate = d3.min(data, d => d.fecha);
    const maxDate = d3.max(data, d => d.fecha);

    // @ts-expect-error
    const extendedMinDate = d3.utcMonth.offset(minDate, 0);
    // @ts-expect-error
    const extendedMaxDate = d3.utcMonth.offset(maxDate, 1);
  
    const months = d3.utcMonths(extendedMinDate, extendedMaxDate);

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
        // @ts-expect-error
        Plot.axisY({
          tickSize: 0, 
          dx: 60, 
          dy: -6, 
          
          lineAnchor: "bottom",
          // @ts-expect-error
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