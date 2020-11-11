/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Auth.configService } from './auth.config.service';

describe('Service: Auth.config', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth.configService]
    });
  });

  it('should ...', inject([Auth.configService], (service: Auth.configService) => {
    expect(service).toBeTruthy();
  }));
});
