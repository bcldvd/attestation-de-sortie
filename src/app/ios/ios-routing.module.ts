import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IosComponent } from './ios.component';

const routes: Routes = [
  { path: '', component: IosComponent },
  {
    path: 'setup',
    loadChildren: () =>
      import('./ios-setup/ios-setup.module').then((m) => m.IosSetupModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IosRoutingModule {}
