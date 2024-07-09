import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincarsComponent } from './admincars.component';

describe('AdmincarsComponent', () => {
  let component: AdmincarsComponent;
  let fixture: ComponentFixture<AdmincarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmincarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmincarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
