// import { Component, AfterViewInit, OnDestroy } from '@angular/core';
// import * as L from 'leaflet';
// import '@geoman-io/leaflet-geoman-free';
// import { TestGisService } from './services/test-gis.service';

// interface LayerData {
//   id?: number;
//   name: string;
//   description?: string;
//   layer_type?: string;
// }

// @Component({
//   selector: 'app-test-gis',
//   templateUrl: './test-gis.component.html',
//   styleUrls: ['./test-gis.component.scss']
// })
// export class TestGisComponent implements AfterViewInit, OnDestroy {

//   map!: L.Map;
//   currentLayerId: number | null = null;
//   layers: any[] = [];

//   // Layer form
//   showLayerForm = false;
//   layerForm: LayerData = {
//     name: '',
//     description: '',
//     layer_type: 'project'
//   };

//   // Feature tracking
//   drawnFeatures: any[] = [];

//   totalArea: number = 0; // dalam meter persegi
//   totalAreaFormatted: string = '0';

//   constructor(
//     private gisService: TestGisService
//   ) { }

//   ngAfterViewInit(): void {
//     this.initMap();
//     this.initGeoman();
//     this.loadLayers();
//   }

//   ngOnDestroy(): void {
//     if (this.map) {
//       this.map.remove();
//     }
//   }

//   // ================= MAP =================

//   initMap() {
//     this.map = L.map('map', {
//       center: [-2.5489, 118.0149],
//       zoom: 5,
//       zoomControl: true,
//       scrollWheelZoom: true
//     });

//     // L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
//     //   attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     //   maxZoom: 20
//     // }).addTo(this.map);

//     // Ganti ke OpenStreetMap standar (lebih stabil)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       maxZoom: 19
//     }).addTo(this.map);
//   }


//   // ================= AREA CALCULATION =================

//   calculateTotalArea() {
//     let totalAreaInSqMeters = 0;

//     this.drawnFeatures.forEach((feature: any) => {
//       const area = this.calculateFeatureArea(feature);
//       totalAreaInSqMeters += area;
//     });

//     this.totalArea = totalAreaInSqMeters;
//     this.totalAreaFormatted = this.formatArea(totalAreaInSqMeters);

//     console.log('Total Area:', this.totalAreaFormatted);
//   }

//   calculateFeatureArea(feature: any): number {
//     if (!feature.layer) return 0;

//     const layer = feature.layer;
//     const geometry = feature.geometry;

//     // Calculate area based on type
//     if (geometry.type === 'Circle') {
//       // Area = π × r²
//       const radius = geometry.radius; // in meters
//       return Math.PI * radius * radius;
//     }
//     else if (geometry.type === 'Polygon' || geometry.type === 'Rectangle') {
//       // Use Leaflet's built-in geodesic area calculation
//       // L.GeometryUtil is not available by default, so we use turf.js approach
//       const latlngs = layer.getLatLngs()[0];
//       return this.calculatePolygonArea(latlngs);
//     }

//     // Line doesn't have area
//     return 0;
//   }

//   calculatePolygonArea(latlngs: any[]): number {
//     // Using Shoelace formula with Haversine correction for geodesic area
//     if (latlngs.length < 3) return 0;

//     let area = 0;
//     const earthRadius = 6371000; // Earth radius in meters

//     for (let i = 0; i < latlngs.length; i++) {
//       const p1 = latlngs[i];
//       const p2 = latlngs[(i + 1) % latlngs.length];

//       const lat1 = p1.lat * Math.PI / 180;
//       const lat2 = p2.lat * Math.PI / 180;
//       const lng1 = p1.lng * Math.PI / 180;
//       const lng2 = p2.lng * Math.PI / 180;

//       area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
//     }

//     area = Math.abs(area * earthRadius * earthRadius / 2);
//     return area;
//   }

