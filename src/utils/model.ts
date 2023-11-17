export interface TakeSkip {
  /**
   * @default 30
   * @minimum 1
   * @maximum 100
   */
  take: number;

  /**
   * @default 0
   * @minimum 0
   */
  skip: number;
}
