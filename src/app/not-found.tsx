import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-6 px-6 text-center">
      <h2 className="text-3xl font-bold">I think you are lost</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        className="inline-flex h-10 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-90"
        href="/"
      >
        Go home
      </Link>
    </div>
  )
}
