'use client'
import { Inventario, InventarioPlot } from '@/types/Inventario';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import React, { useEffect, useRef, useState } from 'react';

const VentasPage: React.FC = () => {
  const [data, setData] = useState<InventarioPlot[]>([]);
  const [aggregation, setAggreation] = useState<string>('diario');
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Obteniendo los datos de backend
    fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/inventarios`)
      .then(response => response.json())
      .then((inventarios: Inventario[]) => {
        const aggregatedData = inventarios.reduce<{ [ key: string ]: { [productId: number]: {cantidad: number, nombre: string} } }>((acc, inventario) => {
          const fecha = aggregation === 'diario' ? inventario.fecha : inventario.fecha.slice(0, 7);
          if (!acc[fecha]) {
            acc[fecha] = {};
          }

          if (!acc[fecha][inventario.productoId]) {
            acc[fecha][inventario.productoId] = {cantidad: 0, nombre: inventario.producto.nombre};
          }

          acc[fecha][inventario.productoId].cantidad += inventario.cantidad;
          return acc;
        }, {})

        const newData = Object.entries(aggregatedData).flatMap(([fecha, products]) => 
          Object.entries(products).map(([productId, {cantidad, nombre}]) => ({
            fecha: new Date(fecha),
            nombre,
            cantidad
          }))
        );

        setData(newData);
      })
      .catch(error => console.error('Error al cargar datos:', error));
  }, [aggregation]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 600;
    const height = 500;

    const minDate = d3.min(data, d => d.fecha);
    const maxDate = d3.max(data, d => d.fecha);

    // @ts-ignore
    const extendedMinDate = d3.utcMonth.offset(minDate, 0);
    // @ts-ignore
    const extendedMaxDate = d3.utcMonth.offset(maxDate, 1);
  
    const months = d3.utcMonths(extendedMinDate, extendedMaxDate);


    const chart = Plot.plot({
      width,
      height,
      x: {
        ticks: [], 
        padding: 0.4,
      },
      y: {transform: d => d, grid: true},
      color: {
        scheme: "Viridis", 
        legend: 'swatches', 
        grid: true,
        // @ts-ignore
        columns: 1,
        reverse: true,
      },
      marks: [
        Plot.ruleX(months, {
          x: d => d,
          stroke: "black",
          strokeWidth: 2,
          strokeOpacity: 0.5,
        }),
        Plot.ruleY([0]),
        Plot.text(months, {
          x: d => d,
          y: 0,
          text: d => d3.utcFormat("%B")(d),
          dy: 15,
          textAnchor: "middle",
          fill: "black"
        }),
        Plot.rectY(data, { 
          x: "fecha", 
          y: "cantidad",
          title: "nombre",
          fill: "black",
          dx: 2, dy: 2,
          // xScale
        }),
        Plot.barY(data, { 
          x: "fecha", 
          y: "cantidad",
          title: "nombre",
          fill: "nombre",
          // xScale
        })
      ]
    })

    ref.current!.innerHTML = '';
    ref.current!.appendChild(chart);

    d3.select(ref.current).selectAll("rect")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        d3.select(ref.current).selectAll("rect").filter((e, i, g) => {
          if (typeof(d) === 'number') {
            return (g[i] as SVGRectElement).textContent !== (event.target as SVGRectElement).textContent && (g[i] as any).__data__ !== (event.target as SVGRectElement).textContent;
          }
          if (typeof(d) !== 'number') {
            return e !== d && (g[i] as Element).textContent !== d;
          }
          return e !== d;
        }).attr("opacity", 0.2);
        
        })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.select(ref.current).selectAll("rect").attr("opacity", 1);
        d3.select(ref.current).select("#tooltip").remove();
    });

    // chart.setAttribute('className', 'flex flex-row');
    // chart.removeAttribute('class');
    chart.setAttribute('style', 'display: flex; flex-direction: row-reverse; align-items: center;');

    return () => chart.remove();
  }, [data]);

  return (
    <div className='center align-center flex-column'>
      <h1 className="text-4xl font-bold mb-4">Inventarios</h1>
      <div ref={ref} className='flex-row align-middle' id="invantarios-chart"></div>
      <div className="mt-4">
        <label className="mr-2 font-medium">Granularidad:</label>
        <select 
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          onChange={(e) => setAggreation(e.target.value)}
        >
          <option value="diario">Diario</option>
          <option value="mensual">Mensual</option>
        </select>
      </div>
    </div>
  );
};

export default VentasPage;