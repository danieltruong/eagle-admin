import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditContactComponent } from './contacts/add-edit-contact/add-edit-contact.component';
import { LoginComponent } from './login/login.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { SearchComponent } from './search/search.component';
import { AdministrationComponent } from './administration/administration.component';
import { TopicsComponent } from './administration/topics/topics.component';
import { MapComponent } from './map/map.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ActivityComponent } from './activity/activity.component';
import { SearchHelpComponent } from './search-help/search-help.component';

import { ContactsResolverService } from './contacts/contacts-resolver.service';
import { ActivityComponentResolver } from './activity/activity-component-resolver.services';

import { CanDeactivateGuard } from 'app/services/can-deactivate-guard.service';
import { AddEditActivityComponent } from './activity/add-edit-activity/add-edit-activity.component';
import { TopicsResolver } from './administration/topics/topics-resolver.services';
import { PinsGlobalComponentResolver } from './project/pins-list/pins-global-resolver.service';
import { AddOrganizationResolver } from './contacts/add-organization/add-organization-resolver.services';
import { AddOrganizationComponent } from './contacts/add-organization/add-organization.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'administration',
    component: AdministrationComponent
  },
  {
    path: 'administration/topics',
    component: TopicsComponent,
    resolve: {
      topics: TopicsResolver
    }
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'metrics',
    component: MetricsComponent
  },
  {
    path: 'contacts/add/add-org',
    component: AddOrganizationComponent,
    resolve: {
      organizations: AddOrganizationResolver
    }
  },
  {
    path: 'contacts/add',
    component: AddEditContactComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    resolve: {
      users: ContactsResolverService
    }
  },
  {
    path: 'activity',
    component: ActivityComponent,
    resolve: {
      activities: ActivityComponentResolver
    },
  },
  {
    path: 'activity/:activityId/edit',
    component: AddEditActivityComponent,
    resolve: {
      activity: ActivityComponentResolver
    }
  },
  {
    path: 'activity/add',
    component: AddEditActivityComponent
  },
  {
    path: 'search-help',
    component: SearchHelpComponent
  },
  {
    // default route
    path: '',
    component: SearchComponent
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    ContactsResolverService,
    PinsGlobalComponentResolver,
    ActivityComponentResolver,
    AddOrganizationResolver,
    TopicsResolver
  ]
})

export class AppRoutingModule { }
