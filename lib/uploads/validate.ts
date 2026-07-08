/**
 * Client-side upload validation shared by every upload surface (documents,
 * brand-ad creatives, avatars). Server-side protection remains the storage
 * bucket RLS policies; this layer exists so unsupported or oversized files
 * never crash the UI and always produce a friendly Spanish message.
 */

export interface UploadRule {
  /** Allowed MIME types (checked when the browser provides one). */
  mimes: string[];
  /** Allowed extensions, lowercase without dot (fallback when MIME is empty). */
  exts: string[];
  /** Max size in bytes. */
  maxBytes: number;
  /** Human description used in error messages, e.g. "PDF, JPG, PNG o DOC". */
  label: string;
}

export const DOCUMENT_RULE: UploadRule = {
  mimes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  exts: ["pdf", "jpg", "jpeg", "png", "doc", "docx"],
  maxBytes: 15 * 1024 * 1024,
  label: "PDF, JPG, PNG, DOC o DOCX",
};

export const AD_MEDIA_RULE: UploadRule = {
  mimes: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"],
  exts: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
  maxBytes: 20 * 1024 * 1024,
  label: "JPG, PNG, GIF, MP4 o MOV",
};

export const AVATAR_RULE: UploadRule = {
  mimes: ["image/jpeg", "image/png", "image/webp"],
  exts: ["jpg", "jpeg", "png", "webp"],
  maxBytes: 4 * 1024 * 1024,
  label: "JPG, PNG o WEBP",
};

function fmtMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

/** Returns a friendly Spanish error, or null when the file is acceptable. */
export function validateUpload(file: File, rule: UploadRule): string | null {
  if (!file || file.size === 0) {
    return "El archivo está vacío. Elige un archivo con contenido.";
  }
  if (file.size > rule.maxBytes) {
    return `El archivo pesa demasiado (máximo ${fmtMb(rule.maxBytes)}).`;
  }
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const mimeOk = file.type ? rule.mimes.includes(file.type) : false;
  const extOk = rule.exts.includes(ext);
  // Accept when either signal matches (some browsers/OSes report empty or
  // generic MIME types for perfectly valid files).
  if (!mimeOk && !extOk) {
    return `Ese tipo de archivo no es compatible. Usa ${rule.label}.`;
  }
  return null;
}

/** Storage-safe object name (keeps the extension, strips odd characters). */
export function safeStorageName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}
