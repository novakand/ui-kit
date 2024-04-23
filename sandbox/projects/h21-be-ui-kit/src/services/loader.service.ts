import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LoaderService {

  public loadScript(src) {
    return new Observable((observer) => {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = src;
      scriptElement.onload = () => {
        observer.next(src);
        observer.complete();
      };
      scriptElement.onerror = () => observer.error(`Couldn\'t load ${src}`);
      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    });
  }

}
