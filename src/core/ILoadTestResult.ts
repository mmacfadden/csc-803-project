export interface ILoadTestResult {
  moduleId: string;
  entryCount: number;
  totalTimeMs: number;
  averageReadTimeMs: number;
  averageWriteTimeMs: number;
  averageRearWriteTimeMs: number;
  avgReadThroughputKbps: number;
  avgWriteThroughputKbps: number;
}