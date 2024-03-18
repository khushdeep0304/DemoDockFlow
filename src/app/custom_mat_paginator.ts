
import {Injectable} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  label = {fr :"salles per page :" , en :"venues per page :"}
  constructor(private translocoService: TranslocoService) {
    super();  

    this.translocoService.langChanges$.subscribe((activeLang) => {
      this.getAndInitTranslations(activeLang)
  });
  }




  getAndInitTranslations(activeLang) {
   
      this.itemsPerPageLabel = this.label[activeLang];
      this.changes.next();
   
  }

}