'use client';

import { useState, useEffect } from 'react';

type DeviceType = 'chromebook' | 'tablet' | 'mobile';

interface DeviceInfo {
  device: DeviceType;
  isChromebook: boolean;
  isMobile: boolean;
  isTablet: boolean;
  width: number;
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    device: 'chromebook',
    isChromebook: true,
    isMobile: false,
    isTablet: false,
    width: 1200,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();

      // Check for Chrome OS
      const isChromeOS = userAgent.includes('cros');

      // Determine device type based on width
      let device: DeviceType;
      if (width < 768) {
        device = 'mobile';
      } else if (width < 1024) {
        device = 'tablet';
      } else {
        device = 'chromebook';
      }

      // Override to chromebook if on Chrome OS regardless of size
      if (isChromeOS) {
        device = 'chromebook';
      }

      setDeviceInfo({
        device,
        isChromebook: device === 'chromebook',
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        width,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceInfo;
}
