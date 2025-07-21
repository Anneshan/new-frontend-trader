import React, { useState, useEffect } from 'react';
import { Shield, Mail, Phone } from 'lucide-react';
import { IPRestrictionService } from '../utils/ipRestriction';

interface IPRestrictionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const IPRestrictionGuard: React.FC<IPRestrictionGuardProps> = ({ children, fallback }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userIP, setUserIP] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIPAuthorization();
  }, []);

  const checkIPAuthorization = async () => {
    try {
      setIsLoading(true);
      const [authorized, ip] = await Promise.all([
        IPRestrictionService.isAuthorizedIP(),
        IPRestrictionService.getUserIP()
      ]);
      
      setIsAuthorized(authorized);
      setUserIP(ip);
    } catch (error) {
      console.error('IP authorization check failed:', error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-red-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Access Restricted
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {IPRestrictionService.getRestrictionMessage()}
          </p>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Your IP Address:</p>
            <p className="text-white font-mono text-lg">{userIP}</p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-white font-medium mb-2">What you can access:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Landing page and product information</li>
                <li>• Account registration and login</li>
                <li>• Basic platform overview</li>
              </ul>
            </div>

            <div className="text-left">
              <h3 className="text-white font-medium mb-2">Restricted features:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Trading dashboard</li>
                <li>• Account management</li>
                <li>• Copy trading features</li>
                <li>• Analytics and reports</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-white font-medium mb-4">Need Access?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@copytrader.pro"
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </a>
              <a
                href="tel:+1-555-0123"
                className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </a>
            </div>
          </div>

          <button
            onClick={checkIPAuthorization}
            className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Retry Access Check
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default IPRestrictionGuard;