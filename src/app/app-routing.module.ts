import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  redirectTo: 'pixel-manipulation',
  pathMatch: 'full'
},{
  path: 'pixel-manipulation',
  loadChildren: () => import('./modules/pixel-manipulation/pixel-manipulation.module').then(m => m.PixelManipulationModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
