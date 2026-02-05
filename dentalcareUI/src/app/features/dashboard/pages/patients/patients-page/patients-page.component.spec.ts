import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsPageComponent } from './patients-page.component';

describe('PatientsPageComponent', () => {
  let component: PatientsPageComponent;
  let fixture: ComponentFixture<PatientsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