//   formatArea(areaInSqMeters: number): string {
//     if (areaInSqMeters >= 1000000) {
//       // Convert to km²
//       return (areaInSqMeters / 1000000).toFixed(2) + ' km²';
//     } else if (areaInSqMeters >= 10000) {
//       // Convert to hectares
//       return (areaInSqMeters / 10000).toFixed(2) + ' ha';
//     } else {
//       // Keep in m²
//       return areaInSqMeters.toFixed(2) + ' m²';
//     }
//   }

//   // ================= UPDATE EXISTING METHODS =================

//   // Update initGeoman - tambahkan di event pm:create
//   initGeoman() {
//     const leafletContainer = this.map;

//     leafletContainer.pm.addControls({
//       position: 'topleft',
//       drawMarker: false,
//       drawCircleMarker: false,
//       drawPolyline: true,
//       drawRectangle: true,
//       drawPolygon: true,
//       drawCircle: true,
//       drawText: false,
//       editMode: true,
//       dragMode: true,
//       cutPolygon: true,
//       removalMode: true,
//       rotateMode: false
//     });


//     // leafletContainer.pm.addControls({
//     //   position: 'topleft',
//     //   drawMarker: false,
//     //   drawCircleMarker: false,
//     //   drawPolyline: false,
//     //   drawRectangle: false,
//     //   drawPolygon: false,
//     //   drawCircle: false,
//     //   drawText: false,
//     //   editMode: false,
//     //   dragMode: false,
//     //   cutPolygon: false,
//     //   removalMode: false,
//     //   rotateMode: false
//     // });


//     // Add Geoman controls
//     leafletContainer.pm.addControls({
//       drawMarker: false,
//       position: 'topleft'
//     });

//     leafletContainer.pm.setGlobalOptions({
//       pmIgnore: false
//     } as L.PM.GlobalOptions);

//     // On create shape
//     leafletContainer.on('pm:create', (e: any) => {
//       if (e.layer && e.layer.pm) {
//         const shape = e;
//         console.log('Shape created:', e);

//         // Enable editing of created shape
//         shape.layer.pm.enable();

//         const shapeType = shape.layer.pm.getShape();
//         console.log(`Object created: ${shapeType}`);

//         // Get geometry data
//         const geometry = this.extractGeometry(shape.layer, shapeType);

//         // Store feature data
//         const featureData = {
//           feature_type: this.normalizeShapeType(shapeType),
//           geometry: geometry,
//           properties: {
//             name: `${shapeType} ${this.drawnFeatures.length + 1}`,
//             created_at: new Date().toISOString()
//           },
//           style: {
//             color: shape.layer.options.color || '#3388ff',
//             weight: shape.layer.options.weight || 1,
//             fillColor: shape.layer.options.fillColor || '#60a5fa',
//             fillOpacity: shape.layer.options.fillOpacity || 0.4
//           },
//           layer: shape.layer
//         };

//         this.drawnFeatures.push(featureData);

//         // Bind popup
//         const index = this.drawnFeatures.length - 1;
//         shape.layer.bindPopup(`
//           <strong>${featureData.properties.name}</strong><br>
//           Type: ${featureData.feature_type}
//         `);

//         // On edit shape
//         shape.layer.on('pm:edit', (editEvent: any) => {
//           console.log('Shape edited:', editEvent);

//           // Update geometry
//           const updatedGeometry = this.extractGeometry(editEvent.layer, shapeType);
//           featureData.geometry = updatedGeometry;
//         });
//       }
//     });

//     // On remove shape
//     leafletContainer.on('pm:remove', (e: any) => {
//       console.log('Shape removed');

//       // Remove from drawnFeatures array
//       const index = this.drawnFeatures.findIndex(f => f.layer === e.layer);
//       if (index > -1) {
//         this.drawnFeatures.splice(index, 1);
//       }
//     });
//   }

//   // ================= GEOMETRY EXTRACTION =================

