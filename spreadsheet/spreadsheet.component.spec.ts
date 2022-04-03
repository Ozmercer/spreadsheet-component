import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadsheetComponent } from './spreadsheet.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { ValuePipe } from '@turntown/shared';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';

class mockPipe {
  transform() {}
}

describe('SpreadsheetComponent', () => {
  let component: SpreadsheetComponent;
  let fixture: ComponentFixture<SpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpreadsheetComponent],
      imports: [NgxsModule.forRoot(), MatRadioModule, MatInputModule, AgGridModule, MatIconModule],
      providers: [{ provide: ValuePipe, useClass: mockPipe }],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.grid.rowData = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
