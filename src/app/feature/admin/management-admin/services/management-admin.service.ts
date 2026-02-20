import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementAdminService extends LandaService {
  getUsers(arrParameter: any = {}) {
    return this.DataGet('/v1/users', arrParameter);
  }

  getUsersById(userId: string | number) {
    return this.DataGet('/v1/users/' + userId);
  }

  createUsers(payload: any) {
    return this.DataPost('/v1/users', payload);
  }

  updateUsers(payload: any) {
    return this.DataPut('/v1/users', payload);
  }

  deleteUsers(userId: string | number) {
    return this.DataDelete('/v1/users/' + userId);
  }

  updateStatus(payload: any) {
    return this.DataPut('/v1/users/update-status', payload);
  }

  updateRoles(payload: any) {
    return this.DataPut('/v1/users/update-roles', payload);
  }

  getWithoutPaginateRoles(arrParameter: any = {}) {
    return this.DataGet('/v1/roles/getWithoutPaginate', arrParameter);
  }
}