//   extractGeometry(layer: any, shapeType: string): any {
//     if (shapeType === 'Circle') {
//       const center = layer.getLatLng();
//       return {
//         type: 'Circle',
//         center: [center.lat, center.lng],
//         radius: layer.getRadius()
//       };
//     } else if (shapeType === 'Rectangle' || shapeType === 'Polygon') {
//       const latlngs = layer.getLatLngs()[0];
//       const coordinates = latlngs.map((ll: any) => [ll.lat, ll.lng]);

//       return {
//         type: shapeType === 'Rectangle' ? 'Rectangle' : 'Polygon',
//         coordinates: [coordinates]
//       };
//     } else if (shapeType === 'Line') {
//       const latlngs = layer.getLatLngs();
//       const coordinates = latlngs.map((ll: any) => [ll.lat, ll.lng]);

//       return {
//         type: 'Line',
//         coordinates: coordinates
//       };
//     }

//     return { type: shapeType };
//   }

//   normalizeShapeType(shapeType: string): string {
//     const typeMap: any = {
//       'Circle': 'Circle',
//       'Rectangle': 'Rectangle',
//       'Polygon': 'Polygon',
//       'Line': 'Line',
//       'Marker': 'Marker',
//       'CircleMarker': 'CircleMarker',
//       'Cut': 'Cut'
//     };

//     return typeMap[shapeType] || shapeType;
//   }

//   // ================= LAYER MANAGEMENT =================

//   loadLayers() {
//     this.gisService.getLayers().subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           this.layers = res.data;
//           console.log('Layers loaded:', this.layers);
//         }
//       },
//       error: (err) => {
//         console.error('Error loading layers:', err);
//       }
//     });
//   }

//   showCreateLayerForm() {
//     this.showLayerForm = true;
//     this.layerForm = {
//       name: '',
//       description: '',
//       layer_type: 'project'
//     };
//   }

//   cancelLayerForm() {
//     this.showLayerForm = false;
//   }

//   createLayer() {
//     if (!this.layerForm.name) {
//       alert('Layer name is required');
//       return;
//     }

//     this.gisService.createLayer(this.layerForm).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           console.log('Layer created:', res.data);
//           this.currentLayerId = res.data.id;
//           this.loadLayers();
//           this.showLayerForm = false;
//           alert('Layer created successfully!');
//         }
//       },
//       error: (err) => {
//         console.error('Error creating layer:', err);
//         alert('Failed to create layer');
//       }
//     });
//   }

//   selectLayer(layer: any) {
//     this.currentLayerId = layer.id;
//     console.log('Selected layer:', layer);

//     // Load features for this layer
//     this.loadFeatures(layer.id);
//   }

//   loadFeatures(layerId: number) {
//     this.gisService.getFeatures(layerId).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           console.log('Features loaded:', res.data);
//           this.renderFeatures(res.data);
//         }
//       },
//       error: (err) => {
//         console.error('Error loading features:', err);
//       }
//     });
//   }

//   renderFeatures(features: any[]) {
//     // Clear existing drawn features
//     this.clearAllShapes();

//     if (features.length === 0) {
//       return;
//     }

//     // Render each feature
//     features.forEach((feature: any) => {
//       this.renderFeature(feature);
//     });

//     // Auto fit bounds to all features
//     this.fitBoundsToFeatures(features);
//   }

//   // Method baru untuk auto zoom
//   fitBoundsToFeatures(features: any[]) {
//     const bounds = L.latLngBounds([]);

//     features.forEach((feature: any) => {
//       if (feature.geometry.type === 'Circle') {
//         // Add circle center and radius
//         const center = L.latLng(feature.geometry.center);
//         const radiusInDegrees = feature.geometry.radius / 111320; // Convert meters to degrees
//         bounds.extend(center);
//         bounds.extend([center.lat + radiusInDegrees, center.lng + radiusInDegrees]);
//         bounds.extend([center.lat - radiusInDegrees, center.lng - radiusInDegrees]);
//       } else if (feature.geometry.coordinates) {
//         // For Polygon, Rectangle, Line
//         const coords = feature.geometry.type === 'Line'
//           ? feature.geometry.coordinates
//           : feature.geometry.coordinates[0];

