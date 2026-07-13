import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full max-w-[1512px] mx-auto flex justify-between items-center px-[128px] py-[40px]">
      <div className="flex items-center">
        <Image
          src="/svg/logo.svg"
          alt="DevFest Ilorin Logo"
          width={180}
          height={60}
          className="h-auto w-auto"
          priority
        />
      </div>

      <button className="flex items-center justify-center gap-[10px] w-[176px] h-[65px] px-[27px] py-[20px] bg-black rounded-[40px] hover:scale-105 transition-transform duration-300 shadow-sm cursor-pointer">
        <span className="w-[80px] h-[19px] font-bold text-[16px] leading-[120%] text-center align-middle text-white tracking-normal font-sans">
          View 2026
        </span>
        <div className="flex items-center justify-center w-[32px] h-[26px] bg-white rounded-[34px]">
          <Image
            src="/svg/now.svg"
            alt="Arrow Icon"
            width={10}
            height={10}
          />
        </div>
      </button>
    </nav>
  )
}
