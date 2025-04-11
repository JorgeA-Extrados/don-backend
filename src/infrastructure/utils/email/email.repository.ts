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

  // async createVerificationEmail(mail: string, link: string) {
  //   try {
  //     // Definición del HTML dentro del repository
  //     const htmlContent = `
  //         <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
  //   <tr>
  //     <td align="center" valign="middle">
  //       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 30px; text-align: center;">
  //         <tr>
  //           <td style="margin-top: 40px;">
  //             <!-- Logo -->
  //             <img src="https://res.cloudinary.com/dt9pw5bcd/image/upload/v1725044213/dreup-color_nlxncu.png" alt="Logo" width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" />
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <p style="font-size: 18px; font-weight: 400; margin-top: 40px; line-height: 1.6;  text-align: left; color: #555555;">Hola, <br/> Para cambiar tu contraseña haz clic en el siguiente enlace.</p>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <a href="${link}" target="_blank" style="display: block; width: 100%; background-color: #E3602D; color: #ffffff; text-decoration: none; padding: 15px; border-radius: 12px; font-size: 18px; font-weight: 600; margin-top: 40px; text-align: center;">Cambiar contraseña</a>
  //           </td>
  //         </tr>
  //       </table>
  //     </td>
  //   </tr>
  // </table>`;


  //     // Envío del correo con el contenido HTML directamente desde el repository
  //     await this.mailerService.sendMail({
  //       to: mail,
  //       subject: '¡Recuperación de Contraseña DreUP!',
  //       from: `DreUP <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
  //       html: htmlContent, // Contenido HTML
  //     });

  //     return {
  //       mensaje: 'Email enviado',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: `${error.message}`,
  //       error: 'Error al enviar el correo',
  //     });
  //   }
  // }

  // async welcomeEmailFree(mail: string) {
  //   try {
  //     // Definición del HTML dentro del repository
  //     const htmlContent = `
  //            <table
  //               width="100%"
  //               border="0"
  //               cellspacing="0"
  //               cellpadding="0"
  //               style="background-color: #f4f4f4; min-height: 100vh; padding: 20px 0;"
  //             >
  //               <tr>
  //                 <td align="center" valign="top">
  //                   <table
  //                     width="480"
  //                     cellpadding="0"
  //                     cellspacing="0"
  //                     border="0"
  //                     style="
  //                       width: 100%;
  //                       max-width: 480px;
  //                       border-collapse: collapse;
  //                       background-color: #ffffff;
  //                       border-radius: 21px;
  //                       overflow: hidden;
  //                       margin-top: 100px;
  //                     "
  //                   >
  //                     <tr>
  //                       <td align="center" valign="top" style="padding: 0;">
  //                         <!-- Imagen central -->
  //                         <img
  //                           src="https://firebasestorage.googleapis.com/v0/b/dreup-steging.appspot.com/o/uploads%2FEmail%20para%20Freelance%20(1).png?alt=media&token=939e199e-de4c-46e8-80e9-8ea98fdf0cfa"
  //                           alt="Imagen de Correo"
  //                           style="display: block; width: 100%; height: auto; object-fit: cover;"
  //                         />
  //                       </td>
  //                     </tr>
  //                   </table>
  //                 </td>
  //               </tr>
  //             </table>
  //     `;


  //     // Envío del correo con el contenido HTML directamente desde el repository
  //     await this.mailerService.sendMail({
  //       to: mail,
  //       subject: '¡Bienvenido a DreUP!',
  //       from: `DreUP <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
  //       html: htmlContent, // Contenido HTML
  //     });

  //     return {
  //       mensaje: 'Email enviado',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: `${error.message}`,
  //       error: 'Error al enviar el correo',
  //     });
  //   }
  // }

  // async welcomeEmailPyme(mail: string) {
  //   try {
  //     // Definición del HTML dentro del repository
  //     const htmlContent = `
  //            <table
  //               width="100%"
  //               border="0"
  //               cellspacing="0"
  //               cellpadding="0"
  //               style="background-color: #f4f4f4; min-height: 100vh; padding: 20px 0;"
  //             >
  //               <tr>
  //                 <td align="center" valign="top">
  //                   <table
  //                     width="480"
  //                     cellpadding="0"
  //                     cellspacing="0"
  //                     border="0"
  //                     style="
  //                       width: 100%;
  //                       max-width: 480px;
  //                       border-collapse: collapse;
  //                       background-color: #ffffff;
  //                       border-radius: 21px;
  //                       overflow: hidden;
  //                       margin-top: 100px;
  //                     "
  //                   >
  //                     <tr>
  //                       <td align="center" valign="top" style="padding: 0;">
  //                         <!-- Imagen central -->
  //                         <img
  //                           src="https://firebasestorage.googleapis.com/v0/b/dreup-steging.appspot.com/o/uploads%2FEmail%20para%20Pyme.png?alt=media&token=3f166475-c8a5-4925-8dc2-6d02a76ff336"
  //                           alt="Imagen de Correo"
  //                           style="display: block; width: 100%; height: auto; object-fit: cover;"
  //                         />
  //                       </td>
  //                     </tr>
  //                   </table>
  //                 </td>
  //               </tr>
  //             </table>
  //     `;


  //     // Envío del correo con el contenido HTML directamente desde el repository
  //     await this.mailerService.sendMail({
  //       to: mail,
  //       subject: '¡Bienvenido a DreUP!',
  //       from: `DreUP <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
  //       html: htmlContent, // Contenido HTML
  //     });

  //     return {
  //       mensaje: 'Email enviado',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: `${error.message}`,
  //       error: 'Error al enviar el correo',
  //     });
  //   }
  // }

  // async dreupFreelancerPyme(data) {
  //   try {
  //     const htmlContent = `
  //        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F5FA; padding: 20px 0;">
  //   <tr>
  //     <td align="center">
  //       <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 10px; padding: 20px; text-align: center;">
  //         <!-- Logo -->
  //         <tr>
  //           <td style="padding: 10px;">
  //             <img src="https://res.cloudinary.com/dt9pw5bcd/image/upload/v1725044213/dreup-color_nlxncu.png" alt="DreUP" " width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;"/>
  //           </td>
  //         </tr>
  //         <!-- Título -->
  //         <tr>
  //           <td style="padding: 20px; font-family: 'Libre Baskerville'; font-style: normal; font-weight: 700; font-size: 32px; line-height: 40px; text-align: center; color: #3E1051;">
  //             ¡Hola DreUP!
  //           </td>
  //         </tr>
  //         <!-- Subtítulo -->
  //         <tr>
  //           <td style="padding: 10px; font-family: 'Libre Baskerville'; font-style: normal; font-weight: 700; font-size: 18px; line-height: 22px; text-align: center; color: #E3602D;">
  //             ${data.title}
  //           </td>
  //         </tr>
  //         <!-- Contenido del mensaje -->
  //         <tr>
  //           <td style="padding: 30px 20px;">
  //             <table width="100%" cellpadding="0" cellspacing="0">
  //               <!-- Nombre -->
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Nombre:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.name}
  //                 </td>
  //               </tr>
  //               <!-- Correo electrónico -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Correo electrónico:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684; text-decoration: none; color: inherit;">
  //                   <span style="text-decoration: none; color: inherit;">${data.email}</span>
  //                 </td>
  //               </tr>
  //               <!-- Teléfono -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Teléfono:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.phone}
  //                 </td>
  //               </tr>
  //             </table>
  //           </td>
  //         </tr>
  //       </table>
  //     </td>
  //   </tr>
  // </table>
  //     `;



  //     // Envío del correo con el contenido HTML directamente desde el repository
  //     await this.mailerService.sendMail({
  //       to: process.env.EMAIL_ADMIN,
  //       subject: '¡Nuevo registro!',
  //       from: `DreUP <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
  //       html: htmlContent, // Contenido HTML
  //     });

  //     return {
  //       mensaje: 'Email enviado',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: `${error.message}`,
  //       error: 'Error al enviar el correo',
  //     });
  //   }
  // }

  // async dreupFreelancerPymeProyectFinal(data) {
  //   try {
  //     const htmlContent = `
  //        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F5FA; padding: 20px 0;">
  //   <tr>
  //     <td align="center">
  //       <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 10px; padding: 20px; text-align: center;">
  //         <!-- Logo -->
  //         <tr>
  //           <td style="padding: 10px;">
  //             <img src="https://res.cloudinary.com/dt9pw5bcd/image/upload/v1725044213/dreup-color_nlxncu.png" alt="DreUP" " width="173" style="display: block; margin: 0 auto; max-width: 100%; height: auto;"/>
  //           </td>
  //         </tr>
  //         <!-- Título -->
  //         <tr>
  //           <td style="padding: 20px; font-family: 'Libre Baskerville'; font-style: normal; font-weight: 700; font-size: 32px; line-height: 40px; text-align: center; color: #3E1051;">
  //             ¡Hola DreUP!
  //           </td>
  //         </tr>
  //         <!-- Subtítulo -->
  //         <tr>
  //           <td style="padding: 10px; font-family: 'Libre Baskerville'; font-style: normal; font-weight: 700; font-size: 18px; line-height: 22px; text-align: center; color: #E3602D;">
  //             ${data.title}
  //           </td>
  //         </tr>
  //         <!-- Contenido del mensaje -->
  //         <tr>
  //           <td style="padding: 30px 20px;">
  //             <table width="100%" cellpadding="0" cellspacing="0">
  //               <!-- Servicio -->
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Servicio:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.service}
  //                 </td>
  //               </tr>
  //               <!-- Nombre empresa -->
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Nombre empresa:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.nameCompany}
  //                 </td>
  //               </tr>
  //               <!-- Correo electrónico empresa -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Correo electrónico empresa:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684; text-decoration: none; color: inherit;">
  //                   <span style="text-decoration: none; color: inherit;">${data.emailCompany}</span>
  //                 </td>
  //               </tr>
  //               <!-- Teléfono empresa -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Teléfono empresa:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.phoneCompany}
  //                 </td>
  //               </tr>
  //                <!-- Nombre Freelance -->
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Nombre Freelance:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.nameFreelancer}
  //                 </td>
  //               </tr>
  //               <!-- Correo electrónico Freelance -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Correo electrónico Freelance:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684; text-decoration: none; color: inherit;">
  //                   <span style="text-decoration: none; color: inherit;">${data.emailFreelancer}</span>
  //                 </td>
  //               </tr>
  //               <!-- Teléfono Freelance -->
  //               <tr>
  //                 <td style="text-align: left; padding: 10px 0 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 700; font-size: 14px; line-height: 17px; color: #747684;">
  //                   <strong>Teléfono Freelance:</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="text-align: left; padding: 2px 0; font-family: 'Inter'; font-style: normal; font-weight: 400; font-size: 18px; line-height: 146%; color: #747684;">
  //                   ${data.phoneFreelancer}
  //                 </td>
  //               </tr>
  //             </table>
  //           </td>
  //         </tr>
  //       </table>
  //     </td>
  //   </tr>
  // </table>
  //     `;



  //     // Envío del correo con el contenido HTML directamente desde el repository
  //     await this.mailerService.sendMail({
  //       to: process.env.EMAIL_ADMIN,
  //       subject: '¡Proyecto Finalizado!',
  //       from: `DreUP <${process.env.MAILER_EMAIL}>`, // Configuración del from en el repository
  //       html: htmlContent, // Contenido HTML
  //     });

  //     return {
  //       mensaje: 'Email enviado',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: `${error.message}`,
  //       error: 'Error al enviar el correo',
  //     });
  //   }
  // }
}