//         coords.forEach((coord: any) => {
//           bounds.extend(L.latLng(coord[0], coord[1]));
//         });
//       }
//     });

//     if (bounds.isValid()) {
//       this.map.fitBounds(bounds, {
//         padding: [50, 50], // Add padding in pixels
//         maxZoom: 40 // Don't zoom too close
//       });
//     }
//   }
//   renderFeature(feature: any) {
//     let layer: any;

//     if (feature.geometry.type === 'Circle') {
//       layer = L.circle(
//         feature.geometry.center,
//         {
//           radius: feature.geometry.radius,
//           ...feature.style
//         }
//       ).addTo(this.map);
//     } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'Rectangle') {
//       layer = L.polygon(
//         feature.geometry.coordinates[0],
//         feature.style
//       ).addTo(this.map);
//     } else if (feature.geometry.type === 'Line') {
//       layer = L.polyline(
//         feature.geometry.coordinates,
//         feature.style
//       ).addTo(this.map);
//     }

//     if (layer) {
//       layer.bindPopup(`
//         <strong>${feature.properties?.name || 'Unnamed'}</strong><br>
//         Type: ${feature.feature_type}
//       `);

//       // Enable editing
//       if (layer.pm) {
//         layer.pm.enable();
//       }

//       this.drawnFeatures.push({
//         ...feature,
//         layer: layer
//       });
//     }
//   }

//   // ================= SAVE FEATURES =================

//   saveAllFeatures() {
//     if (!this.currentLayerId) {
//       alert('Please select or create a layer first');
//       return;
//     }

//     if (this.drawnFeatures.length === 0) {
//       alert('No features to save');
//       return;
//     }

//     const features = this.drawnFeatures.map(f => ({
//       feature_type: f.feature_type,
//       geometry: f.geometry,
//       properties: f.properties,
//       style: f.style
//     }));

//     const payload = {
//       layer_id: this.currentLayerId,
//       features: features
//     };

//     this.gisService.saveAllFeatures(payload).subscribe({
//       next: (res: any) => {
//         if (res.status) {
//           console.log('Features saved:', res.data);
//           alert('All features saved successfully!');
//         }
//       },
//       error: (err) => {
//         console.error('Error saving features:', err);
//         alert('Failed to save features');
//       }
//     });
//   }

//   // ================= DRAWING CONTROLS =================

//   drawRectangle() {
//     this.map.pm.enableDraw('Rectangle', {
//       tooltips: false
//     });
//   }

//   drawPolygon() {
//     this.map.pm.enableDraw('Polygon', {
//       tooltips: false
//     });

//     this.map.on('pm:drawstart', ({ workingLayer }: any) => {
//       workingLayer.on('pm:vertexadded', (e: any) => {
//         console.log('Vertex added:', e);
//       });
//     });
//   }

//   drawCircle() {
//     this.map.pm.enableDraw('Circle', {
//       tooltips: false
//     });
//   }

//   drawLine() {
//     this.map.pm.enableDraw('Line', {
//       tooltips: false
//     });
//   }

//   enableRemovalMode() {
//     this.map.pm.enableGlobalRemovalMode();
//   }

//   cutLayer() {
//     this.map.pm.enableDraw('Cut', {
//       tooltips: false
//     });
//   }

//   clearAllShapes() {
//     this.drawnFeatures.forEach(feature => {
//       if (feature.layer) {
//         this.map.removeLayer(feature.layer);
//       }
//     });
//     this.drawnFeatures = [];
//   }

//   zoomIn() {
//     this.map.zoomIn();
//   }

//   zoomOut() {
//     this.map.zoomOut();
//   }


