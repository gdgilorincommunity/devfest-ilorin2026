import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center w-full max-w-[1512px] mx-auto h-[954px] pt-[280px] pb-[226px] gap-[285px]">
      <div className="flex flex-col items-center justify-center w-full max-w-[1018px] h-[162px] gap-[32px] relative z-0">

        <div className="flex items-center justify-center w-[1018px] h-[65px] gap-[18px]">
          <h1 className="w-[1010px] h-[70px] font-sans font-bold text-[74px] leading-[100%] text-center text-[#1E1E1E]">
            November 2026
          </h1>
        </div>

        <div className="flex justify-center w-[182px] h-[66px] gap-[32px]">
          <button
            className="flex items-center justify-center gap-[10px] w-[182px] h-[66px] px-[27px] py-[20px] rounded-[40px] hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer"
            style={{ background: 'radial-gradient(85.98% 85.98% at 50% 17.07%, #3186FF 52%, #6D97FF 76%, #A9A8FF 100%)' }}
          >
            <span className="w-[100px] h-[19px] font-sans font-bold text-[16px] leading-[120%] text-center align-middle text-white">
              Sponsor Us
            </span>
            <div className="flex items-center justify-center w-[32px] h-[26px] bg-white rounded-[34px]">
              <div
                className="w-[10px] h-[10px]"
                style={{
                  background: 'radial-gradient(85.98% 85.98% at 50% 17.07%, #3186FF 52%, #6D97FF 76%, #A9A8FF 100%)',
                  WebkitMaskImage: 'url(/svg/now.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/svg/now.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
              />
            </div>
          </button>
        </div>

      </div>

      <div
        className="absolute z-20"
        style={{
          top: '431px',
          left: '248px',
          width: '85px',
          height: '10px',
        }}
      >
        <Image
          src="/images/yellow-blob.png"
          alt="Yellow Blob Decoration"
          width={82}
          height={85}
          className="object-contain"
          style={{ transform: 'rotate(3deg)' }}
        />
      </div>

      <div
        className="absolute z-10"
        style={{
          top: '463px',
          left: '180px',
          width: '331px',
          height: '331px'
        }}
      >
        <Image
          src="/images/left-blob.png"
          alt="DevFest event crowd"
          width={331}
          height={331}
          className="object-contain"
        />
      </div>

      <div
        className="absolute z-10"
        style={{
          top: '31px',
          left: '65px',
          width: '289px',
          height: '289px'
        }}
      >
        <Image
          src="/images/star-img.png"
          alt="Star Event Image"
          width={289}
          height={289}
          className="object-contain"
        />
      </div>

      <div
        className="absolute z-20"
        style={{
          top: '55px',
          left: '260px',
          width: '78px',
          height: '78px'
        }}
      >
        <Image
          src="/images/green-vector.png"
          alt="Green Decoration"
          width={70}
          height={70}
          className="object-contain"
          style={{ transform: 'rotate(0deg)' }}
        />
      </div>

      <div
        className="absolute z-10"
        style={{
          top: '-50px',
          left: '1120px',
          width: '332px',
          height: '332px'
        }}
      >
        <Image
          src="/images/round-img.png"
          alt="Right Blob Event Image"
          width={340}
          height={340}
          className="object-contain max-w-none"
        />
      </div>

      <div
        className="absolute z-20"
        style={{
          top: '30px',
          left: '1139px',
          width: '72px',
          height: '72px'
        }}
      >
        <Image
          src="/images/red-vector.png"
          alt="Red Decoration"
          width={72}
          height={72}
          className="object-contain"
          style={{ transform: 'rotate(0deg)' }}
        />
      </div>

      <div
        className="absolute z-10"
        style={{
          top: '522px',
          left: '1010px',
          width: '327px',
          height: '338px'
        }}
      >
        <Image
          src="/images/right-blob.png"
          alt="Bottom Right Blob Event Image"
          width={390}
          height={360}
          className="object-contain"

        />
      </div>

      <div
        className="absolute z-20"
        style={{
          top: '565px',
          left: '990px',
          width: '83px',
          height: '83px'
        }}
      >
        <Image
          src="/images/blue-vector.png"
          alt="Blue Decoration"
          width={83}
          height={83}
          className="object-contain"
          style={{ transform: 'rotate(0deg)' }}
        />
      </div>

    </section>
  )
}
