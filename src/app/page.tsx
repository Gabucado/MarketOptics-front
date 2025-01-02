
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    
      <div className='items-center justify-center'>
        <h1>Bienvenido a Optics Market</h1>
        <p>Este es un ejercicio.</p>
        <ul>
          <li>
            <Link href="/ventas">Grafico de Ventas</Link>
          </li>
          <li>
            <Link href="/inventarios">Grafico de Inventarios</Link>
          </li>
        </ul>
      </div>
    
  );
};

export default Home;
