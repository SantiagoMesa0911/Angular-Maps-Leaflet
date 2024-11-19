import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet'
import { MakersService } from '../../services/makers.service';
import { Marcador } from '../../marcador.class';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements AfterViewInit {
  private map!: L.Map

  private IniciarMapa(): void {
    this.map = L.map('map', {
      center: [6.206191266555886, -75.58785292181719],
      zoom: 5
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      console.log(event.latlng);
      const latitud = event.latlng.lat
      const longitud = event.latlng.lng

      console.log('DATOS ' + latitud, longitud);
      const nuevomarcador = new Marcador(latitud, longitud)
      this.MakersService.agregarmarcadorlocalstorate(nuevomarcador)
    })

  }
  constructor(private MakersService: MakersService) { }

  ngAfterViewInit(): void {
    this.IniciarMapa()
    this.MakersService.makeCapitalMarkers(this.map);
    this.MakersService.makePolygon(this.map);
  }
}


