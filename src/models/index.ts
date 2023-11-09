export interface LimitOffset {
  /**
   * @default 30
   * @minimum 1
   * @maximum 100
   */
  limit: number;

  /**
   * @default 0
   * @minimum 0
   */
  offset: number;
}

export interface Login {
  /** @format email */
  email: string;

  /**
   * @minLength 8
   * @format password
   */
  password: string;
}
