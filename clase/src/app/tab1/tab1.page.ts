import { Component, ElementRef, ViewChild } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap, Marker } from "@capacitor/google-maps";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;

  nuevaPosicion: string = '';
  latitud: number = 0;
  longitud: number = 0;

  map: any;

  constructor() {
    // this.obtenerPosicion();
    // this.cargarMapa();
  }

  async obtenerPosicion() {
    await Geolocation.getCurrentPosition().then(data => {
      console.log(data);
      this.latitud = data.coords.latitude;
      this.longitud = data.coords.longitude;
    });
    this.cargarMapa();
  }

  async cargarMapa() {
    this.newMap = await GoogleMap.create({
      id: 'map', // Unique identifier for this map instance
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: 'AIzaSyAH0I32k9QFCUdbArYYmZSkAkMaHX4WvA0', // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: this.latitud,
          lng: this.longitud,
        },
        zoom: 15, // The initial zoom level to be rendered by the map
      }
    });
    this.agregarMarcador();
  }

  async agregarMarcador(){
    const marcador: Marker = {
      coordinate:{
        lat: this.latitud,
        lng: this.longitud
      },
      draggable: true
    }

    await this.newMap.addMarker(marcador);

    this.newMap.setOnMarkerClickListener(async (marker) => {
      console.log(marker);
      this.nuevaPosicion = "Mi nueva posicion es: ";
      this.latitud = marker.latitude;
      this.longitud = marker.longitude;
    })
  }

}