//   onLayerChange() {
//     const selectedLayer = this.layers.find(
//       l => l.id == this.currentLayerId
//     );

//     this.selectLayer(selectedLayer);
//   }

// }


import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { TestGisService } from './services/test-gis.service';
import * as turf from '@turf/turf';

interface LayerData {
  id?: number;
  name: string;
  description?: string;
  layer_type?: string;
}

@Component({
  selector: 'app-test-gis',
  templateUrl: './test-gis.component.html',
  styleUrls: ['./test-gis.component.scss']
})
export class TestGisComponent implements AfterViewInit, OnDestroy {

  map!: L.Map;
  currentLayerId: number | null = null;
  layers: any[] = [];

  // Layer form
  showLayerForm = false;
  layerForm: LayerData = {
    name: '',
    description: '',
    layer_type: 'project'
  };

  // Feature tracking
  drawnFeatures: any[] = [];

  totalArea: number = 0; // dalam meter persegi
  totalAreaFormatted: string = '0';

  constructor(
    private gisService: TestGisService
  ) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.initGeoman();
    this.loadLayers();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // ================= MAP =================

  initMap() {
    this.map = L.map('map', {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);
  }


  // ================= AREA CALCULATION =================

  calculateTotalArea() {
    let totalAreaInSqMeters = 0;

    this.drawnFeatures.forEach((feature: any) => {
      const area = this.calculateFeatureArea(feature);
      totalAreaInSqMeters += area;
    });

    this.totalArea = totalAreaInSqMeters;
    this.totalAreaFormatted = this.formatArea(totalAreaInSqMeters);

    console.log('Total Area:', this.totalAreaFormatted);
  }

  calculateFeatureArea(feature: any): number {
    if (!feature.layer) return 0;

    const layer = feature.layer;
    const geometry = feature.geometry;

    // Calculate area based on type
    if (geometry.type === 'Circle') {
      // Area = π × r²
      const radius = geometry.radius; // in meters
      return Math.PI * radius * radius;
    }
    else if (geometry.type === 'Polygon' || geometry.type === 'Rectangle') {
      const latlngs = layer.getLatLngs()[0];
      return this.calculatePolygonArea(latlngs);
    }

    // Line doesn't have area
    return 0;
  }

  calculatePolygonArea(latlngs: L.LatLng[]): number {
    // Turf butuh format [lng, lat]
    const coordinates = latlngs.map(ll => [ll.lng, ll.lat]);

    // Close polygon (harus titik awal = titik akhir)
    coordinates.push(coordinates[0]);

    const polygon = turf.polygon([coordinates]);

    const area = turf.area(polygon); // hasil dalam meter persegi

    return area;
  }


  formatArea(areaInSqMeters: number): string {
    if (areaInSqMeters >= 1000000) {
      // Convert to km²
      return (areaInSqMeters / 1000000).toFixed(2) + ' km²';
    } else if (areaInSqMeters >= 10000) {
      // Convert to hectares
      return (areaInSqMeters / 10000).toFixed(2) + ' ha';
    } else {
      // Keep in m²
      return areaInSqMeters.toFixed(2) + ' m²';
    }
  }

  // ================= UPDATE EXISTING METHODS =================

  initGeoman() {
    const leafletContainer = this.map;

    leafletContainer.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: true,
      drawText: false,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
      rotateMode: false
    });

    leafletContainer.pm.setGlobalOptions({
      pmIgnore: false
    } as L.PM.GlobalOptions);

