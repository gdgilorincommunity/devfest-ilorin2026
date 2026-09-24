import type { Metadata } from 'next'

import config from '@/config'

export const metadata: Metadata = {
  title: `CLI - ${config.appName}`,
  description: `Install and use the ${config.appName} command line tool.`,
  // The embedded site is the canonical home for this content.
  alternates: { canonical: config.cliUrl },
}

/**
 * Full-bleed embed of the DevFest CLI site.
 *
 * The visitor keeps the /cli URL on this domain while the CLI app renders in
 * place. `fixed inset-0` takes the iframe out of the root layout's flex
 * column so it fills the viewport with no page chrome around it, and 100dvh
 * keeps it correct under mobile browser toolbars.
 *
 * Note: there is deliberately no chrome over the frame, so the only way back
 * is the browser's back button. An exit control belongs in the CLI app's own
 * terminal header — it owns that layout and can show the control only when it
 * detects being framed, linking out with target="_top" to escape the frame.
 */
export default function CliPage() {
  return (
    <iframe
      allow="clipboard-write; fullscreen"
      className="fixed inset-0 h-[100dvh] w-screen border-0"
      src={config.cliUrl}
      title={`${config.appName} CLI`}
    />
  )
}
