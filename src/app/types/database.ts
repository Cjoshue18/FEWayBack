export interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export interface Estilo {
  est_id: number;
  est_nombre: string;
}

export interface VarColor {
  color_id: number;
  color_nombre: string;
  color_hex: string;
  color_url_img: string;
}

export interface Variante {
  var_id: number;
  pro_id: number;
  color_id: number;
  var_talla: string;
  var_stock: number;
  var_precio: number;
  color?: VarColor;
}

export interface Producto {
  pro_id: number;
  cat_id: number;
  est_id: number;
  sexo: 'Mujer' | 'Hombre' | 'Unisex';
  pro_nombre: string;
  pro_descripcion: string;
  pro_descuento: number;
  pro_desc_fecha_inicio: string | null;
  pro_desc_fecha_fin: string | null;
  pro_fecha_creacion: string;
  categoria?: Categoria;
  estilo?: Estilo;
  variantes?: Variante[];
}

export interface Cliente {
  cli_id: number;
  cli_documento: string;
  cli_documento_tipo: string;
  cli_nombre: string;
  cli_apellido: string;
  cli_email: string;
  cli_telefono: string;
  cli_usuario: string;
  cli_password_hash: string;
  cli_stripe_id: string;
  cli_fecha_registro: string;
}

export interface Direccion {
  dir_id: number;
  cli_id: number;
  dir_calle: string;
  dir_distrito: string;
  dir_provincia: string;
  dir_departamento: string;
  dir_referencia: string;
  dir_es_preferido: boolean;
}

export interface MetodoPago {
  met_id: number;
  cli_id: number;
  met_stripe_card_id: string;
  met_stripe_card_ultimos4: string;
  met_tipo_pago: string;
  met_es_preferido: boolean;
}

export interface Estado {
  estado_id: number;
  estado_descripcion: string;
}

export interface Pedido {
  ped_id: number;
  cli_id: number;
  met_id: number;
  dir_id: number;
  estado_id: number;
  ped_total: number;
  ped_stripe_cargo_id: string;
  ped_fecha_compra: string;
  ped_fecha_entrega: string;
  estado?: Estado;
  direccion?: Direccion;
  metodo_pago?: MetodoPago;
  detalle?: DetallePedido[];
}

export interface DetallePedido {
  ped_id: number;
  var_id: number;
  detped_cantidad: number;
  detped_precio_u: number;
  detped_sub_total: number;
  variante?: Variante;
}

export interface Administrador {
  ad_id: number;
  ad_nombre: string;
  ad_usuario: string;
  ad_password_hash: string;
}

export type SortOption = 'recientes' | 'precio_asc' | 'precio_desc';

export interface ProductFilters {
  sexo: string[];
  colors: number[];
  tallas: string[];
  soloDisponibles: boolean;
  precioMin: number;
  precioMax: number;
}
