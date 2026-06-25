const API_BASE = 'https://y2kvault-backend.onrender.com';

// ── INTERFACES EXISTENTES ──
export interface CategoriaApi {
  catID?: number; cat_id?: number;
  catNombre?: string; cat_nombre?: string;
}

export interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export interface EstiloApi {
  estID?: number;
  estNombre?: string;
  est_id?: number;
  est_nombre?: string;
}

export interface Estilo {
  est_id: number;
  est_nombre: string;
}

// [P8 FIX] Ampliamos ClienteApi.usuario para incluir usuUsername y usuId
export interface ClienteApi {
  cli_id?: number;
  cliId?: number;
  id?: number;

  cli_nombre?: string;
  cliNombre?: string;
  nombre?: string;

  cli_apellido?: string;
  cliApellido?: string;
  apellido?: string;

  cli_email?: string;
  cliEmail?: string;
  email?: string;

  cli_documento_tipo?: string;
  cliTipoDocumento?: string;

  cli_documento?: string;
  cliDocumento?: string;

  cli_fecha_registro?: string;
  cliFechaRegistro?: string;
  fecha_registro?: string;

  // Campos raíz que puede devolver el login
  usuUsername?: string;
  usuEmail?: string;
  cliTelefono?: string | null;
  rol?: string;

  usuario?: {
    usuId?: number;
    usuEmail?: string;
    usuUsername?: string;
    usuFechaRegistro?: string;
  };
}

export interface Cliente {
  cli_id: number;
  cli_nombre: string;
  cli_apellido: string;
  cli_email: string;
  cli_documento_tipo: string;
  cli_documento: string;
  cli_fecha_registro: string;
}

// ── INTERFACES PARA PRODUCTOS (ENRIQUECIDAS) ──
export interface ProductoApi {
  pro_id?: number; proID?: number; id?: number;
  pro_nombre?: string; proNombre?: string; nombre?: string; name?: string;
  pro_precio?: number; proPrecio?: number; precio?: number; price?: number;
  pro_precio_original?: number; precioOriginal?: number; originalPrice?: number;
  pro_imagen?: string; proImagen?: string; imagen?: string; image?: string; image_url?: string; imageUrl?: string; urlImagen?: string; proImagenUrl?: string; foto?: string; proFoto?: string;
  pro_imagen_alternativa?: string; proImagenHover?: string; hoverImage?: string;
  badge?: string;
  pro_sexo?: string; sexo?: string; genero?: string; proSexo?: string;
  pro_tallas?: string | string[]; tallas?: string[];
  pro_colores?: string | number[]; colors?: number[];
  pro_stock?: number; inStock?: boolean; stock?: number;
  categoria?: string | number; categoriaId?: number; catId?: number; cat_id?: number; pro_categoria?: string | number; proCategoria?: string | number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  sexo: string;
  tallas: string[];
  colors: (number | string)[];
  inStock: boolean;
  originalPrice?: number;
  hoverImage?: string;
  badge?: string;
  categoria?: string | number;
}

export interface RegisterData {
  Email: string;
  NombreUsuario: string;
  Contrasena: string;
  Nombres: string;
  Apellidos: string;
  TipoDocumento: string;
  Documento: string;
}

// ── INTERFACES PARA FILTROS COMBINADOS ──
export interface FilterOptions {
  categoria?: string | number;
  estilo?: string | number;
  genero?: string;
  precioMin?: number;
  precioMax?: number;
}

// [P5 FIX] Interfaces para el CRUD de Direcciones
export interface DireccionApi {
  dirId?: number;
  DirId?: number;
  dirCalle?: string;
  DirCalle?: string;
  dirDistrito?: string;
  DirDistrito?: string;
  dirProvincia?: string;
  DirProvincia?: string;
  dirDepartamento?: string;
  DirDepartamento?: string;
  dirReferencia?: string;
  DirReferencia?: string;
  dirPreferido?: boolean;
  DirPreferido?: boolean;
}

export interface Direccion {
  dirId: number;
  dirCalle: string;
  dirDistrito: string;
  dirProvincia: string;
  dirDepartamento: string;
  dirReferencia: string;
  dirPreferido: boolean;
}

export interface DireccionPayload {
  DirCalle: string;
  DirDistrito: string;
  DirProvincia: string;
  DirDepartamento: string;
  DirReferencia: string;
  DirPreferido: boolean;
}

// [P6 FIX] Interfaz para actualización de perfil
export interface UpdatePerfilData {
  cliNombre: string;
  cliApellido: string;
  usuUsername: string;
  usuEmail: string;
  cliTelefono: string | null;
}

