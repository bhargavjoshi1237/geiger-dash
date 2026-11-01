// The inbox every public contact surface links to and the contact forms deliver to.
export const CONTACT_EMAIL = "contact@geiger.studio";

// Limits shared by the support form and its server action; 4 MB fits the action body limit in next.config.
export const MAX_ATTACHMENT_FILES = 5;
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

// SVG is excluded because it can carry scripts.
export function isAllowedAttachment(file) {
  return /^(image|video)\//.test(file.type) && file.type !== "image/svg+xml";
}
