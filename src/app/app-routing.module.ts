import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
    canLoad: [AutoLoginGuard]
  },  
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then(m => m.MapPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'introduction',
    loadChildren: () => import('./introduction/introduction.module').then(m => m.IntroductionPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then(m => m.NewPasswordPageModule)
  },
  {
    path: 'filtros',
    loadChildren: () => import('./filtros/filtros.module').then(m => m.FiltrosPageModule),
    canLoad: [AuthGuard]
  },   {
    path: 'filtros2',
    loadChildren: () => import('./filtros2/filtros2.module').then( m => m.Filtros2PageModule)
  }
 
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
