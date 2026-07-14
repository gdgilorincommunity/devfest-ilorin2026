import Image from 'next/image'

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

      <button className="flex items-center justify-center gap-[10px] w-[176px] h-[65px] px-[27px] py-[20px] bg-black rounded-[40px] hover:scale-105 transition-transform duration-300 shadow-sm cursor-pointer">
        <span className="w-[80px] h-[19px] font-bold text-[16px] leading-[120%] text-center align-middle text-white tracking-normal font-sans">
          View 2026
        </span>
        <div className="flex items-center justify-center w-[32px] h-[26px] bg-white rounded-[34px]">
          <Image alt="Arrow Icon" height={10} src="/svg/now.svg" width={10} />
        </div>
      </button>
    </nav>
  )
}
