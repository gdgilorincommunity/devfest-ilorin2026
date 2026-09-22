/**
 * The 2026 agenda, transcribed from the organisers' schedule document.
 *
 * Speakers are referenced by id and resolved through `getSpeaker`, so a
 * name or role only ever lives in one place. Anything the document still
 * leaves open — pending GDE slots, unfilled standard sessions, unnamed
 * panelists — is kept as a `tba` session rather than dropped, so the page
 * reflects the real state of the programme.
 *
 * Day 2 has no confirmed start times yet, only durations; those sessions
 * render in running order without a clock time.
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

const GDE_WORKSHOP_TBA = (id: string): AgendaSession => ({
  id,
  kind: 'workshop',
  title: 'Google Developer Expert workshop',
  duration: '40 min',
  tba: true,
  note: 'Speaker and topic to be announced',
})

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
            title:
              'Building a Trustworthy AI Agent for Election Intelligence with ADK and the Antigravity Harness',
            speakerIds: ['gabriel-agbobli'],
          },
          {
            id: 'd1-a-3',
            kind: 'workshop',
            time: '11:20 – 12:00',
            duration: '40 min',
            title: 'Design-to-Code with Antigravity and Stitch MCP',
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
          { ...GDE_WORKSHOP_TBA('d1-b-3'), time: '11:20 – 12:00' },
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
      'Conference day on the main stage — keynote, talks, lightning sessions and two panels — with workshops running in Rooms A and B.',
    accent: 'green',
    tracks: [
      {
        id: 'day-2-main',
        name: 'Main stage',
        sessions: [
          {
            id: 'd2-m-1',
            kind: 'keynote',
            title: "What's Different in 2026",
            duration: '10 min',
            speakerIds: ['areous'],
            note: 'Opening address',
          },
          {
            id: 'd2-m-2',
            kind: 'talk',
            title: 'Standard session',
            duration: '25 min',
            tba: true,
            note: 'Speaker and topic to be announced',
          },
          {
            id: 'd2-m-3',
            kind: 'talk',
            title:
              'Context Engineering: Building AI Systems That Remember, Reason, and Scale',
            duration: '25 min',
            speakerIds: ['daniel-okoro'],
          },
          {
            id: 'd2-m-4',
            kind: 'technical',
            title:
              'Inside a Ransomware Response: What Founders and Policymakers Get Wrong About Cyber Risk',
            duration: '35 min',
            speakerIds: ['hamza-lateef'],
          },
          {
            id: 'd2-m-5',
            kind: 'talk',
            title: 'Standard session',
            duration: '25 min',
            tba: true,
            note: 'Speaker and topic to be announced',
          },
          {
            id: 'd2-m-6',
            kind: 'lightning',
            title:
              'Offline-First Web Apps: Building Experiences That Work Without the Internet',
            duration: '10 min',
            speakerIds: ['daniel-olowoniyi'],
          },
          {
            id: 'd2-m-7',
            kind: 'community',
            title: 'Community Notes',
            duration: '20 min',
            presenter: 'The GDG Ilorin team',
          },
          {
            id: 'd2-m-8',
            kind: 'talk',
            title:
              'Why Every Company Needs an AI Layer: The Next Evolution of Digital Transformation',
            duration: '25 min',
            speakerIds: ['oluyinka-abubakar'],
          },
          {
            id: 'd2-m-9',
            kind: 'lightning',
            title: 'Lightning talk',
            duration: '10 min',
            speakerIds: ['sodiq-akinjobi'],
            tba: true,
            note: 'Topic to be announced · timing tentative',
          },
          {
            id: 'd2-m-10',
            kind: 'lightning',
            title:
              "Becoming a Product Engineer: Why the Line Between 'Dev' and 'Everything Else' Is Blurring",
            duration: '10 min',
            speakerIds: ['fabusuyi-deborah'],
          },
          {
            id: 'd2-m-11',
            kind: 'panel',
            title: 'Building for Impact — Cloud, AI, and Access',
            duration: '35 min',
            moderatorId: 'ahmed-olarenwaju',
            speakerIds: ['oladosu-ibrahim', 'shalom-bamigboye', 'john-oba'],
            note: 'One further panelist to be announced',
          },
          {
            id: 'd2-m-12',
            kind: 'panel',
            title: 'Shipping Agents — From Demo to Production',
            duration: '35 min',
            speakerIds: ['yusuf-sanusi', 'lateefah-bello'],
            note: 'Further panelists to be announced',
          },
          {
            id: 'd2-m-13',
            kind: 'hardware',
            title: 'Robotics Today! Google Cardboard',
            duration: '35 min',
            speakerIds: ['olawore-hikmah'],
            note: 'Hardware demo · co-presenter to be announced',
          },
          { ...GDE_WORKSHOP_TBA('d2-m-14'), duration: '35 min' },
          {
            id: 'd2-m-15',
            kind: 'community',
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
            title:
              'Fork, Delegate, Merge: Build a Multi-Agent Orchestrator from Scratch',
            duration: '40 min',
            speakerIds: ['iniobong-pius-umouman'],
          },
          {
            id: 'd2-a-2',
            kind: 'workshop',
            title: 'WebAI: Building Browser-Native Conversational AI Agents',
            duration: '40 min',
            speakerIds: ['kerry-okpere'],
          },
          GDE_WORKSHOP_TBA('d2-a-3'),
        ],
      },
      {
        id: 'day-2-room-b',
        name: 'Room B · Workshop',
        sessions: [
          {
            id: 'd2-b-1',
            kind: 'workshop',
            title: 'Deploy, Manage, and Observe ADK Agents on Cloud Run',
            duration: '40 min',
            speakerIds: ['daniel-umoren'],
          },
          GDE_WORKSHOP_TBA('d2-b-2'),
          {
            id: 'd2-b-3',
            kind: 'workshop',
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
