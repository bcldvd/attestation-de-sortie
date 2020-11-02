import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'ios',
    loadChildren: () => import('./ios/ios.module').then((m) => m.IosModule),
  },
  {
    path: 'android',
    loadChildren: () =>
      import('./android/android.module').then((m) => m.AndroidModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
