import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { Topic } from 'app/models/topic';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';

export interface DataModel {
  title: string;
  message: string;
  model: Topic;
}

@Component({
  templateUrl: './add-edit-Contact.component.html',
  styleUrls: ['./add-edit-Contact.component.scss']
})

// NOTE: dialog components must not implement OnDestroy
//       otherwise they don't return a result
export class AddEditContactComponent implements OnInit {
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  public contactForm: FormGroup;
  public isEditing = false;
  public loading = false;
  public phonePattern;


  public tinyMceSettings = {
    skin: false,
    browser_spellcheck: true,
    height: 240
  };

  public organizations = [
    { _id: 1, name: 'test1' },
    { _id: 2, name: 'test2' },
    { _id: 3, name: 'test3' }
  ];

  public salutationList = ['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Ms'];
  public provinceList = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        if (Object.keys(res).length === 0 && res.constructor === Object) {
          this.buildForm({
            'firstName': '',
            'middleName': '',
            'lastName': '',
            'displayName': '',
            'email': '',
            'org': '',
            'title': '',
            'phoneNumber': '',
            'salutation': '',
            'department': '',
            'faxNumber': '',
            'cellPhoneNumber': '',
            'address1': '',
            'address2': '',
            'city': '',
            'province': '',
            'country': '',
            'postalCode': '',
            'notes': ''
          });
        } else {
          this.isEditing = true;
          // this.buildForm(res.activity.data);
        }
        this.loading = false;
      });
  }

  private buildForm(data) {
    this.contactForm = new FormGroup({
      'firstName': new FormControl(data.firstName),
      'middleName': new FormControl(data.middleName),
      'lastName': new FormControl(data.lastName),
      'displayName': new FormControl(data.displayName),
      'email': new FormControl(data.email),
      'org': new FormControl(data.org),
      'title': new FormControl(data.title),
      'phoneNumber': new FormControl(data.phoneNumber),
      'salutation': new FormControl(data.salutation),
      'department': new FormControl(data.department),
      'faxNumber': new FormControl(data.faxNumber),
      'cellPhoneNumber': new FormControl(data.cellPhoneNumber),
      'address1': new FormControl(data.address1),
      'address2': new FormControl(data.address2),
      'city': new FormControl(data.city),
      'province': new FormControl(data.province),
      'country': new FormControl(data.country),
      'postalCode': new FormControl(data.postalCode),
      'notes': new FormControl(data.notes),
    });
  }

  onSubmit() {
    if (!this.isEditing) {
      let user = new User({
        firstName: this.contactForm.controls.firstName.value,
        middleName: this.contactForm.controls.middleName.value,
        lastName: this.contactForm.controls.lastName.value,
        displayName: this.contactForm.controls.displayName.value,
        email: this.contactForm.controls.email.value,
        org: this.contactForm.controls.org.value,
        title: this.contactForm.controls.title.value,
        phoneNumber: this.contactForm.controls.phoneNumber.value,
        salutation: this.contactForm.controls.salutation.value,
        department: this.contactForm.controls.department.value,
        faxNumber: this.contactForm.controls.faxNumber.value,
        cellPhoneNumber: this.contactForm.controls.cellPhoneNumber.value,
        address1: this.contactForm.controls.address1.value,
        address2: this.contactForm.controls.address2.value,
        city: this.contactForm.controls.city.value,
        province: this.contactForm.controls.province.value,
        country: this.contactForm.controls.country.value,
        postalCode: this.contactForm.controls.postalCode.value,
        notes: this.contactForm.controls.notes.value
      });
      this.userService.add(user)
        .subscribe(item => {
          console.log('item', item);
          this.router.navigate(['/activity']);
        });
    }
  }

  addOrganization() {
    this.router.navigate(['/contacts', 'add', 'add-org']);
  }

  get phoneNumber() {
    return this.contactForm.get('phoneNumber');
  }
  get faxNumber() {
    return this.contactForm.get('faxNumber');
  }
  get cellPhoneNumber() {
    return this.contactForm.get('cellPhoneNumber');
  }
}
