import { IConfig } from '@/types'

const config: IConfig = {
  appEnv:
    (process.env.NEXT_PUBLIC_APP_ENV as IConfig['appEnv']) ?? 'development',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'DevFest Ilorin 2026',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000/',
  ticketUrl:
    process.env.NEXT_PUBLIC_TICKET_URL ??
    'https://gdg.community.dev/events/details/google-gdg-ilorin-presents-devfest-ilorin-2026/',
  dinnerTicketUrl: process.env.NEXT_PUBLIC_DINNER_TICKET_URL ?? '',
  // The event photo gallery, shared now that DevFest Ilorin 2026 is over.
  photosUrl:
    process.env.NEXT_PUBLIC_PHOTOS_URL ??
    'https://photos.fuskar.app/devfest-ilorin?collection=87ccec23-15b5-470e-92ad-94e21bff72f2',
  // Day 1's photos, shared after the Day 2 gallery above.
  day1PhotosUrl:
    process.env.NEXT_PUBLIC_DAY1_PHOTOS_URL ??
    'https://event.fuskar.app/events/36ec97e4-8d6a-4371-8095-60c1098f072b/photos?view=collection&collection=d4c52c79-2040-4b46-b396-d109aba37cf9',
  cliUrl: process.env.NEXT_PUBLIC_CLI_URL ?? 'https://devfest-cli.web.app',
  mapUrl: process.env.NEXT_PUBLIC_MAP_URL ?? 'https://devfest-map.web.app',
  typeraceUrl:
    process.env.NEXT_PUBLIC_TYPERACE_URL ?? 'https://devfest-typerace.web.app',
  faajiUrl: process.env.NEXT_PUBLIC_FAAJI_URL ?? 'https://faaji.web.app',
  // DevFest Map's public read API, for a shared chapter's link preview on
  // /map. The publishable key is public by design (it ships in the map).
  mapApiUrl:
    process.env.NEXT_PUBLIC_MAP_API_URL ??
    'https://xvtcuqyzqfdwtmqgujea.supabase.co',
  mapApiKey:
    process.env.NEXT_PUBLIC_MAP_API_KEY ??
    'sb_publishable_DZtV_DNQFgX_BM6jDuUnLg_loCXnMOK',
  appSubmitUrl:
    process.env.NEXT_PUBLIC_APP_SUBMIT_URL ??
    'https://forms.gle/j7S99UcXKXyy8XpD7',
}

export default config