// [P2 FIX] Tipamos la respuesta del login correctamente
export interface LoginApiResponse {
  tokenJWT?: string;
  token?: string;
  rol?: string;
  cliNombre?: string;
  cliApellido?: string;
  cliTipoDocumento?: string;
  cliDocumento?: string;
  cliTelefono?: string | null;
  usuUsername?: string;
  usuEmail?: string;
  id?: number;
  usuId?: number;
}

// ── MÉTODO POST: REGISTRAR CLIENTE NUEVO ──
export async function registerClienteApi(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  const url = `${API_BASE}/api/auth/register-cliente`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.Email,
        nombreUsuario: data.NombreUsuario,
        contrasena: data.Contrasena,
        nombres: data.Nombres,
        apellidos: data.Apellidos,
        tipoDocumento: data.TipoDocumento,
        documento: data.Documento
      }),
    });

    const contentType = res.headers.get('content-type');
    let errorMessage = 'Error en el registro.';

    if (contentType && contentType.includes('application/json')) {
      const result = await res.json();
      errorMessage = result.message || errorMessage;
    } else {
      const textError = await res.text();
      errorMessage = textError || errorMessage;
    }

    if (!res.ok) return { success: false, error: errorMessage };
    return { success: true };
  } catch {
    return { success: false, error: 'No se pudo establecer conexión con el servidor de registro.' };
  }
}

// ── PARSERS / MAPEADORES ──
const parseCategoria = (item: CategoriaApi): Categoria => ({
  cat_id: Number(item.catID ?? item.cat_id ?? 0),
  cat_nombre: String(item.catNombre ?? item.cat_nombre ?? ''),
});

const parseEstilo = (item: EstiloApi): Estilo => ({
  est_id: Number(item.estID ?? item.est_id ?? 0),
  est_nombre: String(item.estNombre ?? item.est_nombre ?? ''),
});

const parseCliente = (item: ClienteApi): Cliente => ({
  cli_id: Number(item.cliId ?? item.cli_id ?? item.id ?? 0),
  cli_nombre: String(item.cliNombre ?? item.cli_nombre ?? item.nombre ?? ''),
  cli_apellido: String(item.cliApellido ?? item.cli_apellido ?? item.apellido ?? ''),
  cli_email: String(item.usuario?.usuEmail ?? item.cliEmail ?? item.email ?? ''),
  cli_documento_tipo: String(item.cliTipoDocumento ?? item.cli_documento_tipo ?? 'DNI'),
  cli_documento: String(item.cliDocumento ?? item.cli_documento ?? ''),
  cli_fecha_registro: String(
    item.usuario?.usuFechaRegistro ??
    item.cliFechaRegistro ??
    item.fecha_registro ??
    ''
  ),
});

// [P5 FIX] Parser para Direccion
const parseDireccion = (item: DireccionApi): Direccion => ({
  dirId: Number(item.dirId ?? item.DirId ?? 0),
  dirCalle: String(item.dirCalle ?? item.DirCalle ?? ''),
  dirDistrito: String(item.dirDistrito ?? item.DirDistrito ?? ''),
  dirProvincia: String(item.dirProvincia ?? item.DirProvincia ?? ''),
  dirDepartamento: String(item.dirDepartamento ?? item.DirDepartamento ?? ''),
  dirReferencia: String(item.dirReferencia ?? item.DirReferencia ?? ''),
  dirPreferido: Boolean(item.dirPreferido ?? item.DirPreferido ?? false),
});

