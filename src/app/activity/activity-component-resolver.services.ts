import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SearchService } from 'app/services/search.service';
import { TableTemplateUtils } from 'app/shared/utils/table-template-utils';

@Injectable()
export class ActivityComponentResolver implements Resolve<Observable<object>> {
  constructor(
    private searchService: SearchService,
    private tableTemplateUtils: TableTemplateUtils
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<object> {
    const activity = route.paramMap.get('activityId');
    if (activity) {
      return this.searchService.getItem(activity, 'RecentActivity');
    } else {
      let tableParams = this.tableTemplateUtils.getParamsFromUrl(route.params);
      if (tableParams.sortBy === '') {
        tableParams.sortBy = '-dateAdded';
        this.tableTemplateUtils.updateUrl(tableParams.sortBy, tableParams.currentPage, tableParams.pageSize, null, tableParams.keywords);
      }
      return this.searchService.getSearchResults(
        tableParams.keywords || '',
        'RecentActivity',
        null,
        tableParams.currentPage,
        tableParams.pageSize,
        tableParams.sortBy,
        null,
        true);
    }
  }
}
