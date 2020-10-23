import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodPageInfoComponent } from './vod-page-info.component';

describe('VodPageInfoComponent', () => {
  let component: VodPageInfoComponent;
  let fixture: ComponentFixture<VodPageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodPageInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodPageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
