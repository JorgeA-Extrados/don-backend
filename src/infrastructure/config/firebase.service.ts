import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { Express } from 'express';

@Injectable()
export class FirebaseService {
    private bucket: admin.storage.Storage; // ERROR: Storage no es un Bucket ❌

    constructor() {
        // Evitar inicializar Firebase múltiples veces
        if (!admin.apps.length) {
            // Ruta absoluta desde la raíz del proyecto (evita problemas con `dist/`)
            const serviceAccountPath = path.join(process.cwd(), 'src', 'infrastructure', 'config', 'firebase-service-account.json');

            if (!fs.existsSync(serviceAccountPath)) {
                throw new Error(`No se encontró el archivo de credenciales en: ${serviceAccountPath}`);
            }

            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: 'don-oficios-da6b1.appspot.com', // Formato correcto del bucket
            });
        }

        // Corrección: Obtener el bucket correctamente ✅
        this.bucket = admin.storage(); // Aquí NO es un Bucket, es Storage
    }

    async uploadFile(file: Express.Multer.File, userId: number): Promise<string> {
        if (!file) {
            throw new Error('No se ha subido ningún archivo');
        }

        // CORRECCIÓN: Ahora obtenemos el bucket correctamente ✅
        const bucket = this.bucket.bucket('gs://don-oficios-da6b1.firebasestorage.app');
        const filePath = `profiles/${userId}-${Date.now()}.${file.mimetype.split('/')[1]}`;
        const fileRef = bucket.file(filePath);

        await fileRef.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        });

        const [url] = await fileRef.getSignedUrl({
            action: 'read',
            expires: '03-09-2030',
        });

        return url;
    }
}





