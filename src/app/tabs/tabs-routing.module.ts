import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'usuario',
        loadChildren: () => import('../usuario/usuario.module').then(m => m.UsuarioPageModule)
      },      
      {
        path: 'buscar',
        loadChildren: () => import('../buscar/buscar.module').then( m => m.BuscarPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
