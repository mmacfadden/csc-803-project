import {IEncryptionConfig} from "../config";

/**
 * Represents a single load test configuration.
 */
export interface ILoadTestConfig {
  /**
   * The encryption configuration to use for the test.
   */
  encryptionConfig: IEncryptionConfig;

  /**
   * The number of read / write operations to conduct.
   */
  operationCount: number;

  /**
   * The size of the value to store in bytes.
   */
  valueSizeBytes: number;
}