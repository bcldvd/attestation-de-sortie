import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IosSetupComponent } from './ios-setup.component';

const routes: Routes = [{ path: '', component: IosSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IosSetupRoutingModule { }
