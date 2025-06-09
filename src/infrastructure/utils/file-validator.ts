import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';


type AllowedTypes = 'image' | 'video';

const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/webp'];

// Tamaños máximos
const MAX_IMAGE_SIZE_MB = 1;  // ✅ nuevo límite para imágenes
const MAX_VIDEO_SIZE_MB = 20; // ✅ nuevo límite para videos

export function validateFile(file: Express.Multer.File, type: AllowedTypes): void {
  if (!file) {
    throw new BadRequestException('No se ha proporcionado ningún archivo.');
  }

  const mimeType = file.mimetype;
  const fileSizeMB = file.size / (1024 * 1024);

  if (type === 'image') {
    if (!IMAGE_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `Formato de imagen no válido. Solo se permiten: png, jpeg${IMAGE_MIME_TYPES.includes('image/svg+xml') ? ', svg' : ''}`,
      );
    }

    if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
      throw new BadRequestException(`El tamaño máximo permitido para imágenes es de ${MAX_IMAGE_SIZE_MB}MB.`);
    }
  }

  if (type === 'video') {
    if (!VIDEO_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        'Formato de video no válido. Solo se permiten: mp4, mov, avi, webm',
      );
    }

    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      throw new BadRequestException(`El tamaño máximo permitido para videos es de ${MAX_VIDEO_SIZE_MB}MB.`);
    }
  }
}
