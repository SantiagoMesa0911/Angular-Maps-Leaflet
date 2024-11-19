import { TestBed } from '@angular/core/testing';

import { MakersService } from './makers.service';

describe('MakersService', () => {
  let service: MakersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
