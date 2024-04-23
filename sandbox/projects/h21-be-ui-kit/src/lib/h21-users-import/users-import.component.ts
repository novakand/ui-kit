import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// external libs
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';

// services
import { LoadProgressService } from '../../services/load-progress.service';
import { UserProfileImportService } from './user-profile-import.service';

// enums
import { PictureType } from '../h21-picture-lib/picture-type.enum';

@Component({
  selector: 'h21-users-import',
  templateUrl: './users-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserProfileImportService],
})
export class UsersImportComponent implements OnInit, OnDestroy {

  public pictureType: PictureType;
  public title: string;
  public downLoadButtonName: string;
  public toolTipText: string;

  public hasImport: boolean;
  public downloading: boolean;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _router: Router,
              private _http: HttpClient,
              private _cdr: ChangeDetectorRef,
              private _loadProgressService: LoadProgressService,
              private _importService: UserProfileImportService,
  ) {}

  public ngOnInit(): void {
    this.title = this._importService.importSettings.entityNames;
    this.pictureType = this._importService.importSettings.pictureType;
    this.downLoadButtonName = `Import ${this._importService.importSettings.entityNames}`;
    this.toolTipText = `Download template for ${this._importService.importSettings.entityName} import`;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public openCreateTraveller() {
    this._router.navigate(['travellers/traveller', 0]);
  }

  public downloadTemplate(): void {
    this._loadProgressService.show(1);
    this.downloading = true;

    this._http.get(this._importService.importSettings.sourceUrl, { responseType: 'blob' })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data) => {
          const file = new File([data], this._importService.importSettings.filename, { type: 'text/plain;charset=utf-8' });
          saveAs(file);

          this._loadProgressService.hide(1);
          this.downloading = false;
          this._cdr.detectChanges();
        },
      });
  }

  public uploadImportFile(target: EventTarget, files: FileList): void {
    this._importService.importUsers(target, files[0]);
  }

}
