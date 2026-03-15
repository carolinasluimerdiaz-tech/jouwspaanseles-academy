
import { UserAccount } from '../types';

const ADMIN_EMAIL = 'jouwspaanseles@gmail.com';

export class EmailService {
  /**
   * Simulates/Triggers an automated welcome email to the student.
   * In a production environment, this would call a backend SMTP relay or service like SendGrid.
   */
  public async sendWelcomeEmail(user: UserAccount): Promise<boolean> {
    console.info(`[EmailService] Sending Welcome Email to: ${user.email}`);
    
    const text = `¡Hola ${user.name}!

Tu cuenta en ZayroLingua Academy ha sido creada con éxito.

Detalles de tu cuenta:
Email: ${user.email}
Contraseña: ${user.password || '******'}

Ya puedes acceder y empezar a practicar con Carolina AI.

Accede aquí: ${window.location.origin}

¡Mucho éxito en tu aprendizaje!`;

    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: "¡Bienvenido a ZayroLingua Academy! 🎓",
          text
        })
      });
      return resp.ok;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return false;
    }
  }

  public async notifyAdmin(user: UserAccount): Promise<boolean> {
    const text = `Se ha registrado un nuevo estudiante:
Nombre: ${user.name}
Email: ${user.email}
Fecha: ${new Date().toLocaleString()}`;

    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: "NUEVO ESTUDIANTE REGISTRADO - ZayroLingua",
          text
        })
      });
      return resp.ok;
    } catch (error) {
      console.error("Failed to notify admin:", error);
      return false;
    }
  }

  public async sendTestEmail(to: string, name: string, pass: string): Promise<{success: boolean, error?: string}> {
    const text = `Hola, esta es una prueba de tu sistema de login.

Cuenta creada:
Nombre: ${name}
Password: ${pass}

Este sistema ahora es seguro y solo permite registros autorizados.`;

    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: "Test de Cuenta - ZayroLingua",
          text
        })
      });
      
      if (!resp.ok) {
        const data = await resp.json();
        return { success: false, error: data.error || 'Unknown error' };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Failed to send test email:", error);
      return { success: false, error: 'Network error or server down' };
    }
  }

  /**
   * Triggers a recovery flow for password resets.
   */
  public async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
    console.info(`[EmailService] Sending Recovery Email to: ${email}`);
    // Simulate logic
  }
}

export const emailService = new EmailService();
