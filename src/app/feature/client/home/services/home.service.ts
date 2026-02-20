import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
;

@Injectable({
  providedIn: 'root',
})
export class HomeService extends LandaService {

  getProgramPerState(arrParameter = {}) {
    return this.DataGet('/v1/dashboard/data-program-perstate', arrParameter);
  }

  getDataSummary(arrParameter = {}) {
    return this.DataGet('/v1/dashboard/data-summary', arrParameter);
  }

  getOptionFilter(arrParameter = {}) {
    return this.DataGet('/v1/dashboard/option-filter', arrParameter);
  }

  getProgramCountPerProvinsi(arrParameter = {}) {
    return this.DataGet('/v1/dashboard/total-program-per-provinsi', arrParameter);
  }

}
