import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayermanagerComponent } from './playermanager.component';

describe('PlayermanagerComponent', () => {
  let component: PlayermanagerComponent;
  let fixture: ComponentFixture<PlayermanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayermanagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
