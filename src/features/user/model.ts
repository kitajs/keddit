export interface CreateUser {
  /**
   * @minLength 3
   */
  name: string;

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

export interface UpdateUser {
  /** @minLength 3 */
  name?: string;

  /** @format email */
  email: string;
}

export interface EmailAndPassword {
  /** @format email */
  email: string;

  /**
   * @minLength 8
   * @format password
   */
  password: string;
}
