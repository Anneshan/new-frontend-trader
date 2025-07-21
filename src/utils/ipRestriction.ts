// IP-based access control utility
export class IPRestrictionService {
  private static allowedIPs = [
    '192.168.1.100',
    '192.168.1.101',
    '192.168.1.102',
    '192.168.1.103',
    '192.168.1.104',
    '192.168.1.154',
    'localhost',
    '127.0.0.1',
    // Add your office/home IPs here
  ];

  private static userIP: string | null = null;

  // Get user's IP address
  static async getUserIP(): Promise<string> {
    if (this.userIP) return this.userIP;

    try {
      // Try multiple IP detection services
      const services = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://ip.seeip.org/jsonip',
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          const ip = data.ip || data.query;
          
          if (ip) {
            this.userIP = ip;
            console.log('🌐 User IP detected:', ip);
            return ip;
          }
        } catch (error) {
          console.warn('IP service failed:', service, error);
          continue;
        }
      }

      // Fallback for development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.userIP = 'localhost';
        return 'localhost';
      }

      throw new Error('Could not detect IP');
    } catch (error) {
      console.error('Failed to get user IP:', error);
      this.userIP = 'unknown';
      return 'unknown';
    }
  }

  // Check if current IP is authorized for advanced features
  static async isAuthorizedIP(): Promise<boolean> {
    try {
      const userIP = await this.getUserIP();
      const isAuthorized = this.allowedIPs.includes(userIP);
      
      console.log('🔒 IP Authorization Check:', {
        userIP,
        isAuthorized,
        allowedIPs: this.allowedIPs
      });

      return isAuthorized;
    } catch (error) {
      console.error('IP authorization check failed:', error);
      return false; // Deny access on error
    }
  }

  // Check if user can access dashboard features
  static async canAccessDashboard(): Promise<boolean> {
    return await this.isAuthorizedIP();
  }

  // Check if user can access trading features
  static async canAccessTrading(): Promise<boolean> {
    return await this.isAuthorizedIP();
  }

  // Get restriction message for unauthorized users
  static getRestrictionMessage(): string {
    return 'Access to advanced features is restricted to authorized locations. Please contact support for access.';
  }

  // Add IP to allowed list (for admin use)
  static addAllowedIP(ip: string): void {
    if (!this.allowedIPs.includes(ip)) {
      this.allowedIPs.push(ip);
      console.log('✅ Added IP to allowed list:', ip);
    }
  }

  // Remove IP from allowed list (for admin use)
  static removeAllowedIP(ip: string): void {
    const index = this.allowedIPs.indexOf(ip);
    if (index > -1) {
      this.allowedIPs.splice(index, 1);
      console.log('❌ Removed IP from allowed list:', ip);
    }
  }

  // Get current allowed IPs (for admin dashboard)
  static getAllowedIPs(): string[] {
    return [...this.allowedIPs];
  }
}