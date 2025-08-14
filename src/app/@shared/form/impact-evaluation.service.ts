import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Category, CategoryGroup, CategoryGroupInput, CategoryInput, Dimension } from './interface';

const routes = {
  dimension: () => `/v1/general/dimension/`,
  categoryGroup: () => `/v1/general/category_group/`,
  category: () => `/v1/general/category/`,
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
}