    // On create shape
    leafletContainer.on('pm:create', (e: any) => {
      if (e.layer && e.layer.pm) {
        const shape = e;
        console.log('Shape created:', e);

        // Enable editing of created shape
        shape.layer.pm.enable();

        const shapeType = shape.layer.pm.getShape();
        console.log(`Object created: ${shapeType}`);

        // Get geometry data
        const geometry = this.extractGeometry(shape.layer, shapeType);

        // Calculate individual area
        const tempFeature = {
          geometry: geometry,
          layer: shape.layer
        };
        const individualArea = this.calculateFeatureArea(tempFeature);

        // Store feature data
        const featureData = {
          feature_type: this.normalizeShapeType(shapeType),
          geometry: geometry,
          properties: {
            name: `${shapeType} ${this.drawnFeatures.length + 1}`,
            created_at: new Date().toISOString(),
            area: individualArea,
            area_formatted: this.formatArea(individualArea)
          },
          style: {
            color: shape.layer.options.color || '#3388ff',
            weight: shape.layer.options.weight || 1,
            fillColor: shape.layer.options.fillColor || '#60a5fa',
            fillOpacity: shape.layer.options.fillOpacity || 0.4
          },
          layer: shape.layer
        };

        this.drawnFeatures.push(featureData);

        // Bind popup with area info
        shape.layer.bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="font-size: 14px;">${featureData.properties.name}</strong><br>
            <span style="color: #6b7280; font-size: 12px;">Type: ${featureData.feature_type}</span><br>
            ${individualArea > 0 ? `<span style="color: #10b981; font-size: 12px; font-weight: 600;">Area: ${featureData.properties.area_formatted}</span>` : ''}
          </div>
        `);

        // Calculate total area
        this.calculateTotalArea();

        // ========== EVENT LISTENER UNTUK SHAPE BARU ==========
        shape.layer.on('pm:edit', (editEvent: any) => {
          console.log('New shape edited:', editEvent);
          this.updateFeatureGeometry(shape.layer, featureData);
        });

        shape.layer.on('pm:update', (updateEvent: any) => {
          console.log('New shape updated:', updateEvent);
          this.updateFeatureGeometry(shape.layer, featureData);
        });
        // ========== AKHIR ==========
      }
    });

    // On remove shape
    leafletContainer.on('pm:remove', (e: any) => {
      console.log('Shape removed');

      // Remove from drawnFeatures array
      const index = this.drawnFeatures.findIndex(f => f.layer === e.layer);
      if (index > -1) {
        this.drawnFeatures.splice(index, 1);
      }

      // Recalculate total area after removal
      this.calculateTotalArea();
    });
  }

  // ================= METHOD BARU: UPDATE GEOMETRY =================
  updateFeatureGeometry(layer: any, feature: any) {
    const shapeType = layer.pm.getShape();

    // Update geometry
    feature.geometry = this.extractGeometry(layer, shapeType);

    // Recalculate area
    const updatedArea = this.calculateFeatureArea(feature);
    feature.properties.area = updatedArea;
    feature.properties.area_formatted = this.formatArea(updatedArea);

    console.log('✅ Feature geometry updated:', feature);

    // Update popup
    layer.setPopupContent(`
      <div style="font-family: sans-serif;">
        <strong style="font-size: 14px;">${feature.properties.name}</strong><br>
        <span style="color: #6b7280; font-size: 12px;">Type: ${feature.feature_type}</span><br>
        ${updatedArea > 0 ? `<span style="color: #10b981; font-size: 12px; font-weight: 600;">Area: ${feature.properties.area_formatted}</span>` : ''}
      </div>
    `);

    // Recalculate total area
    this.calculateTotalArea();
  }

  // ================= GEOMETRY EXTRACTION =================

  extractGeometry(layer: any, shapeType: string): any {
    if (shapeType === 'Circle') {
      const center = layer.getLatLng();
      return {
        type: 'Circle',
        center: [center.lat, center.lng],
        radius: layer.getRadius()
      };
    } else if (shapeType === 'Rectangle' || shapeType === 'Polygon') {
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs.map((ll: any) => [ll.lat, ll.lng]);

      return {
        type: shapeType === 'Rectangle' ? 'Rectangle' : 'Polygon',
        coordinates: [coordinates]
      };
    } else if (shapeType === 'Line') {
      const latlngs = layer.getLatLngs();
      const coordinates = latlngs.map((ll: any) => [ll.lat, ll.lng]);

      return {
        type: 'Line',
        coordinates: coordinates
      };
    }

    return { type: shapeType };
  }

  normalizeShapeType(shapeType: string): string {
    const typeMap: any = {
      'Circle': 'Circle',
      'Rectangle': 'Rectangle',
      'Polygon': 'Polygon',
      'Line': 'Line',
      'Marker': 'Marker',
      'CircleMarker': 'CircleMarker',
      'Cut': 'Cut'
    };

    return typeMap[shapeType] || shapeType;
  }

  // ================= LAYER MANAGEMENT =================

  loadLayers() {
    this.gisService.getLayers().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.layers = res.data;
          console.log('Layers loaded:', this.layers);
        }
      },
      error: (err) => {
        console.error('Error loading layers:', err);
      }
    });
  }

  showCreateLayerForm() {
    this.showLayerForm = true;
    this.layerForm = {
      name: '',
      description: '',
      layer_type: 'project'
    };
  }

  cancelLayerForm() {
    this.showLayerForm = false;
  }

  createLayer() {
    if (!this.layerForm.name) {
      alert('Layer name is required');
      return;
    }

    this.gisService.createLayer(this.layerForm).subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log('Layer created:', res.data);
          this.currentLayerId = res.data.id;
          this.loadLayers();
          this.showLayerForm = false;
          alert('Layer created successfully!');
        }
      },
      error: (err) => {
        console.error('Error creating layer:', err);
        alert('Failed to create layer');
      }
    });
  }

  selectLayer(layer: any) {
    this.currentLayerId = layer.id;
    console.log('Selected layer:', layer);

    // Load features for this layer
    this.loadFeatures(layer.id);
  }

  loadFeatures(layerId: number) {
    this.gisService.getFeatures(layerId).subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log('Features loaded:', res.data);
          this.renderFeatures(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading features:', err);
      }
    });
  }

  renderFeatures(features: any[]) {
    // Clear existing drawn features
    this.clearAllShapes();

    if (features.length === 0) {
      return;
    }

    // Render each feature
    features.forEach((feature: any) => {
      this.renderFeature(feature);
    });

    // Auto fit bounds to all features
    this.fitBoundsToFeatures(features);

    // Calculate total area
    this.calculateTotalArea();
  }

  fitBoundsToFeatures(features: any[]) {
    const bounds = L.latLngBounds([]);

    features.forEach((feature: any) => {
      if (feature.geometry.type === 'Circle') {
        const center = L.latLng(feature.geometry.center);
        const radiusInDegrees = feature.geometry.radius / 111320;
        bounds.extend(center);
        bounds.extend([center.lat + radiusInDegrees, center.lng + radiusInDegrees]);
        bounds.extend([center.lat - radiusInDegrees, center.lng - radiusInDegrees]);
      } else if (feature.geometry.coordinates) {
        const coords = feature.geometry.type === 'Line'
          ? feature.geometry.coordinates
          : feature.geometry.coordinates[0];

        coords.forEach((coord: any) => {
          bounds.extend(L.latLng(coord[0], coord[1]));
        });
      }
    });

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 40
      });
    }
  }

  renderFeature(feature: any) {
    let layer: any;

    if (feature.geometry.type === 'Circle') {
      layer = L.circle(
        feature.geometry.center,
        {
          radius: feature.geometry.radius,
          ...feature.style
        }
      ).addTo(this.map);
    } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'Rectangle') {
      layer = L.polygon(
        feature.geometry.coordinates[0],
        feature.style
      ).addTo(this.map);
    } else if (feature.geometry.type === 'Line') {
      layer = L.polyline(
        feature.geometry.coordinates,
        feature.style
      ).addTo(this.map);
    }

    if (layer) {
      // Hitung area untuk feature yang di-load
      const tempFeature = {
        geometry: feature.geometry,
        layer: layer
      };
      const area = this.calculateFeatureArea(tempFeature);
      const areaFormatted = this.formatArea(area);

      // Simpan area ke properties jika belum ada
      if (!feature.properties) {
        feature.properties = {};
      }
      feature.properties.area = area;
      feature.properties.area_formatted = areaFormatted;

      // Bind popup dengan area info
      layer.bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="font-size: 14px;">${feature.properties?.name || 'Unnamed'}</strong><br>
        <span style="color: #6b7280; font-size: 12px;">Type: ${feature.feature_type}</span><br>
        ${area > 0 ? `<span style="color: #10b981; font-size: 12px; font-weight: 600;">Area: ${areaFormatted}</span>` : ''}
      </div>
    `);

      // Enable PM tapi JANGAN langsung enable edit mode
      if (layer.pm) {
        // Event listener untuk shape dari database
        layer.on('pm:edit', (editEvent: any) => {
          console.log('Loaded shape edited:', editEvent);

          const featureIndex = this.drawnFeatures.findIndex(f => f.layer === layer);
          if (featureIndex > -1) {
            this.updateFeatureGeometry(layer, this.drawnFeatures[featureIndex]);
          }
        });

        layer.on('pm:update', (updateEvent: any) => {
          console.log('Loaded shape updated:', updateEvent);

          const featureIndex = this.drawnFeatures.findIndex(f => f.layer === layer);
          if (featureIndex > -1) {
            this.updateFeatureGeometry(layer, this.drawnFeatures[featureIndex]);
          }
        });
      }

      this.drawnFeatures.push({
        ...feature,
        layer: layer
      });
    }
  }

