import { getDeviceInfo } from './device.js';

export function detectArchitecture() {
  const ua = navigator.userAgent;
  const platform = (navigator.platform || '').toLowerCase();

  if (/aarch64|arm64|ARM/i.test(ua) || /aarch64|arm/i.test(platform)) return 'arm64';
  if (/x86_64|x64|AMD64|Win64/i.test(ua) || /x86_64|x64/i.test(platform)) return 'x64';
  if (/x86|i[3-6]86/i.test(platform)) return 'x64';

  if (navigator.userAgentData && navigator.userAgentData.architecture) {
    const arch = navigator.userAgentData.architecture;
    if (/arm|aarch64/i.test(arch)) return 'arm64';
    if (/x86|amd64/i.test(arch)) return 'x64';
  }

  return 'x64';
}

export function getPlatform() {
  const ua = navigator.userAgent;
  const arch = detectArchitecture();
  if (ua.includes('Mac OS')) return { os: 'mac', arch };
  if (ua.includes('Windows')) return { os: 'win', arch };
  if (ua.includes('Linux')) return { os: 'linux', arch };
  return { os: 'unknown', arch };
}

export function getPlatformLabel(platform) {
  const labels = { mac: 'macOS', win: 'Windows', linux: 'Linux' };
  return labels[platform.os] || 'Unknown';
}

export function getPlatformEmoji(platform) {
  const emojis = { mac: '🍎', win: '🪟', linux: '🐧' };
  return emojis[platform.os] || '';
}

export function getArchLabel(arch) {
  return arch === 'arm64' ? 'ARM' : 'x86_64';
}

export function detectOS() {
  const device = getDeviceInfo();
  if (device.os === 'ios') return { type: 'mobile', os: 'ios', label: `iOS ${device.osVersionFull || ''}` };
  if (device.os === 'android') return { type: 'mobile', os: 'android', label: `Android ${device.osVersionFull || ''}` };
  if (device.chromeOS) return { type: 'desktop', os: 'chromeos', label: 'ChromeOS' };

  const desktop = getPlatform();
  if (desktop.os !== 'unknown') {
    return { type: 'desktop', os: desktop.os, label: getPlatformLabel(desktop), arch: desktop.arch };
  }

  return { type: 'unknown', os: 'unknown', label: 'Unknown' };
}
