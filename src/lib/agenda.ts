/**
 * The 2026 agenda, transcribed from the organisers' schedule document.
 *
 * Speakers are referenced by id and resolved through `getSpeaker`, so a
 * name or role only ever lives in one place. Anything the document still
 * leaves open — an unconfirmed topic, unnamed panelists or co-presenters — is
 * kept on the session as a `tba` flag or note rather than dropped, so the
 * page reflects the real state of the programme.
 *
 * Day 1's afternoon (Jummat, then the round table) has no clock times yet;
 * those sessions render in running order with their duration instead.
 */
export type SessionKind =
  | 'keynote'
  | 'talk'
  | 'technical'
  | 'lightning'
  | 'panel'
  | 'workshop'
  | 'hardware'
  | 'community'
  | 'break'

export interface AgendaSession {
  id: string
  kind: SessionKind
  title: string
  duration: string
  /** Clock time, only where the document confirms one. */
  time?: string
  /** Speaker ids, resolved via `getSpeaker`. */
  speakerIds?: string[]
  /** Moderator id for panels. */
  moderatorId?: string
  /** Free-text presenter line where the document gives no individual. */
  presenter?: string
  /** True when the slot exists but the speaker or topic is unconfirmed. */
  tba?: boolean
  /** Extra line under the session, e.g. why a slot is fixed. */
  note?: string
}

export interface AgendaTrack {
  id: string
  name: string
  sessions: AgendaSession[]
}

export interface AgendaDay {
  id: string
  label: string
  date: string
  summary: string
  /** Matches the ticket card for the same day. */
  accent: 'yellow' | 'green'
  tracks: AgendaTrack[]
}

