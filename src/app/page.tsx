
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    
      <div className='flex flex-col items-center justify-center space-y-6 p-6'>
        <h1 className='text-4xl font-bold'>Bienvenido a Optics Market</h1>
        <p className='text-lg'>Este es un ejercicio.</p>
        <div className='text-left'>
          <h2 className='text-2xl font-semibold'>Modelo de Datos</h2>
          <p className='text-md mt-2'>
            El modelo de datos incluye las siguientes relaciones:
          </p>
          <ul className='list-disc list-inside mt-2'>
            <li><strong>Producto:</strong> Tiene un nombre.</li>
            <li><strong>Venta:</strong> Tiene una fecha.</li>
            <li><strong>Inventario:</strong> Tiene un Producto, una fecha y una cantidad.</li>
            <li><strong>VentaProducto:</strong> Tiene una venta, un producto, un valor y una cantidad.</li>
          </ul>
        </div>

        <div className='mt-6'>
          <h2 className='text-2xl font-semibold'>Diagrama BPMN</h2>
          <img src="/path/to/bpmn-diagram.png" alt="BPMN Diagram" className='mt-4' />
        </div>
        
        <ul className='space-y-4'>
          <li>
            <Link href="/ventas">
              <button className='bg-transparent text-blue-500 hover:underline shadow-md p-2 rounded'>
                Grafico de Ventas
              </button>
            </Link>
          </li>
          <li>
            <Link href="/inventarios">
              <button className='bg-transparent text-blue-500 hover:underline shadow-md p-2 rounded'>
                Grafico de Inventarios
              </button>
            </Link>
          </li>
        </ul>
      </div>
    
  );
};

export default Home;