// 🎯 Parser de productos insensible a mayúsculas/minúsculas
const parseProducto = (item: any): Product => {
  const obj: Record<string, any> = {};
  if (item && typeof item === 'object') {
    Object.keys(item).forEach(key => { obj[key.toLowerCase()] = item[key]; });
  }

  let listaTallas: string[] = [];
  const rawTallas = obj['tallas'] ?? obj['pro_tallas'] ?? obj['protallas'] ?? [];
  const rawVariantes = obj['variantes'] ?? [];

  if (Array.isArray(rawTallas) && rawTallas.length > 0) {
    listaTallas = rawTallas.map((t: any) => {
      if (t && typeof t === 'object') return String(t.talnombre ?? t.nombre ?? t.talla ?? '');
      return String(t);
    });
  } else if (Array.isArray(rawVariantes) && rawVariantes.length > 0) {
    const tallasSet = new Set<string>();
    rawVariantes.forEach((v: any) => {
      if (v && (v.var_talla || v.vartalla)) tallasSet.add(String(v.var_talla ?? v.vartalla));
    });
    listaTallas = Array.from(tallasSet);
  } else if (typeof rawTallas === 'string' && rawTallas.trim() !== '') {
    listaTallas = rawTallas.split(',');
  }

  listaTallas = listaTallas
    .map((s: string) => s.trim().toUpperCase())
    .filter((s: string) => s !== '');

  let listaColores: string[] = [];
  const rawColores = obj['colores'] ?? obj['pro_colores'] ?? obj['procolores'] ?? [];

  if (Array.isArray(rawColores)) {
    listaColores = rawColores.map((c: any) => String(c).trim().toUpperCase());
  } else if (Array.isArray(rawVariantes)) {
    const coloresSet = new Set<string>();
    rawVariantes.forEach((v: any) => {
      if (v && v.var_color) coloresSet.add(String(v.var_color).trim().toUpperCase());
    });
    listaColores = Array.from(coloresSet);
  }

  // [P3 FIX] Unificamos finalId y safeId en una sola variable
  const finalId = Number(obj['pro_id'] ?? obj['proid'] ?? obj['id'] ?? 0);
  const safeId = finalId !== 0 ? finalId : Math.floor(Math.random() * 999999 + 100);

  let finalImage = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500';
  const rawImagesArray = obj['imagenesurl'] ?? obj['imagenes_url'] ?? [];
  if (Array.isArray(rawImagesArray) && rawImagesArray.length > 0) {
    finalImage = String(rawImagesArray[0]).trim().replace(/\\/g, '/');
  }

  return {
    id: safeId,
    name: String(obj['pro_nombre'] ?? obj['pronombre'] ?? obj['nombre'] ?? 'Prenda Wayback'),
    price: Number(obj['pro_precio'] ?? obj['proprecio'] ?? obj['precio'] ?? 0),
    originalPrice: obj['originalprice'] ?? undefined,
    image: finalImage,
    sexo: String(obj['pro_sexo'] ?? obj['sexo'] ?? 'unisex').toLowerCase(),
    tallas: listaTallas,
    colors: listaColores,
    inStock: typeof obj['instock'] === 'boolean' ? obj['instock'] : true,
    categoria: obj['categoria'] ?? ''
  };
};

