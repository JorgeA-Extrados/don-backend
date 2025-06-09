import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';


@Injectable()
export class EmailRepository {
  constructor(private readonly mailerService: MailerService) { }

  async sendVerificationEmail(mail: string, code: number) {
    try {
      // Definición del HTML dentro del repository
      const htmlContent = `
          <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
            <tr>
              <td align="center" valign="middle">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #f4f6f8; padding: 40px 30px; text-align: center;">
                  <tr>
                    <td style="margin-top: 40px;">
                      <!-- Logo -->
                      <img src="https://firebasestorage.googleapis.com/v0/b/don-oficios-da6b1.firebasestorage.app/o/DON%20vectorizado.png?alt=media&token=389759a2-a189-4346-9b1a-3a2f011689a3" alt="Logo" width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="font-size: 18px; font-weight: 400; margin-top: 40px; line-height: 1.6;  text-align: center; color: #555555;">Bienvenido a DON, <br/> ingresa el siguiente código en la app para confirmar tu cuenta.</p>
                    </td>
                  </tr>
                  <tr>
                    <td> 
                        <p style="font-size: 18px; font-weight: 700; margin-top: 40px; line-height: 1.6;  text-align: center; color:rgb(0, 0, 0);">${code}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;


      // Envío del correo con el contenido HTML directamente desde el repository
      await this.mailerService.sendMail({
        to: mail,
        subject: '¡Bienvenido a DON!',
        from: `DON <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
        html: htmlContent, // Contenido HTML
      });

      return {
        mensaje: 'Email enviado',
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `${error.message}`,
        error: 'Error al enviar el correo',
      });
    }
  }

  async sendChangePasswordEmail(mail: string, code: number) {
    try {
      // Definición del HTML dentro del repository
      const htmlContent = `
          <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
            <tr>
              <td align="center" valign="middle">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #f4f6f8; padding: 40px 30px; text-align: center;">
                  <tr>
                    <td style="margin-top: 40px;">
                      <!-- Logo -->
                      <img src="https://firebasestorage.googleapis.com/v0/b/don-oficios-da6b1.firebasestorage.app/o/DON%20vectorizado.png?alt=media&token=389759a2-a189-4346-9b1a-3a2f011689a3" alt="Logo" width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="font-size: 18px; font-weight: 400; margin-top: 40px; line-height: 1.6;  text-align: center; color: #555555;">Bienvenido a DON, <br/> ingresa el siguiente código en la app para cambiar su contraseña.</p>
                    </td>
                  </tr>
                  <tr>
                    <td> 
                        <p style="font-size: 18px; font-weight: 700; margin-top: 40px; line-height: 1.6;  text-align: center; color:rgb(0, 0, 0);">${code}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;


      // Envío del correo con el contenido HTML directamente desde el repository
      await this.mailerService.sendMail({
        to: mail,
        subject: '¡Cambio de contraseña DON!',
        from: `DON <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
        html: htmlContent, // Contenido HTML
      });

      return {
        mensaje: 'Email enviado',
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `${error.message}`,
        error: 'Error al enviar el correo',
      });
    }
  }

  async reportPublicationEmail(reportInfo) {
    try {
      // Definición del HTML dentro del repository
      const htmlContent = `
          <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
            <tr>
              <td align="center" valign="middle">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #f4f6f8; padding: 40px 30px; text-align: center;">
                  <tr>
                    <td style="margin-top: 40px;">
                      <!-- Logo -->
                      <img src="https://firebasestorage.googleapis.com/v0/b/don-oficios-da6b1.firebasestorage.app/o/DON%20vectorizado.png?alt=media&token=389759a2-a189-4346-9b1a-3a2f011689a3" alt="Logo" width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="font-size: 18px; font-weight: 400; margin-top: 40px; line-height: 1.6;  text-align: center; color: #555555;">Reporte de publicación , <br/> La siguiente publicación fue reportada.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="margin-top: 40px;">
                      <!-- Logo -->
                      <img src=${reportInfo.pub_image} alt="Logo" width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
                    </td>
                  </tr>
                  <tr>
                    <td> 
                        <p style="font-size: 18px; font-weight: 700; margin-top: 40px; line-height: 1.6;  text-align: center; color:rgb(0, 0, 0);">Publicacion: ${reportInfo.pub_description} <br/> Motivo: ${reportInfo.rea_reason} <br/> Fecha de reporte: ${reportInfo.rep_create} </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;


      // Envío del correo con el contenido HTML directamente desde el repository
      await this.mailerService.sendMail({
        to: process.env.MAILER_EMAIL,
        subject: '¡Reporte de publicación DON!',
        from: `DON <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
        html: htmlContent, // Contenido HTML
      });

      return {
        mensaje: 'Email enviado',
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `${error.message}`,
        error: 'Error al enviar el correo',
      });
    }
  }


}