export const AGENDA: AgendaDay[] = [
  {
    id: 'day-1',
    label: 'Day 1',
    date: 'Friday, November 6',
    summary:
      'Hands-on workshops across three rooms, breaking for Jummat and closing with a community round table.',
    accent: 'yellow',
    tracks: [
      {
        id: 'day-1-room-a',
        name: 'Room A · Workshop',
        sessions: [
          {
            id: 'd1-a-1',
            kind: 'workshop',
            time: '10:00 – 10:40',
            duration: '40 min',
            title:
              'Context Engineering with Google ADK: Keeping Long-Running Agents on Track',
            speakerIds: ['dami-oshun'],
          },
          {
            id: 'd1-a-2',
            kind: 'workshop',
            time: '10:40 – 11:20',
            duration: '40 min',
            title: 'WebAI: Building Browser-Native Conversational AI Agents',
            speakerIds: ['kerry-okpere'],
          },
          {
            id: 'd1-a-3',
            kind: 'workshop',
            time: '11:20 – 12:00',
            duration: '40 min',
            title:
              'Build an AI-Powered Customer Support Agent Using Firebase AI Logic',
            speakerIds: ['ahmed-olarenwaju'],
          },
        ],
      },
      {
        id: 'day-1-room-b',
        name: 'Room B · Workshop',
        sessions: [
          {
            id: 'd1-b-1',
            kind: 'workshop',
            time: '10:00 – 10:40',
            duration: '40 min',
            title:
              'Getting Started with Google Antigravity: The Agent-First IDE',
            speakerIds: ['umar-farouk-zubairu'],
          },
          {
            id: 'd1-b-2',
            kind: 'workshop',
            time: '10:40 – 11:20',
            duration: '40 min',
            title:
              'Agentic Flutter: Mastering Function Calling & Autonomous Tool Execution',
            speakerIds: ['david-oluwabusayo'],
          },
          {
            id: 'd1-b-3',
            kind: 'workshop',
            time: '11:20 – 12:00',
            duration: '40 min',
            title:
              'Securing Agentic Workloads on GKE via Least-Privilege Design',
            speakerIds: ['mileke-kolawole'],
          },
        ],
      },
      {
        id: 'day-1-room-c',
        name: 'Room C · Workshop',
        sessions: [
          {
            id: 'd1-c-1',
            kind: 'workshop',
            time: '10:40 – 11:20',
            duration: '40 min',
            title: 'AI-Assisted Product Design: Idea to Functional Product',
            speakerIds: ['akorede-ibrahim'],
          },
          {
            id: 'd1-c-2',
            kind: 'workshop',
            time: '11:20 – 12:00',
            duration: '40 min',
            title: 'Building Multimodal Voice AI Agents',
            speakerIds: ['tunmise-akinade'],
          },
        ],
      },
      {
        id: 'day-1-afternoon',
        name: 'Afternoon',
        sessions: [
          {
            id: 'd1-break',
            kind: 'break',
            title: 'Jummat break',
            duration: 'Fixed',
            note: 'Nothing is scheduled against this slot.',
          },
          {
            id: 'd1-roundtable',
            kind: 'community',
            title: 'Community Round Table — Fireside Chat',
            duration: 'After Jummat',
          },
        ],
      },
    ],
  },
  {
    id: 'day-2',
    label: 'Day 2',
    date: 'Saturday, November 7',
    summary:
      'Conference day on the main stage — keynotes, talks, lightning sessions and two panels — with workshops running in Rooms A and B.',
    accent: 'green',
    tracks: [
      {
        id: 'day-2-main',
        name: 'Main stage',
        sessions: [
          {
            id: 'd2-m-1',
            kind: 'keynote',
            time: '9:30 – 9:40',
            title: "What's Different in 2026",
            duration: '10 min',
            speakerIds: ['areous'],
            note: 'Opening address',
          },
          {
            id: 'd2-m-16',
            kind: 'keynote',
            time: '9:40 – 10:00',
            title: 'AI Can Write the Code. Can You Trust It?',
            duration: '20 min',
            speakerIds: ['mohammed-yayah'],
          },
          {
            id: 'd2-m-2',
            kind: 'talk',
            time: '10:05 – 10:30',
            title: 'Open Source, Community and Content as a Career Engine',
            duration: '25 min',
            speakerIds: ['idris-olubisi'],
          },
          {
            id: 'd2-m-17',
            kind: 'lightning',
            time: '10:30 – 10:40',
            title: 'Building Products People Actually Need',
            duration: '10 min',
            speakerIds: ['oluwasegun-afariogun'],
          },
          {
            id: 'd2-m-4',
            kind: 'technical',
            time: '10:45 – 11:20',
            title:
              'Inside a Ransomware Response: What Founders and Policymakers Get Wrong About Cyber Risk',
            duration: '35 min',
            speakerIds: ['hamza-lateef'],
          },
          {
            id: 'd2-lunch',
            kind: 'break',
            time: '12:40 – 1:40',
            title: 'Lunch break',
            duration: '60 min',
          },
          {
            id: 'd2-m-3',
            kind: 'talk',
            time: '1:40 – 2:05',
            title:
              'Context Engineering: Building AI Systems That Remember, Reason, and Scale',
            duration: '25 min',
            speakerIds: ['daniel-okoro'],
          },
          {
            id: 'd2-m-6',
            kind: 'lightning',
            time: '2:05 – 2:15',
            title:
              'Offline-First Web Apps: Building Experiences That Work Without the Internet',
            duration: '10 min',
            speakerIds: ['daniel-olowoniyi'],
          },
          {
            id: 'd2-m-9',
            kind: 'keynote',
            time: '2:15 – 2:25',
            title: 'Keynote',
            duration: '10 min',
            speakerIds: ['sodiq-akinjobi'],
            tba: true,
            note: 'Topic to be announced · timing tentative',
          },
          {
            id: 'd2-m-8',
            kind: 'talk',
            time: '2:30 – 2:55',
            title:
              'Why Every Company Needs an AI Layer: The Next Evolution of Digital Transformation',
            duration: '25 min',
            speakerIds: ['oluyinka-abubakar'],
          },
          {
            id: 'd2-m-7',
            kind: 'community',
            time: '2:55 – 3:15',
            title: 'Community Notes',
            duration: '20 min',
            presenter: 'The team: Areous, Fayfay, Daniel & Ahmmzy',
          },
          {
            id: 'd2-m-10',
            kind: 'lightning',
            time: '3:15 – 3:25',
            title:
              "Becoming a Product Engineer: Why the Line Between 'Dev' and 'Everything Else' Is Blurring",
            duration: '10 min',
            speakerIds: ['fabusuyi-deborah'],
          },
          {
            id: 'd2-m-11',
            kind: 'panel',
            time: '3:30 – 3:50',
            title: 'Building for Impact — Cloud, AI, and Access',
            duration: '20 min',
            moderatorId: 'ahmed-olarenwaju',
            speakerIds: ['oladosu-ibrahim', 'shalom-bamigboye'],
          },
          {
            id: 'd2-m-18',
            kind: 'talk',
            time: '3:50 – 4:00',
            title: 'Designing the Computer-Use Layer for an LLM',
            duration: '10 min',
            speakerIds: ['john-oba'],
            note: 'Solo session',
          },
          {
            id: 'd2-m-12',
            kind: 'panel',
            time: '4:05 – 4:40',
            title:
              'Build, Secure, Scale — Developers and Builders in the Agentic Era',
            duration: '35 min',
            speakerIds: ['yusuf-sanusi', 'abdulmalik-salawu', 'lateefah-bello'],
          },
          {
            id: 'd2-m-13',
            kind: 'hardware',
            time: '4:45 – 5:00',
            title: 'Robotics Today!',
            duration: '15 min',
            speakerIds: ['olawore-hikmah'],
            note: 'Hardware demo',
          },
          {
            id: 'd2-m-15',
            kind: 'community',
            time: '5:05 – 5:20',
            title:
              'After the Hackathon, What Next? Cultivating Communities Past Day 2',
            duration: '15 min',
            speakerIds: ['habeeb-ajibola'],
          },
        ],
      },
      {
        id: 'day-2-room-a',
        name: 'Room A · Workshop',
        sessions: [
          {
            id: 'd2-a-1',
            kind: 'workshop',
            time: '11:20 – 12:00',
            title:
              'Fork, Delegate, Merge: Build a Multi-Agent Orchestrator from Scratch',
            duration: '40 min',
            speakerIds: ['iniobong-pius-umouman'],
          },
          {
            id: 'd2-a-2',
            kind: 'workshop',
            time: '12:00 – 12:40',
            title:
              'Building a Trustworthy AI Agent for Election Intelligence with ADK and the Antigravity Harness',
            duration: '40 min',
            speakerIds: ['gabriel-agbobli'],
          },
        ],
      },
      {
        id: 'day-2-room-b',
        name: 'Room B · Workshop',
        sessions: [
          {
            id: 'd2-b-1',
            kind: 'workshop',
            time: '11:20 – 12:00',
            title: 'Deploy, Manage, and Observe ADK Agents on Cloud Run',
            duration: '40 min',
            speakerIds: ['daniel-umoren'],
          },
          {
            id: 'd2-b-3',
            kind: 'workshop',
            time: '12:00 – 12:40',
            title:
              'Observability for Distributed Systems: Metrics, Traces, and Logs That Actually Find Bugs',
            duration: '40 min',
            speakerIds: ['abdul-jemeel-odewole'],
          },
        ],
      },
    ],
  },
]

export interface SpeakerAppearance {
  session: AgendaSession
  day: AgendaDay
  track: AgendaTrack
  /** True when the speaker moderates the session rather than presents it. */
  moderating: boolean
}

/**
 * Every agenda slot a speaker presents or moderates, in running order —
 * day by day, then track by track as the schedule document lists them.
 */
export function getSpeakerAppearances(speakerId: string): SpeakerAppearance[] {
  return AGENDA.flatMap((day) =>
    day.tracks.flatMap((track) =>
      track.sessions.flatMap((session) => {
        const presenting = session.speakerIds?.includes(speakerId) ?? false
        const moderating = session.moderatorId === speakerId

        return presenting || moderating
          ? [{ session, day, track, moderating: !presenting }]
          : []
      }),
    ),
  )
}
