import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarbonCalculatorComponent } from './carbon-calculator.component';
import { CcSubProjectComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CarbonCalculatorComponent,
    children: [
      {
        path: ':subProjectId',
        component: CcSubProjectComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarbonCalculatorRoutingModule {}
