import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCardAdminComponent } from './notification-card-admin.component';

describe('NotificationCardAdminComponent', () => {
  let component: NotificationCardAdminComponent;
  let fixture: ComponentFixture<NotificationCardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCardAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationCardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
