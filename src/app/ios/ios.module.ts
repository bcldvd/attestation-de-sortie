import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { IosRoutingModule } from './ios-routing.module';
import { IosComponent } from './ios.component';

@NgModule({
  declarations: [IosComponent],
  imports: [
    CommonModule,
    IosRoutingModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class IosModule {}