// ── FUNCIÓN BASE FETCH CON INYECCIÓN DE TOKEN ──
// [P7 FIX] Content-Type solo se inyecta si hay body
export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('wayback_auth_token');

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  // Solo agregar Content-Type si hay body en la petición
  if (options.body !== undefined && options.body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} en la ruta ${url}`);
  }
  if (res.status === 204) return {} as T;

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ── MÉTODOS DE CATEGORÍAS ──
export async function getCategorias(): Promise<Categoria[]> {
  const url = `${API_BASE}/api/categorias`;
  const data = await fetchJson<CategoriaApi[]>(url);
  return Array.isArray(data) ? data.map(parseCategoria) : [];
}

// ── MÉTODOS DE ESTILOS ──
export async function getEstilos(): Promise<Estilo[]> {
  const url = `${API_BASE}/api/estilos`;
  const data = await fetchJson<EstiloApi[]>(url);
  return Array.isArray(data) ? data.map(parseEstilo) : [];
}

export async function createEstilo(estilo: { est_nombre: string }): Promise<Estilo> {
  const url = `${API_BASE}/api/estilos`;
  const data = await fetchJson<EstiloApi>(url, {
    method: 'POST',
    body: JSON.stringify({ est_nombre: estilo.est_nombre })
  });
  return parseEstilo(data);
}

export async function updateEstilo(id: number, estilo: { est_nombre: string }): Promise<Estilo> {
  const url = `${API_BASE}/api/estilos/${id}`;
  const data = await fetchJson<EstiloApi>(url, {
    method: 'PUT',
    body: JSON.stringify({ est_nombre: estilo.est_nombre })
  });
  return parseEstilo(data);
}

export async function deleteEstilo(id: number): Promise<void> {
  const url = `${API_BASE}/api/estilos/${id}`;
  await fetchJson(url, { method: 'DELETE' });
}

// ── MÉTODOS DE CLIENTES ──
export async function getClientes(): Promise<Cliente[]> {
  const url = `${API_BASE}/api/admin/reportes/clientes`;
  const data = await fetchJson<any[]>(url);
  return Array.isArray(data) ? data.map(parseCliente) : [];
}

export async function updateCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
  const url = `${API_BASE}/api/admin/reportes/clientes/${id}`;
  const bodyPayload = {
    CliNombre: cliente.cli_nombre ?? '',
    CliApellido: cliente.cli_apellido ?? '',
    UsuUsername: cliente.cli_email?.split('@')[0] ?? '',
    UsuEmail: cliente.cli_email ?? '',
  };
  return await fetchJson<Cliente>(url, { method: 'PUT', body: JSON.stringify(bodyPayload) });
}

// [P4 FIX] deleteCliente ahora usa fetchJson en lugar de duplicar la lógica de auth
export async function deleteCliente(id: number): Promise<void> {
  const url = `${API_BASE}/api/admin/reportes/clientes/${id}`;
  await fetchJson(url, { method: 'DELETE' });
}

// ── MÉTODOS DE PERFIL ──

// ── GET PERFIL DEL USUARIO AUTENTICADO ──
export async function getMiPerfilApi() {
  const url = `${API_BASE}/api/profile/mi-perfil`;
  return await fetchJson<ClienteApi>(url);
}

// [P6 FIX] Función para actualizar el perfil del usuario autenticado
export async function updatePerfilApi(data: UpdatePerfilData): Promise<void> {
  const url = `${API_BASE}/api/profile/mi-perfil`;
  await fetchJson<void>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}



// ── MÉTODOS CRUD DE DIRECCIONES ──

// [P5 FIX] GET todas las direcciones del usuario autenticado
export async function getDireccionesApi(): Promise<Direccion[]> {
  const url = `${API_BASE}/api/profile/direcciones`;
  const data = await fetchJson<DireccionApi[]>(url);
  return Array.isArray(data) ? data.map(parseDireccion) : [];
}

// [P5 FIX] POST crear nueva dirección
export async function createDireccionApi(payload: DireccionPayload): Promise<Direccion> {
  const url = `${API_BASE}/api/profile/direcciones`;
  const data = await fetchJson<DireccionApi>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseDireccion(data);
}

// [P5 FIX] PUT actualizar dirección existente por ID
export async function updateDireccionApi(id: number, payload: DireccionPayload): Promise<Direccion> {
  const url = `${API_BASE}/api/profile/direcciones/${id}`;
  const data = await fetchJson<DireccionApi>(url, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return parseDireccion(data);
}

// [P5 FIX] DELETE eliminar dirección por ID
export async function deleteDireccionApi(id: number): Promise<void> {
  const url = `${API_BASE}/api/profile/direcciones/${id}`;
  await fetchJson(url, { method: 'DELETE' });
}

// ── MAPEO INTERNO PARA RESOLVER IDs DE CATEGORÍAS ──
// [P1 FIX] Eliminada la declaración duplicada del módulo; solo existe dentro de getProductos

// ── MÉTODO DE PRODUCTOS ──
export async function getProductos(filtros?: FilterOptions): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/api/productos`);

    const MAPA_CATEGORIAS_IDS: Record<string, number> = {
      'pantalon': 1,
      'falda': 2,
      'shorts': 3,
      'jogger': 4,
      'camisetas': 5,
      'sueteres': 6,
      'chaquetas': 7,
      'sets-baggy': 8, 'sets baggy': 8,
      'sets-denim': 9, 'sets denim': 9,
      'sets-deportivos': 10, 'sets deportivos': 10,
      'sets-tejidos': 11, 'sets tejidos': 11
    };

    if (filtros) {
      if (filtros.categoria !== undefined && filtros.categoria !== '') {
        const catKey = String(filtros.categoria).toLowerCase().trim();
        const numericId = MAPA_CATEGORIAS_IDS[catKey] ?? filtros.categoria;
        url.searchParams.append('categoria', String(numericId));
      }
      if (filtros.estilo !== undefined && filtros.estilo !== '') {
        url.searchParams.append('estilo', String(filtros.estilo));
      }
      if (filtros.genero !== undefined && filtros.genero !== '') {
        const genVal = String(filtros.genero).toLowerCase().trim();
        url.searchParams.append('genero', genVal);
      }
      if (filtros.precioMin !== undefined) {
        url.searchParams.append('precioMin', filtros.precioMin.toString());
      }
      if (filtros.precioMax !== undefined) {
        url.searchParams.append('precioMax', filtros.precioMax.toString());
      }
    }

    console.log(`📡 [Wayback API Request]: ${url.pathname}${url.search}`);
    const data = await fetchJson<any[]>(url.toString());
    return Array.isArray(data) ? data.map(parseProducto) : [];
  } catch (error) {
    console.error('Error crítico en la consulta unificada de productos:', error);
    return [];
  }
}

export async function getProductosPorCategoria(categoryId: number | string): Promise<Product[]> {
  return getProductos({ categoria: categoryId });
}

// ── AUTENTICACIÓN ──
// [P2 FIX] loginApi ahora tipifica correctamente la respuesta del backend
export async function loginApi(email: string, pass: string): Promise<{ success: boolean; token?: string; user?: LoginApiResponse; error?: string }> {
  const url = `${API_BASE}/api/auth/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ UsuUsernameOrEmail: email, UsuContrasena: pass })
    });
    const data: LoginApiResponse = await res.json();
    if (!res.ok) return { success: false, error: (data as any).message || 'Credenciales inválidas' };
    return { success: true, token: data.tokenJWT ?? data.token, user: data };
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor de autenticación.' };
  }
}