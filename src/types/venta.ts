export type CompraVenta = {
  ventaId: number;
  productoId: number;
  cantidad: number;
  precio: string;
  createdAt: string;
  updatedAt: string;
  id: number;
};

export type Venta = {
  id: number;
  fecha: string;
  createdAt: string;
  updatedAt: string;
  detalleProductos: CompraVenta[];
};

export type VentaPlot = {
  fecha: Date,
  total: number,
  cuenta: number
}