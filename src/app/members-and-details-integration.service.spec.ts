/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MembersAndDetailsIntegrationService } from './members-and-details-integration.service';

describe('Service: MembersAndDetailsIntegration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MembersAndDetailsIntegrationService]
    });
  });

  it('should ...', inject([MembersAndDetailsIntegrationService], (service: MembersAndDetailsIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
