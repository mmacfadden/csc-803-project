export interface ILoadTestResult {
  moduleId: string;
  entryCount: number;
  totalTimeMs: number;
  averageReadTimeMs: number;
  averageWriteTimeMs: number;
  averageReadWriteTimeMs: number;
  avgReadThroughputKbps: number;
  avgWriteThroughputKbps: number;
}