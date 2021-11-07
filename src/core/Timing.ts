/**
 * A helper class to get timestamps for timing.  It uses
 * "performance.now()" if available, try node's perf_hooks
 * API and then finally revert to "Date.now()".
 */
export class Timing {

  private static _READ = "read";
  private static _WRITE = "write";

  private static _READ_START = "read_start_";
  private static _READ_END = "read_end_";

  private static _WRITE_START = "write_start_";
  private static _WRITE_END = "write_end_";

  public static readStart(i: number): void {
    globalThis.performance.mark(Timing._READ_START + i);
  }

  public static readEnd(i: number): void {
    const endMark = Timing._READ_END + i;
    globalThis.performance.mark(Timing._READ_END + i);
    globalThis.performance.measure(
      Timing._READ, Timing._READ_START + i, endMark);
  }

  public static writeStart(i: number): void {
    globalThis.performance.mark(Timing._WRITE_START + i);
  }

  public static writeEnd(i: number): void {
    const endMark = Timing._WRITE_END + i;
    globalThis.performance.mark(Timing._WRITE_END + i);
    globalThis.performance.measure(
      Timing._WRITE, Timing._WRITE_START + i, endMark);
  }

  public static getTotalReadTime(): number {
    return this._getTotal(Timing._READ);
  }

  public static getTotalWriteTime(): number {
    return this._getTotal(Timing._WRITE);
  }
  
  public static clear(): void {
    globalThis.performance.clearMarks();
    globalThis.performance.clearMeasures();
  }

  private static _getTotal(name: string): number {
    let total = 0;
    const entries = globalThis.performance.getEntriesByName( name);
    for(const e of entries) {
      total += e.duration
    }

    return total;
  }
}