  // ================= SAVE FEATURES =================

  saveAllFeatures() {
    if (!this.currentLayerId) {
      alert('Please select or create a layer first');
      return;
    }

    if (this.drawnFeatures.length === 0) {
      alert('No features to save');
      return;
    }

    const features = this.drawnFeatures.map(f => ({
      feature_type: f.feature_type,
      geometry: f.geometry,
      properties: f.properties,
      style: f.style
    }));

    console.log('Data yang akan disave:', features);

    const payload = {
      layer_id: this.currentLayerId,
      features: features
    };

    this.gisService.saveAllFeatures(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log('Features saved:', res.data);
          alert('All features saved successfully!');
        }
      },
      error: (err) => {
        console.error('Error saving features:', err);
        alert('Failed to save features');
      }
    });
  }

  // ================= DRAWING CONTROLS =================

  drawRectangle() {
    this.map.pm.enableDraw('Rectangle', {
      tooltips: false
    });
  }

  drawPolygon() {
    this.map.pm.enableDraw('Polygon', {
      tooltips: false
    });

    this.map.on('pm:drawstart', ({ workingLayer }: any) => {
      workingLayer.on('pm:vertexadded', (e: any) => {
        console.log('Vertex added:', e);
      });
    });
  }

  drawCircle() {
    this.map.pm.enableDraw('Circle', {
      tooltips: false
    });
  }

  drawLine() {
    this.map.pm.enableDraw('Line', {
      tooltips: false
    });
  }

  enableRemovalMode() {
    this.map.pm.enableGlobalRemovalMode();
  }

  cutLayer() {
    this.map.pm.enableDraw('Cut', {
      tooltips: false
    });
  }

  clearAllShapes() {
    this.drawnFeatures.forEach(feature => {
      if (feature.layer) {
        this.map.removeLayer(feature.layer);
      }
    });
    this.drawnFeatures = [];

    // Reset total area
    this.totalArea = 0;
    this.totalAreaFormatted = '0';
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  onLayerChange() {
    const selectedLayer = this.layers.find(
      l => l.id == this.currentLayerId
    );

    this.selectLayer(selectedLayer);
  }

}