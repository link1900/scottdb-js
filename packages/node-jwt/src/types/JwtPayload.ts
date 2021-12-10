export interface JwtPayload {
  /**
   * Issuer
   */
  iss?: string;

  /**
   *  Subject
   *  is the unique identifier for the token
   *
   */
  sub?: string;

  /**
   * Audience
   */
  aud?: string[];

  /**
   * Issued At, in NumericDate as the number of seconds (not milliseconds) since Epoch
   * @see: https://tools.ietf.org/html/rfc7519#section-2
   */
  iat?: number;

  /**
   * Expiration Time, in NumericDate as the number of seconds (not milliseconds) since Epoch
   * @see: https://tools.ietf.org/html/rfc7519#section-2
   */
  exp?: number;

  /**
   * whitespace delimited list of token scope
   */
  scope?: string;

  azp?: string;
  [key: string]: JwtPayloadValue;
}

export type JwtPayloadValue = string | string[] | number | boolean | undefined;
