import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'mn', 'ru', 'vi'],
  defaultLocale: 'ko',
});
