/**
 * A helper class to get timestamps for timing.  It uses
 * "performance.now()" if available, try node's perf_hooks
 * API and then finally revert to "Date.now()".
 */
export class Timing {

  /**
   * @returns The highest precision time the system supports.
   */
  static now(): number {
    if (globalThis.performance !== undefined) {
      return performance.now();
    } else if((globalThis as any).perf_hooks !== undefined) {
      return (globalThis as any).perf_hooks.performance.now();
    } else {
      return Date.now();
    }
  }
}