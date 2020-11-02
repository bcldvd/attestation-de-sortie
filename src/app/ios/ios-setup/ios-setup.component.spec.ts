import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosSetupComponent } from './ios-setup.component';

describe('IosSetupComponent', () => {
  let component: IosSetupComponent;
  let fixture: ComponentFixture<IosSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IosSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
