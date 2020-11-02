import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

import { IosSetupRoutingModule } from './ios-setup-routing.module';
import { IosSetupComponent } from './ios-setup.component';

@NgModule({
  declarations: [IosSetupComponent],
  imports: [
    CommonModule,
    IosSetupRoutingModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
  ],
})
export class IosSetupModule {}
