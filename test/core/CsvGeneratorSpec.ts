import {expect} from 'chai';
import {CsvGenerator, ILoadTestResult} from '../../src/';

describe('CsvGenerator', () => {
  describe('generateCsv', () => {
    it('Throws if results are not set', () => {
      expect(() => CsvGenerator.generateCsv(undefined as any)).to.throw();
    });

    it('Returns a single header line for an empty array', () => {
      const result = CsvGenerator.generateCsv([]);
      expect(result.split("\n").length).to.eq(1);
    });

    it('Returns a string with the correct number of lines', () => {
      const row: ILoadTestResult = {
        moduleId: "id",
        entryCount: 100,
        totalTimeMs: 1,
        averageWriteTimeMs: 1,
        averageReadWriteTimeMs: 1,
        averageReadTimeMs: 1,
        avgWriteThroughputKbps: 10,
        avgReadThroughputKbps: 20
      }
      const results = [row, row];
      const result = CsvGenerator.generateCsv(results);
      expect(result.split("\n").length).to.eq(results.length + 1);
    });
  });
});