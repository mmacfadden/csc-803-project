export class Timing {
  static now(): number {
    if (typeof globalThis["performance"] !== "undefined") {
      return performance.now();
    } else {
      return Date.now();
    }
  }
}