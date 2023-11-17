import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Platform } from "@ionic/angular";
import { Capacitor } from "@capacitor/core";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FotoService {


  public fotos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'fotos';
  private platform: Platform;
  constructor(public plataforma: Platform) {
    this.platform = plataforma;
   }

  public async agregarFotoAGaleria(){

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    const guardarArchivoDeImagen = await this.savePicture(image);

    /**Cuando no teniamos a guardarArchivoDeImagens usamos esto. */
    // this.fotos.unshift({
    //   filepath: '',
    //   webviewPath: image.webPath
    // });

    this.fotos.unshift(guardarArchivoDeImagen);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.fotos)
    })
  }

  private async savePicture(foto: Photo){
    const base64 = await this.leerComoBase64(foto);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      return{
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      }
    } else {
      return {
        filepath: fileName,
        webViewPath: foto.webPath
      }
    }

  }

  private async leerComoBase64(foto: Photo){

    if (this.platform.is('hybrid') && foto.path !== undefined) {
      const file = await Filesystem.readFile({
        path: foto.path!
      });
      return file.data;
    } else {
      const response = await fetch(foto.webPath!);
      const blob = await response.blob();

      return await this.convertirBlobABase64(blob) as string;
    }


  }

  private convertirBlobABase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved(){
    const { value } = await Preferences.get({key:this.PHOTO_STORAGE});
    this.fotos = (value? JSON.parse(value) : []) as UserPhoto[];

    if (!this.platform.is('hybrid')) {
      for (const photo of this.fotos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }

  }
}


