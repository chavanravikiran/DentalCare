import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCardUserComponent } from './notification-card-user.component';

describe('NotificationCardUserComponent', () => {
  let component: NotificationCardUserComponent;
  let fixture: ComponentFixture<NotificationCardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCardUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
