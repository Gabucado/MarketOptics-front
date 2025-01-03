
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className='flex flex-col items-left justify-center'>
      <h1 className='text-4xl font-bold'>Bienvenido a Optics Market</h1>
      
      <ul className='flex flex-row items-center justify-around m-5'>
        <li>
          <Link href="/about">
            <button className='bg-transparent text-blue-500 hover:underline shadow-md p-2 rounded'>
              Modelo
            </button>
          </Link>
        </li>
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
