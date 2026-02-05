import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsUserPageComponent } from './notifications-user-page.component';

describe('NotificationsUserPageComponent', () => {
  let component: NotificationsUserPageComponent;
  let fixture: ComponentFixture<NotificationsUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsUserPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
