import { Injectable } from '@angular/core';
import { LandaAuthService } from '../../core/services/landa-auth.service';
import { LandaService } from '../../core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutsService {
  constructor(
    private landaAuthService: LandaAuthService,
    private landaService: LandaService
  ) { }


  getInformationProfile(arrParameter = {}) {
    return this.landaService.DataGet('/v1/auth/profile', arrParameter);
  }

}
