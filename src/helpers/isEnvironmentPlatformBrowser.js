export default function isEnvironmentPlatformBrowser() {
  return typeof window !== 'undefined';
}
