import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';

@Component({
  selector: 'app-ios-setup',
  templateUrl: './ios-setup.component.html',
  styleUrls: ['./ios-setup.component.scss'],
})
export class IosSetupComponent implements OnInit {
  constructor(stepperIntl: MatStepperIntl) {
    stepperIntl.optionalLabel = 'Sauf si déjà effectué';
  }

  ngOnInit(): void {}

  doNothing($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
