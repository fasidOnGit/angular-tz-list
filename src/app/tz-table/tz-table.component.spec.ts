import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzTableComponent } from './tz-table.component';

describe('TzTableComponent', () => {
  let component: TzTableComponent;
  let fixture: ComponentFixture<TzTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
