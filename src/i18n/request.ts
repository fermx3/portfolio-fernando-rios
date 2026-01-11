import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Use default if no locale provided
  if (!locale) {
    locale = 'en';
  }

  // Ensure we have a valid locale
  const validLocale = ['en', 'es'].includes(locale) ? locale : 'en';

  const messages = (await import(`../../messages/${validLocale}.json`)).default;

  return {
    locale: validLocale,
    messages
  };
});
