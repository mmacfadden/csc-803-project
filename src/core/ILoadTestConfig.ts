import {IEncryptionConfig} from "../config";

export interface ILoadTestConfig {
  encryptionConfig: IEncryptionConfig;
  entryCount: number;
  valueSizeBytes: number;
}