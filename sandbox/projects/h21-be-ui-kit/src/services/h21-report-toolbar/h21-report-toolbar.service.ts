import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// interfaces
import { IQueryResult } from '../../interfaces';
import { IReportData } from './report-data.interface';
import { IToolbarActionButton } from '../../lib/h21-top-toolbar/models/i-toolbar-action-button';

// models
import { Query } from '../../models/query.model';
import { VaucherReportParameter } from './models/vaucher-report-parameter.model';

// services
import { SettingsService } from '../settings.service';
import { HttpClientService } from '../http-client.service';

@Injectable()
export class H21ReportToolbarService {

  constructor(private _settings: SettingsService,
              private _httpService: HttpClientService,
  ) {}

  public getReportMenu(orderItemId?: number, kindId?: number): Observable<IToolbarActionButton[]> {
    const url = `${this._settings.environment.profileApi}Report/PostQuery`;
    return this._httpService.post<IQueryResult<IReportData>>(url, this._getQuery(kindId))
      .pipe(map((response) =>  response.items.map((x: IReportData) => this._getToolBarItem(x, orderItemId))));
  }

  public openVoucherReport(orderItemId: number, reportExternalId: string): void {
    this._navigate(reportExternalId, this._getVoucherParameters(orderItemId));
  }

  private _getQuery(kindId?: number): Query<any> {
    return  new Query<any>({ filter: { kindId: kindId, nameContains: 'Vaucher' } });
  }

  private _getToolBarItem(report: IReportData, orderItemId?: number): IToolbarActionButton {
    return {
      name: report.externalId,
      disabled: false,
      tooltipText: report.name,
      icon: null,
      action: () => this._navigate(report.externalId, this._getVoucherParameters(orderItemId)),
      visible: true,
    };
  }

  private _navigate(externalId: string, param: string): void {
    window.open(`${this._settings.environment.reportUrl}ReportView/${externalId}?param=${param}`);
  }

  private _getVoucherParameters(orderItemId?: number): string {
  const parametersObj: VaucherReportParameter = new VaucherReportParameter();
  parametersObj.orderItemId = orderItemId;
  return JSON.stringify(parametersObj);
}

}
