import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AndroidRoutingModule } from './android-routing.module';
import { AndroidComponent } from './android.component';


@NgModule({
  declarations: [AndroidComponent],
  imports: [
    CommonModule,
    AndroidRoutingModule
  ]
})
export class AndroidModule { }
