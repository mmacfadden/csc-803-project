/**
 * A helper class to get timestamps for timing.  It uses
 * "performance.now()" if available and reverts to "Date.now()"
 * if it is not.
 */
export class Timing {

  /**
   * @returns The highest precision time the system supports.
   */
  static now(): number {
    if (typeof globalThis["performance"] !== "undefined") {
      return performance.now();
    } else {
      return Date.now();
    }
  }
}