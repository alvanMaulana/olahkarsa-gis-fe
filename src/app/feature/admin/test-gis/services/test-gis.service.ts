import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestGisService extends LandaService {

  // ================= LAYER APIs =================

  getLayers(params = {}) {
    return this.DataGet('/gis/layers', params);
  }

  getLayer(id: number) {
    return this.DataGet(`/gis/layers/${id}`);
  }

  createLayer(data: any) {
    return this.DataPost('/gis/layers', data);
  }

  updateLayer(id: number, data: any) {
    return this.DataPut(`/gis/layers/${id}`, data);
  }

  deleteLayer(id: number) {
    return this.DataDelete(`/gis/layers/${id}`);
  }

  // ================= FEATURE APIs =================

  getFeatures(layerId: number) {
    return this.DataGet(`/gis/layers/${layerId}/features`);
  }

  saveFeature(data: any) {
    return this.DataPost('/gis/features', data);
  }

  saveAllFeatures(data: any) {
    return this.DataPost('/gis/features/bulk', data);
  }

  deleteFeature(id: number) {
    return this.DataDelete(`/gis/features/${id}`);
  }
}