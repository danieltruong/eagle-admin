import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { SearchTerms } from 'app/models/search';

import { StorageService } from 'app/services/storage.service';

import { AddOrganizationTableRowsComponent } from './add-organization-table-rows/add-organization-table-rows.component';
import { TableObject } from 'app/shared/components/table-template/table-object';
import { TableParamsObject } from 'app/shared/components/table-template/table-params-object';
import { TableTemplateUtils } from 'app/shared/utils/table-template-utils';
import { encode } from 'punycode';
import { Org } from 'app/models/org';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOrganizationComponent implements OnInit, OnDestroy {
  public terms = new SearchTerms();
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public organizations: Org[] = null;
  public loading = true;

  public isEditing = false;

  public organizationTableData: TableObject;
  public OrganizationTableColumns: any[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-6'
    },
    {
      name: 'Company Type',
      value: 'companyType',
      width: 'col-6'
    }
  ];

  public currentProject;
  public currentCommentPeriod;
  public originalSelectedDocs = [];
  public selectedCount = 0;
  public tableParams: TableParamsObject = new TableParamsObject();

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private location: PlatformLocation,
    private route: ActivatedRoute,
    private router: Router,
    public storageService: StorageService,
    public tableTemplateUtils: TableTemplateUtils
  ) {
    this.location.onPopState(() => {
      // TODO: if navigating anywhere, we should ask the user if they really want to do that.
      this.storageService.state.selectedDocumentsForCP.data = this.originalSelectedDocs;
    });
  }

  ngOnInit() {

    // get data from route resolver
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.tableParams = this.tableTemplateUtils.getParamsFromUrl(params);
        if (this.tableParams.sortBy === '') {
          this.tableParams.sortBy = '+name';
          this.tableTemplateUtils.updateUrl(this.tableParams.sortBy, this.tableParams.currentPage, this.tableParams.pageSize, null, this.tableParams.keywords);
        }
      });


    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: any) => {
        if (res) {
          if (res.organizations[0].data.meta && res.organizations[0].data.meta.length > 0) {
            this.tableParams.totalListItems = res.organizations[0].data.meta[0].searchResultsTotal;
            this.organizations = res.organizations[0].data.searchResults;
          } else {
            this.tableParams.totalListItems = 0;
            this.organizations = [];
          }
          this.setRowData();
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        } else {
          alert('Uh-oh, couldn\'t load valued components');
          // project not found --> navigate back to search
          this.router.navigate(['/search']);
        }
      });
  }

  public onSubmit(currentPage) {
    // dismiss any open snackbar
    // if (this.snackBarRef) { this.snackBarRef.dismiss(); }

    // NOTE: Angular Router doesn't reload page on same URL
    // REF: https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
    // WORKAROUND: add timestamp to force URL to be different than last time

    console.log('!@#!@#!', currentPage);

    // Reset page.
    const params = this.terms.getParams();
    params['ms'] = new Date().getMilliseconds();
    params['currentPage'] = currentPage;
    params['sortBy'] = this.tableParams.sortBy;
    params['keywords'] = encode(this.tableParams.keywords = this.tableParams.keywords || '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    params['pageSize'] = this.tableParams.pageSize;

    if (this.isEditing) {
      this.router.navigate(['p', this.currentProject._id, 'cp', this.currentCommentPeriod._id, 'edit', 'add-documents', params]);
    } else {
      this.router.navigate(['contacts', 'add', 'add-org', params]);
    }
  }

  setRowData() {
    let organizationList = [];
    if (this.organizations && this.organizations.length > 0) {
      this.organizations.forEach(Organization => {
        organizationList.push(
          {
            name: Organization.name,
            companyType: Organization.companyType
          }
        );
      });
      this.organizationTableData = new TableObject(
        AddOrganizationTableRowsComponent,
        organizationList,
        this.tableParams
      );
    }
  }

  setColumnSort(column) {
    if (this.tableParams.sortBy.charAt(0) === '+') {
      this.tableParams.sortBy = '-' + column;
    } else {
      this.tableParams.sortBy = '+' + column;
    }
    this.onSubmit(this.tableParams.currentPage);
  }

  // isEnabled(button) {
  //   switch (button) {
  //     case 'copyLink':
  //       return this.selectedCount === 1;
  //       break;
  //     default:
  //       return this.selectedCount > 0;
  //       break;
  //   }
  // }

  // updateSelectedRow(count) {
  //   this.selectedCount = count;
  // }

  // removeSelectedDoc(doc) {
  //   this.storageService.state.selectedDocumentsForCP.data = this.storageService.state.selectedDocumentsForCP.data.filter(obj => obj._id !== doc._id);
  //   this.documentTableData.data.map((item) => {
  //     if (item._id === doc._id) {
  //       item.checkbox = false;
  //     }
  //   });
  // }

  // clearSelectedDocs(navigation) {
  //   if (confirm('Are you sure you want to leave the page. All selected documents will be lost.')) {
  //     this.storageService.state.selectedDocumentsForCP.data = this.originalSelectedDocs;
  //     this.router.navigate(navigation);
  //   }
  // }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
