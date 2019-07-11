import { TestBed } from '@angular/core/testing';

import { OrganizationsResolverService } from './organizations-resolver.service';

describe('ContactsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationsResolverService = TestBed.get(OrganizationsResolverService);
    expect(service).toBeTruthy();
  });
});
