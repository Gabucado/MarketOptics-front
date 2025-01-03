import Image from "next/image";
import { FC } from "react";

const AboutPage: FC = () => {
  return <div>
    <div className='text-left'>
        <h1 className='text-4xl font-bold mb-4'>Modelo de Datos</h1>
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
        <h2 className='text-2xl font-semibold'>Diagrama</h2>
        <Image src="/Diagram.svg" alt="SVG Diagram" width={400} height={400} className='mt-4' />
      </div>
  </div>
}

export default AboutPage;