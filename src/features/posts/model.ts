export interface CreatePost {
  /**
   * @minLength 5
   * @maxLength 50
   */
  title: string;

  /**
   * @minLength 10
   * @maxLength 300
   */
  body: string;
}
