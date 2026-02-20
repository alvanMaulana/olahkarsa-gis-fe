import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import geojsonProvinsi from 'src/assets/geojson/geojson_provinsi_indonesia.js';
import { AdminDashboardService } from './services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {

  map!: L.Map;

  showProgramPanel = false;
  selectedProvinceId!: number;
  selectedProvince = '';

  dataSummary = {
    program_active: 0,
    total_realization: 0,
    avg_ikm: 0
  };

  filter = {
    tahun: null,
    pilar: null,
  }


  listAllTahun: any[] = [];
  listAllPilar: any[] = [];

  provinceCounts: Record<number, number> = {};
  provinceLayer!: L.GeoJSON;


  isProvinceDataLoaded = false;

  dateRange = '-';
  lastUpdated = new Date();

  constructor(
    private adminDashboardService: AdminDashboardService
  ) { }


  ngAfterViewInit(): void {
    this.lastUpdated = new Date();
    this.initMap();              // 1️⃣ init map
    this.renderProvinceLayer();  // 2️⃣ render default biru
    this.getOptionFilter();
    this.getDataSummary();
    this.loadProvinceData();     // 3️⃣ update warna setelah API
  }

  refreshData() {
    this.getDataSummary();
    this.loadProvinceData();

    this.lastUpdated = new Date();
  }

  // ================= API =================

  loadProvinceData() {
    this.adminDashboardService.getProgramCountPerProvinsi(this.filter)
      .subscribe({
        next: (res: any) => {

          this.provinceCounts = {};

          // ARRAY → MAP
          res.data.forEach((item: any) => {
            this.provinceCounts[item.provinsi_id] = item.total_program;
          });

          this.isProvinceDataLoaded = true;
          this.renderProvinceLayer();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }



  getOptionFilter() {
    this.adminDashboardService.getOptionFilter().subscribe({
      next: (res: any) => {
        this.listAllTahun = res.data.years ?? [];
        this.listAllPilar = res.data.pilars ?? [];

        console.log(this.listAllTahun, this.listAllPilar);

      },
      error: (err) => {
        console.error('Error getting program:', err);
      }
    });
  }

  getDataSummary() {
    this.adminDashboardService.getDataSummary(this.filter).subscribe({
      next: (res: any) => {
        this.dataSummary = res.data;

        // 🔹 Date Range
        this.dateRange = res.data.date_range_label;
      },
      error: (err) => {
        console.error('Error getting program:', err);
      }
    });
  }

  // ================= MAP =================

  initMap() {
    this.map = L.map('map', {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', () => {
      this.showProgramPanel = false;
    });
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }



  // ================= GEOJSON =================

  renderProvinceLayer() {

    if (this.provinceLayer) {
      this.map.removeLayer(this.provinceLayer);
    }

    this.provinceLayer = L.geoJSON(geojsonProvinsi as any, {
      interactive: true,

      style: (feature: any) => {
        const provinceId = feature.properties.province_id;
        const total = this.provinceCounts[provinceId];

        // 🔹 DEFAULT (first load / total = 0)
        if (!this.isProvinceDataLoaded || !total || total === 0) {
          return {
            color: '#2563eb',
            weight: 1,
            fillColor: '#60a5fa',
            fillOpacity: 0.4
          };
        }

        // 🔹 ADA DATA
        return {
          color: '#1e3a8a',
          weight: 1,
          fillColor: this.getProvinceColor(total),
          fillOpacity: 0.6
        };
      },

      onEachFeature: (feature: any, layer: L.Layer) => {
        const provinceId = feature.properties.province_id;
        const total = this.provinceCounts[provinceId] ?? 0;

        // Tooltip
        layer.bindTooltip(
          `<strong>${feature.properties.state}</strong><br>
           Total Program: ${total}`,
          { sticky: true }
        );

        // layer.bindPopup(
        //         `<strong>${feature.properties.state}</strong><br>
        //  Total Program: ${total}`
        //       );

        // Hover effect
        layer.on('mouseover', (e: any) => {
          e.target.setStyle({ weight: 2 });
        });

        layer.on('mouseout', (e: any) => {
          e.target.setStyle({ weight: 1 });
        });

        // Click
        layer.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stop(e);

          this.selectedProvinceId = provinceId;
          this.selectedProvince = feature.properties.state;
          this.showProgramPanel = true;
        });
      }
    }).addTo(this.map);
  }


  formatRupiahShort(value: number): { value: string; unit: string } {
    if (!value && value !== 0) {
      return { value: '0', unit: '' };
    }

    if (value >= 1_000_000_000) {
      return {
        value: (value / 1_000_000_000).toFixed(1).replace('.', ','),
        unit: 'Miliar'
      };
    }

    if (value >= 1_000_000) {
      return {
        value: (value / 1_000_000).toFixed(1).replace('.', ','),
        unit: 'Juta'
      };
    }

    if (value >= 1_000) {
      return {
        value: (value / 1_000).toFixed(1).replace('.', ','),
        unit: 'Ribu'
      };
    }

    return {
      value: value.toString(),
      unit: ''
    };
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getProvinceColor(count: number): string {
    if (count < 10) {
      return '#ef4444'; // merah
    }

    if (count <= 25) {
      return '#facc15'; // kuning
    }

    return '#22c55e'; // hijau
  }


}