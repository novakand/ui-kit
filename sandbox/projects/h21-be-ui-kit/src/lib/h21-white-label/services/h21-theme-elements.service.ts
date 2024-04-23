import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IRequestOptions } from '../../../interfaces/request-options.interface';
import { IQueryResult } from '../../../interfaces/query-result.interface';
import { ThemeElement } from '../models/theme-element.model';
import { H21ThemeApiService } from './h21-theme-api.service';
import { Query } from '../../../models/query.model';

@Injectable({
  providedIn: 'root',
})
export class H21ThemeElementsService {

  private _model = 'WhiteLabelElement';

  constructor(private _http: H21ThemeApiService) { }

  public find(filter: Query<any>, options?: IRequestOptions): Observable<IQueryResult<ThemeElement>> {
    return this._http.postQuery<ThemeElement>(this._model, filter, options);
  }

  public save(elements: ThemeElement[]): Observable<ThemeElement[]> {
    return this._http.postApi<ThemeElement[]>(`${this._model}/PostEntities`, elements);
  }

  public groupByThemeId(elements: ThemeElement[]): any {
    return elements.reduce((container, element) => {
      container[element.themeId] = container[element.themeId] || [];
      container[element.themeId].push(element);
      return container;
    }, Object.create(null));
  }

  public getValueByElement(theme, name: string): ThemeElement {
    return theme && theme.elements.find((element) => element.name === name);
  }

}
