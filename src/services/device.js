export function getMobileOS() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return null;
}

export function getMobileOSLabel(os) {
  const labels = { ios: 'iOS', android: 'Android' };
  return labels[os] || null;
}

export function getiOSVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: match[3] ? parseInt(match[3]) : 0,
    full: `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`
  };
}

export function getAndroidVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/Android\s(\d+)\.(\d+)\.?(\d+)?/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: match[3] ? parseInt(match[3]) : 0,
    full: `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`
  };
}

export function getMobileVersion(os) {
  if (os === 'ios') return getiOSVersion();
  if (os === 'android') return getAndroidVersion();
  return null;
}

export function isMobile() {
  return getMobileOS() !== null || /Mobile/.test(navigator.userAgent);
}

export function isTablet() {
  const ua = navigator.userAgent;
  return /iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (/Edg/.test(ua)) return { name: 'Edge', vendor: 'Microsoft' };
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return { name: 'Chrome', vendor: 'Google' };
  if (/Firefox/.test(ua)) return { name: 'Firefox', vendor: 'Mozilla' };
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return { name: 'Safari', vendor: 'Apple' };
  if (/Opera|OPR/.test(ua)) return { name: 'Opera', vendor: 'Opera' };
  return { name: 'Unknown', vendor: 'Unknown' };
}

export function isChromeOS() {
  return /CrOS/.test(navigator.userAgent);
}

export function getDeviceInfo() {
  const mobileOS = getMobileOS();
  const version = mobileOS ? getMobileVersion(mobileOS) : null;
  const browser = getBrowserInfo();
  return {
    mobile: isMobile(),
    tablet: isTablet(),
    os: mobileOS,
    osLabel: getMobileOSLabel(mobileOS),
    osVersion: version,
    osVersionFull: version?.full || null,
    browser,
    chromeOS: isChromeOS(),
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    userAgent: navigator.userAgent
  };
}

export function getFullOSLabel() {
  const device = getDeviceInfo();
  if (device.os === 'ios') return `iOS ${device.osVersionFull || '?'}`;
  if (device.os === 'android') return `Android ${device.osVersionFull || '?'}`;
  if (device.chromeOS) return 'ChromeOS';
  return null;
}
