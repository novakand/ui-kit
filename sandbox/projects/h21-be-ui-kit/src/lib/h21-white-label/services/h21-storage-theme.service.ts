import { Injectable } from '@angular/core';

// external lbraries
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import cssVars from 'css-vars-ponyfill';

// models
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class H21StorageThemeService {

  private _themeChanged = new BehaviorSubject<Theme>(null);

  get themeChanged(): Observable<Theme> {
    return this._themeChanged.asObservable();
  }

  public update(theme: Theme): void {

    const themeSelector = '.h21-theme';
    const selector: any = document.querySelector(themeSelector);

    if (theme.isDark) {
      selector.classList.add('h21-theme__dark');
    } else {
      selector.classList.remove('h21-theme__dark');
    }

    theme.elements.forEach((property) => {
      selector.style.setProperty(`--${property.property}-hex`, property.colorHexCode);
      selector.style.setProperty(`--${property.property}-rgb`, property.colorRgbCode);

      selector.style.setProperty(`--on-${property.property}-hex`, property.contrastHexCode);
      selector.style.setProperty(`--on-${property.property}-rgb`, property.contrastRgbCode);
    });

    this._setBorderRadius(theme, selector);
    localStorage.setItem('theme', JSON.stringify(theme));
    this._themeChanged.next(theme);

    if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
      this._ieSupport(theme);
    }
  }

  public applyTheme(): void {
    const theme: Theme = JSON.parse(localStorage.getItem('theme'));
    theme && this.update(theme);
  }

  public currentTheme(): Theme {
    return JSON.parse(localStorage.getItem('theme'));
  }

  private _setBorderRadius(theme: Theme, selector: any) {
    selector.style.setProperty('--borderRadius', `${theme.buttonBorderRadius}px`);
  }

  private _ieSupport(theme: Theme): void {
    const parameters = {
      borderRadius: `${theme.buttonBorderRadius}px`,
    };

    theme.elements.forEach((property) => {
      parameters[`${property.property}-hex`] = property.colorHexCode;
      parameters[`${property.property}-rgb`] = property.colorRgbCode;
      if (property.contrastHexCode) {
        parameters[`on-${property.property}-hex`] = property.contrastHexCode;
        parameters[`on-${property.property}-rgb`] = property.contrastRgbCode;
      }
    });

    if (theme.isDark) {
      parameters['foregraund-rgb'] = '255, 255, 255;';
      parameters['foregraund-hex'] = '#ffffff';
      parameters['background-rgb'] = '63, 63, 63';
      parameters['background-hex'] = '#3f3f3f';
    } else {
      parameters['foregraund-rgb'] = '0, 0, 0';
      parameters['foregraund-hex'] = '#000000';
      parameters['background-rgb'] = '255, 255, 255';
      parameters['background-hex'] = '#ffffff';
    }

    cssVars({ variables: parameters });
  }

}
