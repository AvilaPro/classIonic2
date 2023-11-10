import { ConnectionStatus } from './../../../node_modules/@capacitor/network/dist/esm/definitions.d';
import { Component, OnInit } from '@angular/core';

import { Network } from '@capacitor/network';

import { Flashlight } from "@awesome-cordova-plugins/flashlight/ngx";

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(public flashlight: Flashlight, private toastController: ToastController) {

  }

  ngOnInit(){
    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
      console.log('Network status changed', status);
      this.presentToast('middle', status);
    });
    this.logCurrentNetworkStatus();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: ConnectionStatus) {
        const toast = await this.toastController.create({
          message: `tipo de conexion: ${mensaje.connectionType}; conectado?: ${mensaje.connected}`,
          duration: 4000,
          position: position,
        });

        await toast.present();
    }

  logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();

    console.log('Network status:', status);
  };

  switchFlash(evento: any): void{
    let power : boolean = evento.target.checked;
    if(power){
      this.flashlight.switchOn();
      console.log('linterna encendida');
    }else{
      this.flashlight.switchOff();
      console.log('linterna apagada');
    }
  }

}
