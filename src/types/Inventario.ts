export type Producto = {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
};

export type Inventario = {
  id: number;
  productoId: number;
  fecha: string;
  cantidad: number;
  createdAt: string;
  updatedAt: string;
  producto: Producto;
};

export type InventarioPlot = {
  cantidad: number,
  nombre: string,
  fecha: Date
}