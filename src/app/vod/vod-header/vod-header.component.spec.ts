import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodHeaderComponent } from './vod-header.component';

describe('VodHeaderComponent', () => {
  let component: VodHeaderComponent;
  let fixture: ComponentFixture<VodHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
