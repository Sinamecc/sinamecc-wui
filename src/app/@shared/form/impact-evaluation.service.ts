import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Category, CategoryCT, CategoryGroup, Characteristic, Dimension } from './types/results';
import { CategoryGroupInput, CategoryInput } from './types/payload';

const routes = {
  dimension: () => `/v1/general/dimension/`,
  categoryGroup: () => `/v1/general/category_group/`,
  category: () => `/v1/general/category/`,
  categoryCT: () => `/v1/general/category_ct/`,
  characteristics: () => `/v1/general/characteristic/`,
};

@Injectable()
export class ImpactEvaluationService {
  constructor(private httpClient: HttpClient) {}

  getDimensions() {
    return this.httpClient.get(routes.dimension()).pipe(
      map((response: Dimension[]) => {
        return response;
      }),
    );
  }

  getCategoryGroupsByDimensions(dimensions: CategoryGroupInput) {
    return this.httpClient.post(routes.categoryGroup(), dimensions).pipe(
      map((response: CategoryGroup[]) => {
        return response;
      }),
    );
  }

  getCategoryGroups() {
    return this.httpClient.get(routes.categoryGroup()).pipe(
      map((response: any) => {
        return response;
      }),
    );
  }

  getCategoriesByCategoryGroups(categoryGroups: CategoryInput) {
    return this.httpClient.post(routes.category(), categoryGroups).pipe(
      map((response: Category[]) => {
        return response;
      }),
    );
  }

  getCategories() {
    return this.httpClient.get(routes.category()).pipe(
      map((response: Category[]) => {
        return response;
      }),
    );
  }

  getCategoryCT() {
    return this.httpClient.get(routes.categoryCT()).pipe(
      map((response: CategoryCT[]) => {
        return response;
      }),
    );
  }

  getCharacteristics() {
    return this.httpClient.get(routes.characteristics()).pipe(
      map((response: Characteristic[]) => {
        return response;
      }),
    );
  }
}
