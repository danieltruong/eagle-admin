import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SearchService } from 'app/services/search.service';

@Injectable()
export class EditOrganizationResolver implements Resolve<Observable<object>> {
  constructor(
    private searchService: SearchService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<object> {
    const orgId = route.paramMap.get('orgId');
    return this.searchService.getItem(orgId, 'Organization');
  }
}
