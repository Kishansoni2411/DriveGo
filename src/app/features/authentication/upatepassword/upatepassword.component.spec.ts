import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpatepasswordComponent } from './upatepassword.component';

describe('UpatepasswordComponent', () => {
  let component: UpatepasswordComponent;
  let fixture: ComponentFixture<UpatepasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpatepasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpatepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
