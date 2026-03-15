
import { UserAccount } from '../types';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'zayrolingua_v2_active_session'
};

export class DatabaseService {
  /**
   * Finds a specific user by email.
   * Note: This is now async as it might need to fetch from server.
   * For simplicity in this app, we'll use it for local checks if needed, 
   * but primary auth happens via login API.
   */
  public async findUser(email: string): Promise<UserAccount | null> {
    // We don't have a "get user" by email endpoint for security, 
    // but we can use login with a dummy password or just rely on the login flow.
    // For the purpose of the AuthGate check, we'll just return null and let the API handle it.
    return null; 
  }

  /**
   * Creates a new permanent account.
   */
  public async createUser(userData: UserAccount): Promise<{ success: boolean; error?: string }> {
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (resp.ok) {
        return { success: true };
      } else {
        const data = await resp.json();
        return { success: false, error: data.error || 'Fallo en el registro.' };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  }

  /**
   * Logs in a user.
   */
  public async login(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (resp.ok) {
        const data = await resp.json();
        return { success: true, user: data.user };
      } else {
        const data = await resp.json();
        return { success: false, error: data.error || 'Email o contraseña inválidos.' };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  }

  private isUpdating = false;
  private pendingUpdate: UserAccount | null = null;

  /**
   * Updates an existing user's progress and stats.
   */
  public async updateUser(userData: UserAccount): Promise<void> {
    if (this.isUpdating) {
      this.pendingUpdate = userData;
      return;
    }

    this.isUpdating = true;
    try {
      const resp = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        console.error('Server rejected update:', resp.status, errorData);
      }
    } catch (err) {
      console.error('Failed to sync user data to server (Network Error):', err);
    } finally {
      this.isUpdating = false;
      if (this.pendingUpdate) {
        const nextUpdate = this.pendingUpdate;
        this.pendingUpdate = null;
        // Small delay to avoid hammering the server
        setTimeout(() => this.updateUser(nextUpdate), 1000);
      }
    }
  }

  /**
   * Sets the current active session for persistence.
   */
  public setActiveSession(email: string | null): void {
    if (email) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }

  /**
   * Gets the persisted active session email.
   */
  public getActiveSessionEmail(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
}

export const databaseService = new DatabaseService();
