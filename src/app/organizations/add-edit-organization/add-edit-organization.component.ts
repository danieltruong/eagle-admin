import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { OrgService } from 'app/services/org.service';
import { StorageService } from 'app/services/storage.service';

import { Org } from 'app/models/org';

@Component({
  templateUrl: './add-edit-organization.component.html',
  styleUrls: ['./add-edit-organization.component.scss']
})

export class AddEditOrganizationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  public orgForm: FormGroup;
  public isEditing = false;
  public loading = false;
  public phonePattern;
  public contactOrganizationName = '';
  public contactId = '';
  public contact = null;


  public tinyMceSettings = {
    skin: false,
    browser_spellcheck: true,
    height: 240
  };

  public companyTypeList = [
    'Indigenous Group',
    'Proponent/Certificate Holder',
    'Other Agency',
    'Local Government',
    'Municipality',
    'Ministry',
    'Consultant',
    'Other Government',
    'Community Group',
    'Other'
  ];
  public provinceList = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private orgService: OrgService
  ) { }

  ngOnInit() {
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        let org = '';
        if (this.storageService.state.selectedOrganization) {
          this.contactOrganizationName = this.storageService.state.selectedOrganization.name;
          org = this.storageService.state.selectedOrganization._id;
        }

        this.isEditing = Object.keys(res).length === 0 && res.constructor === Object ? false : true;

        if (this.storageService.state.orgForm == null) {
          if (!this.isEditing) {
            this.buildForm({
              'description': '',
              'name': '',
              'country': '',
              'postal': '',
              'province': '',
              'city': '',
              'address1': '',
              'address2': '',
              'companyType': '',
              'parentCompany': '',
              'companyLegal': '',
              'company': ''
            });
          } else {
            if (org !== '') {
              res.contact.data.org = org;
              res.contact.data.orgName = this.contactOrganizationName;
            } else {
              this.contactOrganizationName = res.contact.data.orgName;
            }
            this.buildForm(res.contact.data);
          }
        } else {
          this.contactId = this.isEditing ? res.contact.data._id : '';
          this.orgForm = this.storageService.state.orgForm;
          this.orgForm.controls.org.setValue(org);
        }
        this.loading = false;
      });
  }

  private buildForm(data) {
    this.orgForm = new FormGroup({
      'description': new FormControl(data.description),
      'name': new FormControl(data.name),
      'country': new FormControl(data.country),
      'postal': new FormControl(data.postal),
      'province': new FormControl(data.province),
      'city': new FormControl(data.city),
      'address1': new FormControl(data.address1),
      'address2': new FormControl(data.address2),
      'companyType': new FormControl(data.companyType),
      'parentCompany': new FormControl(data.parentCompany),
      'companyLegal': new FormControl(data.companyLegal),
      'company': new FormControl(data.company)
    });
  }

  onSubmit() {
    // Validating form
    // TODO: cover all validation cases.
    if (this.orgForm.controls.name.value === '') {
      alert('Name cannot be empty.');
      return;
    }

    let org = new Org({
      description: this.orgForm.controls.description.value,
      name: this.orgForm.controls.name.value,
      country: this.orgForm.controls.country.value,
      postal: this.orgForm.controls.postal.value,
      province: this.orgForm.controls.province.value,
      city: this.orgForm.controls.city.value,
      address1: this.orgForm.controls.address1.value,
      address2: this.orgForm.controls.address2.value,
      companyType: this.orgForm.controls.companyType.value ? this.orgForm.controls.companyType.value : this.orgForm.controls.name.value,
      parentCompany: this.orgForm.controls.parentCompany.value,
      companyLegal: this.orgForm.controls.companyLegal.value,
      company: this.orgForm.controls.company.value
    });

    if (!this.isEditing) {
      // this.orgService.add(org)
      //   .subscribe(item => {
      //     console.log('item', item);
      //     this.router.navigate(['/administration', 'orgs']);
      //   });
    } else {
      // user._id = this.contactId;
      // this.userService.save(user)
      //   .subscribe(item => {
      //     console.log('item', item);
      //     this.router.navigate(['/contacts']);
      //   });
    }
  }

  public onCancel() {
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
