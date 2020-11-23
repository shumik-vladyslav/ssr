import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialSeasonsDetailsComponent } from './serial-seasons-details.component';

describe('SerialSeasonsDetailsComponent', () => {
  let component: SerialSeasonsDetailsComponent;
  let fixture: ComponentFixture<SerialSeasonsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialSeasonsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialSeasonsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
