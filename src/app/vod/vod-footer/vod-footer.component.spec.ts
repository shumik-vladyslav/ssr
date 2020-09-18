import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodFooterComponent } from './vod-footer.component';

describe('VodFooterComponent', () => {
  let component: VodFooterComponent;
  let fixture: ComponentFixture<VodFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
