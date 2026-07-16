import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { authGuard } from './core/guards/auth.guard';
import { NotifiComponent } from './features/notificaciones/notifi.component';
import { UsuarioComponent } from './features/usuarios/usuario.component';
import { ProductosComponent } from './features/productos/productos.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
  path: 'clientes',
  component: ClientesComponent,
  canActivate: [authGuard]
},
{
  path: 'notificaciones',
  component: NotifiComponent,
  canActivate: [authGuard]
},
{
  path: 'usuarios',
  component: UsuarioComponent,
  canActivate: [authGuard]
},
{
  path: 'productos',
  component: ProductosComponent,
  canActivate: [authGuard]
}
];