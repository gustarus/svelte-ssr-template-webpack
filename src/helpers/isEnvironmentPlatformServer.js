export default function isEnvironmentPlatformServer() {
  return typeof window === 'undefined';
}
