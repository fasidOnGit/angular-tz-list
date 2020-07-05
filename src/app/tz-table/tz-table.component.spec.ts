/* tslint:disable:no-string-literal */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TzTableComponent } from './tz-table.component';
import {provideMockStore} from '@ngrx/store/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TzTableCustomColumnComponent} from './tz-table-custom-column/tz-table-custom-column.component';

describe('TzTableComponent', () => {
  let component: TzTableComponent;
  let fixture: ComponentFixture<TzTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ TzTableComponent ],
      providers: [
        {
          provide: Window,
          useFactory : () => ({
            innerHeight: 111
          })
        },
        provideMockStore()
      ]
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

  it('#ngAfterViewInit', () => {
    spyOn((component as any), 'setupDataSource');
    component.customColumns = {
      toArray(): TzTableCustomColumnComponent[] {
        return [];
      }
    } as any;
    component.ngAfterViewInit();
    expect(component['setupDataSource']).toHaveBeenCalled();
  });
});
