import { FastifyRequest } from 'fastify';

/**
 * The locale set by the Accept-Language header or `en-US` if not set.
 */
export type Locale = string;

export default function ({ headers }: FastifyRequest): Locale {
  const acceptLanguage = headers['accept-language'];

  if (acceptLanguage) {
    const [locale] = acceptLanguage.split(',');

    if (locale) {
      return locale;
    }
  }

  return 'en-US';
}
