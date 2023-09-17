import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSimplesComponent } from './relatorio-simples.component';

describe('RelatorioSimplesComponent', () => {
  let component: RelatorioSimplesComponent;
  let fixture: ComponentFixture<RelatorioSimplesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioSimplesComponent]
    });
    fixture = TestBed.createComponent(RelatorioSimplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
