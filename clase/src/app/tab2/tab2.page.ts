import { Component } from '@angular/core';
import { FotoService } from "../services/foto.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public foto: FotoService) {
    this.foto.loadSaved();
  }

  tomarFoto(){
    this.foto.agregarFotoAGaleria();
    this.foto.loadSaved();
  }

}
