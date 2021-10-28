import {ILoadTestResult} from "./ILoadTestResult";

export class CsvGenerator {

  /**
   * The header line for the CSV output.
   */
  public static HEADERS = [
    "Encryption Module",
    "Entry Count",
    "Cumulative Time (ms)",
    "Average Read/Write Time (ms)",
    "Average Write Time (ms)",
    "Average Read Time (ms)"
  ];

  public static generateCsv(results: ILoadTestResult[]): string {
    if (!Array.isArray(results)) {
      throw new Error("results must be an array");
    }

    const data = results
      .map(row => {
        const {moduleId, entryCount, totalTimeMs, averageReadTimeMs, averageWriteTimeMs, averageRearWriteTimeMs} = row
        return [
          moduleId,
          entryCount,
          totalTimeMs,
          averageReadTimeMs,
          averageWriteTimeMs,
          averageRearWriteTimeMs
        ].join(",");
      });

    data.unshift(CsvGenerator.HEADERS.join(","));

    return data.join("\n");
  }
}