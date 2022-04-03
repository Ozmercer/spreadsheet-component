import { CarbonCalculatorModel } from './carbon-calculator.interfaces';
import { createReducer, on } from '@ngrx/store';
import { setCarbonLoading, setCarbonOptionsMap } from './carbon-calculator.actions';

const initialState: CarbonCalculatorModel = {
  optionsMap: {},
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(setCarbonOptionsMap, (state, { optionsMap }) => ({
    ...state,
    optionsMap,
  })),
  on(setCarbonLoading, (state, { isLoading }) => ({
    ...state,
    loading: isLoading,
  })),
);
