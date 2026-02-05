import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsAdminPageComponent } from './notifications-admin-page.component';

describe('NotificationsAdminPageComponent', () => {
  let component: NotificationsAdminPageComponent;
  let fixture: ComponentFixture<NotificationsAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsAdminPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
