import Image from 'next/image'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full max-w-[1512px] mx-auto flex justify-between items-center px-4 md:px-[64px] lg:px-[128px] py-4 md:py-[40px]">
      <div className="flex items-center">
        <Image
          priority
          alt="DevFest Ilorin Logo"
          className="h-auto w-auto"
          height={60}
          src="/svg/logo.svg"
          width={180}
        />
      </div>
      <Link href="https://2025.devfestilorin.com" rel="noopener noreferrer" target="_blank">
        <Button showArrow size="pill" variant="black">
          <span className="w-fit whitespace-normal text-center leading-[120%]">
            View 2025
          </span>
        </Button>
      </Link>
    </nav>
  )
}
