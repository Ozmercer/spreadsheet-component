import { createAction, props } from '@ngrx/store';
import { CarbonOptionsByCodeMap } from './carbon-calculator.interfaces';

export const carbonCalculatorActions = {
  getCarbonLineItems: '[CostPlanning Workspace Carbon-Calculator] Get Carbon Line Items',
  setCarbonLineItems: '[CostPlanning Workspace Carbon-Calculator] Set Carbon Line Items',
  setCarbonLoading: '[CostPlanning Workspace Carbon-Calculator] Set Carbon Loading',
};

export const getCarbonOptions = createAction(carbonCalculatorActions.getCarbonLineItems, props<{ momId: string }>());
export const setCarbonOptionsMap = createAction(carbonCalculatorActions.setCarbonLineItems, props<{ optionsMap: CarbonOptionsByCodeMap }>());
export const setCarbonLoading = createAction(carbonCalculatorActions.setCarbonLoading, props<{ isLoading: boolean }>());
