import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class FirebaseService {
    private bucket: admin.storage.Storage; // ERROR: Storage no es un Bucket ❌

    // constructor() {
    //     // Evitar inicializar Firebase múltiples veces
    //     if (!admin.apps.length) {
    //         // Ruta relativa desde la raíz del proyecto, no desde `dist`
    //         const serviceAccountPath = path.resolve(__dirname, '..', '..', 'firebase-service-account.json');

    //         admin.initializeApp({
    //             credential: admin.credential.cert(require(serviceAccountPath)),
    //             storageBucket: 'tu-bucket.appspot.com',
    //         });
    //     }

    //     // Corrección: Obtener el bucket correctamente ✅
    //     this.bucket = admin.storage(); // Aquí NO es un Bucket, es Storage
    // }

    async uploadFile(file: Express.Multer.File, userId: number): Promise<string> {
        // if (!file) {
        //     throw new Error('No se ha subido ningún archivo');
        // }

        // // CORRECCIÓN: Ahora obtenemos el bucket correctamente ✅
        // const bucket = this.bucket.bucket('tu-bucket.appspot.com');
        // const filePath = `profiles/${userId}-${Date.now()}.${file.mimetype.split('/')[1]}`;
        // const fileRef = bucket.file(filePath);

        // await fileRef.save(file.buffer, {
        //     metadata: { contentType: file.mimetype },
        // });

        // const [url] = await fileRef.getSignedUrl({
        //     action: 'read',
        //     expires: '03-09-2030',
        // });

        return "url"

        //return url;
    }
}





