import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeResourceUrl',
})
export class SafeResourceUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(html: string, args?: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }

}
