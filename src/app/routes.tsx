import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactoPage } from './pages/ContactoPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { SearchPage } from './pages/SearchPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
<<<<<<< HEAD
import { AdminClients } from './pages/admin/AdminClients';
=======
import { AdminUsers } from './pages/admin/AdminUsers';
>>>>>>> 5f1ab9082ade012e692c6e502bed76d81603c5d5
import { AdminOrders } from './pages/admin/AdminOrders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'categoria/:categoryId', Component: CategoryPage }, // 🔑 Mapea directo a tu página funcional
      { path: 'catalogo', Component: CatalogoPage }, // Deja el catálogo limpio para "Ver todo"
      { path: 'contacto', Component: ContactoPage },
      { path: 'perfil', Component: UserProfilePage },
      { path: 'favoritos', Component: FavoritesPage },
      { path: 'carrito', Component: CartPage },
      { path: 'buscar', Component: SearchPage },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true,             Component: AdminDashboard },
      { path: 'productos',       Component: AdminProducts },
      { path: 'categorias',      Component: AdminCategories },
<<<<<<< HEAD
      { path: 'usuarios',        Component: AdminClients },
=======
      { path: 'usuarios',        Component: AdminUsers },
>>>>>>> 5f1ab9082ade012e692c6e502bed76d81603c5d5
      { path: 'pedidos',         Component: AdminOrders },
    ],
  },
]);