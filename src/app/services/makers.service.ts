import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet'
import { Marcador } from '../marcador.class';

@Injectable({
  providedIn: 'root'
})
export class MakersService {

  ciudades: string = 'assets/data/ciudades_colombia.geojson';
  // provinces: string = '/assets/data/usa-provinces.geojson';
  // latlngs: any = [];
  private markersls: Marcador[] = []
  constructor(private http: HttpClient) { }

  makeCapitalMarkers(map: any): void {
    const storedMarkers = localStorage.getItem('markers');

    if (storedMarkers) {
      try {
        this.markersls = JSON.parse(storedMarkers)
      } catch (error) {
        console.error('No hay datos en localStorage para los marcadores.');
        return;
      }

    }

    this.http.get(this.ciudades).subscribe((geoJsonData: any) => {
      this.markersls.forEach((marcador:Marcador) => {
        geoJsonData.features.push({
          "type": "Feature",
          "properties": {
             "city": marcador.titulo ||  'Sin titulo'
        },
         "geometry": {
            "type": "Point",
            "coordinates": [marcador.lng, marcador.lat]
         }
      })

      geoJsonData.features.forEach((feature: any) => {
        const lon = feature.geometry.coordinates[0];
        const lat = feature.geometry.coordinates[1];
        const name = feature.properties.city;

        const marker = L.marker([lat, lon])
         .addTo(map)
         .bindPopup(`
            <h2>COORDENADAS ACTUALES</h2>
            <h3>${name}</h3>
            <p>${lon} y ${lat}</p>
          `);
      })
    })
  })
}


  // makeCapitalMarkers(map: any): void {
  //   console.log(this.marcadoresls);

  //   this.http.get(this.ciudades).subscribe((res: any) => {

  //     for (const c of res.features) {

  //       const lon = c.geometry.coordinates[0];
  //       const lat = c.geometry.coordinates[1];
  //       const name = c.properties.city;

  //       const marker = L.marker([lat, lon])
  //         .addTo(map)
  //         .bindPopup(`
  //           <h2>COORDENADAS ACTUALES</h2>
  //           <h3>${name}</h3>
  //           <p>${lon} y ${lat}</p>
  //         `);

  //     }
  //   });
  // }

  agregarmarcadorlocalstorate(marcador: Marcador) {
    this.markersls.push(marcador);
    localStorage.setItem('markers', JSON.stringify(this.markersls));
  }





  makePolygon(map: any): void {

    this.http.get(this.ciudades).subscribe((res: any) => {
      let coordinates: [number, number][] = res.features.map((feature: any) => [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ]);

      const storedMarkers = localStorage.getItem('markers') || ""; 
      try {
        const parseMarkers : Marcador[] = JSON.parse(storedMarkers) 
        parseMarkers.forEach((marcador: Marcador) => {
          coordinates.push([marcador.lat, marcador.lng])
        })
      } catch (error) {
        
      }

      coordinates = coordinates.sort((a: [number, number], b: [number, number]) => b[0] - a[0]);

      coordinates.push(coordinates[0]);

      const polygon = L.polygon(coordinates, {
        color: '#3388ff',
        weight: 2,
        smoothFactor: 1.5
      }).addTo(map);

      map.fitBounds(polygon.getBounds());
    });
  }

  // makePolygon(map: any): void {
  //   this.http.get(this.ciudades).subscribe((res: any) => {
  //     let coordinates: [number, number][] = res.features.map((feature: any) => [
  //       feature.geometry.coordinates[1],
  //       feature.geometry.coordinates[0],
  //     ]);

  //     coordinates = coordinates.sort((a: [number, number], b: [number, number]) => b[0] - a[0]);

  //     coordinates.push(coordinates[0]);

  //     const polygon = L.polygon(coordinates, {
  //       color: '#3388ff',
  //       weight: 2,
  //       smoothFactor: 1.5
  //     }).addTo(map);

  //     map.fitBounds(polygon.getBounds());
  //   });
  // }






}
