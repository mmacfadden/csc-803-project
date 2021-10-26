/**
 * Defines the progress callbacks that the LoadTester class will use
 * to inform consumers on the execution of load tests.
 */
export interface ILoadTesterHooks {
  /**
   * Indicates that a test run has started.
   * @param module
   *   The name of the module being tested.
   */
  testStarted: (module: string) => void;

  /**
   * Indicates that a test run has finished.
   *
   * @param module
   *   The name of the module that was tested.
   */
  testFinished: (module: string) => void;
}