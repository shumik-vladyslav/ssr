import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodListComponent } from './vod-list.component';

describe('VodListComponent', () => {
  let component: VodListComponent;
  let fixture: ComponentFixture<VodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
