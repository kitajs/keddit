export interface LimitOffset {
  /**
   * @minimum 1
   * @maximum 30
   * @default 30
   */
  limit: number;

  /**
   * @minimum 0
   * @default 0
   */
  offset: number;
}

export interface Login {
  /**
   * @format email
   */
  email: string;

  /**
   * @minLength 8
   * @format password
   */
  password: string;
}
