import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CostPlanningService, TnTModelListCostPlanningCarbonCalculatorOption } from '@turntown/api/open-api';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { getCarbonOptions, setCarbonLoading, setCarbonOptionsMap } from './carbon-calculator.actions';
import { of } from 'rxjs';
import { CarbonOptionsByCodeMap } from './carbon-calculator.interfaces';

// TODO: Remove mocks once database is populated
const mockResponse: TnTModelListCostPlanningCarbonCalculatorOption = {
  'data': [
    {
      'id': 'a103767d-6fa1-44a4-a3e5-6180390056e9',
      'code': '1.1.1.1/1',
      'description': 'description1',
      'name': 'option 1',
      'mom': {
        'id': 'a1595952-1952-4917-a76f-660bb06eac88',
      },
      'carbonCalculatorMaterialTypes': [
        {
          'id': '35e92c36-7796-43d2-b2b4-d83c7dab3e29',
          'name': 'material_type1',
          'carbonCalculatorOption': {
            'id': 'a103767d-6fa1-44a4-a3e5-6180390056e9',
          },
          'carbonCalculatorMaterials': [
            {
              'id': '2a84a1d7-8931-43c1-b371-ad50ac5c1375',
              'description': 'material_description1',
              'uom': 'm3',
              'a1A3CarbonRate': 220.03,
              'a4CarbonRate': 17.16,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '35e92c36-7796-43d2-b2b4-d83c7dab3e29',
              },
            },
          ],
        },
        {
          'id': '73ef815e-1619-4b8f-aa1b-c40b5e4517fd',
          'name': 'material_type2',
          'carbonCalculatorOption': {
            'id': 'a103767d-6fa1-44a4-a3e5-6180390056e9',
          },
          'carbonCalculatorMaterials': [
            {
              'id': 'e3911724-cf7d-4533-b66d-8487db8b392e',
              'description': 'material_description2',
              'uom': 'm3',
              'a1A3CarbonRate': 10.1,
              'a4CarbonRate': 6,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '73ef815e-1619-4b8f-aa1b-c40b5e4517fd',
              },
            },
          ],
        },
      ],
    },
    {
      'id': 'f4b87132-e2b9-4f84-8dad-cc193e07a7d8',
      'code': '1.1.1.1/1',
      'description': 'description2',
      'name': 'option 2',
      'mom': {
        'id': 'a1595952-1952-4917-a76f-660bb06eac88',
      },
      'carbonCalculatorMaterialTypes': [
        {
          'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
          'name': 'material_type3',
          'carbonCalculatorOption': {
            'id': 'f4b87132-e2b9-4f84-8dad-cc193e07a7d8',
          },
          'carbonCalculatorMaterials': [
            {
              'id': '5d147df9-0371-4a7c-8d36-9c9864f6d0e9',
              'description': 'material_description3',
              'uom': 'm2',
              'a1A3CarbonRate': 5.03,
              'a4CarbonRate': 100,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
              },
            },
            {
              'id': '7c1d522e-4e46-43be-afdd-69372f15e04e',
              'description': 'material_description4',
              'uom': 'm2',
              'a1A3CarbonRate': null,
              'a4CarbonRate': null,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
              },
            },
          ],
        },
      ],
    },
    {
      'id': 'f4b87132-e2b9-4f84-8dad-cc193e07a7d8',
      'code': '2.1.1.1/1',
      'description': 'description2',
      'name': 'option 2',
      'mom': {
        'id': 'a1595952-1952-4917-a76f-660bb06eac88',
      },
      'carbonCalculatorMaterialTypes': [
        {
          'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
          'name': 'material_type3',
          'carbonCalculatorOption': {
            'id': 'f4b87132-e2b9-4f84-8dad-cc193e07a7d8',
          },
          'carbonCalculatorMaterials': [
            {
              'id': '5d147df9-0371-4a7c-8d36-9c9864f6d0e9',
              'description': 'material_description3',
              'uom': 'm2',
              'a1A3CarbonRate': 5.03,
              'a4CarbonRate': 100,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
              },
            },
            {
              'id': '7c1d522e-4e46-43be-afdd-69372f15e04e',
              'description': 'material_description4',
              'uom': 'm2',
              'a1A3CarbonRate': null,
              'a4CarbonRate': null,
              'a5CarbonRate': null,
              'wastage': null,
              'region': null,
              'carbonCalculatorMaterialType': {
                'id': '2baea826-7c1f-4b1a-b074-5a5457280344',
              },
            },
          ],
        },
      ],
    },
  ],
};

@Injectable()
export class CarbonCalculatorEffects {
  getCarbonCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCarbonOptions),
      tap(() => this.store.dispatch(setCarbonLoading({ isLoading: true }))),
      switchMap(({ momId }) => this.costPlanningService.getCarbonCalculatorOptionsAndMaterials({ momId }).pipe(
        catchError(() => of({ data: [] })),
        // TODO: Store real data once endpoint is populated (TT-8190)
        switchMap(() => {
          const optionsMap: CarbonOptionsByCodeMap = mockResponse.data.reduce((mapObj, option) => {
            mapObj[option.code]
              ? mapObj[option.code].push(option)
              : mapObj[option.code] = [option];

            return mapObj;
          }, {});

          return [
            setCarbonOptionsMap({ optionsMap }),
            setCarbonLoading({ isLoading: false }),
          ];
        }),
      )),
    ),
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private costPlanningService: CostPlanningService,
  ) {}
}
