import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetSettingsComponent } from './cabinet-settings.component';

describe('CabinetSettingsComponent', () => {
  let component: CabinetSettingsComponent;
  let fixture: ComponentFixture<CabinetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
