/**
 * Bounding box in normalized coordinates (0..1 relative to image width/height).
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Bounding box in absolute pixel coordinates.
 */
export interface PixelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** ISO 8601 timestamp string. */
export type ISOTimestamp = string;

/** App-generated short id (nanoid, length 10). */
export type ShortId = string;