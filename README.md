# DevFestIlorin Official Website

Official Website for Devfest Ilorin 2026

Welcome to the official repository of **DevFest Ilorin Website**, the biggest tech conference in North Central Nigeria! This event is part of the global **DevFest** initiative hosted by **Google Developer Groups (GDG)**. Our aim is to bring together developers, tech enthusiasts, and industry leaders to share knowledge, network, and build the future of technology.

## Getting Started

These instructions will help you set up the project locally and get it running on your machine for development and testing purposes.

### Prerequisites

- Node.js (version 20 or higher)
- pnpm (version 10 or higher)
- Git

To check your versions:

```bash
node --version
pnpm --version
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/Ahmzyjazzy/devfest-ilorin2026
```

2. Navigate to the project directory

```bash
cd devfest-ilorin2026
```

3. Install dependencies

```bash
pnpm install
```

4. Prepare husky installation

```bash
pnpm prepare
```

### Running the Project Locally

To run the project on your local machine:

```bash
pnpm dev
```

The application should now be running on `http://localhost:3000` (or your specified port).

### Testing & Linting

```bash
pnpm test         # run jest
pnpm test:watch   # jest watch mode
pnpm lint         # eslint --fix
pnpm format       # prettier --write
```

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) (initialized, no components yet)
- [TanStack Query](https://tanstack.com/query) 5
- TypeScript, ESLint (flat config), Prettier
- Husky + Commitlint (conventional commits)
- Jest + Testing Library

## Contributing

We welcome contributions to the Devfest Event project! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

#### Creating a PR

- Switch to the main branch
- Checkout to a new feature branch using the ticket name assigned on JIRA
  e.g if ticket name is TM-001 then that is the branch name
  `git checkout -b yourbranchname`
- See [PULL_REQUEST_TEMPLATE.md](/.github/PULL_REQUEST_TEMPLATE.md) for guide on filling the Pull request template
- If a feature branch exist for the current task you're working on, kindly branch out from that feature branch to create your branch
  E.g if we have a feature/epic-name all related ticket that belongs to the epic, their branch should also point to it when submiting PR

#### Commit message

Follow the commit message standard as outlined below:

```sh
PATTERN="^(build|chore|ci|docs|feat|fix|perf|refactor|style|test)(\([a-z]+\))?: .{1,100}$"
```

###### Commit Message flags

- feat - new feature or task implementation
- fix - bug fix
- docs - add update to readme or make some code documentation via comment only
- style - formatting-only changes
- refactor - minor rework on codebase or implementation improvement that affect one or less files (<= 5 files)
- test - adding test
- chore - major change to existing implementation that affect many files (>=6 files)
- build, ci, perf - build system, CI, and performance changes respectively

e.g

```
git commit -m 'feat: implement login flow'
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- GDG Ilorin technical team

---

We appreciate your interest and contributions!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

### Deploying to Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the project:

```bash
vercel
```

4. Follow the prompts to complete the deployment.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
