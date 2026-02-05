import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPublicComponent } from './calendar-public.component';

describe('CalendarPublicComponent', () => {
  let component: CalendarPublicComponent;
  let fixture: ComponentFixture<CalendarPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
