// Central place for the external URLs the site links out to.
// Fill these in via .env (see .env.example). Falling back to "#" keeps the
// UI usable during development before the real endpoints exist.

const env = import.meta.env;

export const LINKS = {
  windowsInstaller: env.VITE_WINDOWS_INSTALLER_URL || "#",
  chromeExtension: env.VITE_CHROME_EXTENSION_URL || "#",
  edgeExtension: env.VITE_EDGE_EXTENSION_URL || "#",
  stripePortal: env.VITE_STRIPE_PORTAL_URL || "",
  supportEmail: "support@studylock.app",
};

export const APP_VERSION = "1.0.0";
