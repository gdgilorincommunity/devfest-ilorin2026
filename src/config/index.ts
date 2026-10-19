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
  cliUrl: process.env.NEXT_PUBLIC_CLI_URL ?? 'https://devfest-cli.web.app',
  mapUrl: process.env.NEXT_PUBLIC_MAP_URL ?? 'https://devfest-map.web.app',
  appSubmitUrl:
    process.env.NEXT_PUBLIC_APP_SUBMIT_URL ??
    'https://forms.gle/j7S99UcXKXyy8XpD7',
}

export default config
