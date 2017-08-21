import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrAuthComponent } from './qr-auth.component';

describe('QrAuthComponent', () => {
  let component: QrAuthComponent;
  let fixture: ComponentFixture<QrAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
