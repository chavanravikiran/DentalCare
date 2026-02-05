import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRdvComponent } from './mes-rdv.component';

describe('MesRdvComponent', () => {
  let component: MesRdvComponent;
  let fixture: ComponentFixture<MesRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesRdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
