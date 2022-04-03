import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarbonCalculatorRoutingModule } from './carbon-calculator-routing.module';
import { CarbonCalculatorComponent } from './carbon-calculator.component';
import { SharedModule } from '@turntown/shared/shared.module';
import { MaterialModule } from '@turntown/shared/modules/material/material.module';
import { ComponentsModule } from '@turntown/components';
import { ComponentsSmartModule } from '@turntown/components-smart';
import { WorkspaceModule } from '../workspace.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CarbonCalculatorEffects, featureName, reducer } from './store';
import { CcSubProjectComponent, MaterialsCardComponent, MaterialsTableComponent } from './components';

@NgModule({
  declarations: [
    CcSubProjectComponent,
    CarbonCalculatorComponent,
    MaterialsCardComponent,
    MaterialsTableComponent,
  ],
  imports: [
    CommonModule,
    CarbonCalculatorRoutingModule,
    SharedModule,
    MaterialModule,
    ComponentsModule,
    ComponentsSmartModule,
    WorkspaceModule,
    EffectsModule.forFeature([CarbonCalculatorEffects]),
    StoreModule.forFeature(featureName, reducer),
  ],
})
export class CarbonCalculatorModule {}
