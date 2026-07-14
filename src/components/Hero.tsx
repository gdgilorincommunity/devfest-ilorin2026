import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative flex flex-col w-full max-w-[1512px] mx-auto min-h-[500px] lg:h-[850px] px-4 lg:px-0 py-16 lg:py-0 overflow-hidden">
      <div className="lg:absolute lg:inset-0 flex flex-col items-center justify-center w-full z-10 pointer-events-none gap-8 lg:gap-[32px] mt-8 lg:-mt-[60px]">
        <div className="flex items-center justify-center w-full max-w-[1018px] pointer-events-auto">
          <h1 className="w-full lg:w-[1010px] font-sans font-bold text-5xl lg:text-[74px] leading-[110%] lg:leading-[100%] text-center text-[#1E1E1E]">
            November 2026
          </h1>
        </div>

        <div className="flex justify-center pointer-events-auto">
          <button
            className="flex items-center justify-center gap-[10px] w-[186px] h-[65px] px-[27px] py-[20px] rounded-[40px] hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer"
            style={{
              background:
                'radial-gradient(85.98% 85.98% at 50% 17.07%, #3186FF 52%, #6D97FF 76%, #A9A8FF 100%)',
            }}
          >
            <span className="w-[100px] h-[19px] font-sans font-bold text-[16px] leading-[120%] text-center align-middle text-white">
              Sponsor Us
            </span>
            <div className="flex items-center justify-center w-[32px] h-[26px] bg-white rounded-[34px]">
              <div
                className="w-[10px] h-[10px]"
                style={{
                  background:
                    'radial-gradient(85.98% 85.98% at 50% 17.07%, #3186FF 52%, #6D97FF 76%, #A9A8FF 100%)',
                  WebkitMaskImage: 'url(/svg/now.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/svg/now.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      <div className="relative w-full h-full flex flex-col lg:flex-row justify-between items-center lg:items-stretch z-0 mt-16 lg:mt-0 gap-16 lg:gap-0 lg:px-0">
        <div className="flex flex-col items-center lg:items-start w-full lg:w-auto gap-16 lg:gap-0 lg:pl-[65px] lg:pt-[31px]">
          <div className="relative w-fit mx-auto lg:mx-0">
            <Image
              alt="Star Event Image"
              className="object-contain"
              height={289}
              src="/images/star-img.png"
              width={289}
            />
            <div className="absolute top-[24px] left-[195px] z-20">
              <Image
                alt="Green Decoration"
                className="object-contain"
                height={70}
                src="/images/green-vector.png"
                style={{ transform: 'rotate(0deg)' }}
                width={70}
              />
            </div>
          </div>

          <div className="relative w-fit mx-auto lg:mx-0 mt-16 lg:mt-[170px] lg:ml-[115px]">
            <Image
              alt="DevFest event crowd"
              className="object-contain"
              height={331}
              src="/images/left-blob.png"
              width={331}
            />
            <div className="absolute top-[-32px] left-[68px] z-20">
              <Image
                alt="Yellow Blob Decoration"
                className="object-contain"
                height={85}
                src="/images/yellow-blob.png"
                style={{ transform: 'rotate(3deg)' }}
                width={82}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start w-full lg:w-auto gap-16 lg:gap-0 lg:pr-[92px] lg:pt-[0px]">
          <div className="relative w-fit mx-auto lg:mx-0 lg:-mt-[50px]">
            <Image
              alt="Right Blob Event Image"
              className="object-contain max-w-none"
              height={340}
              src="/images/round-img.png"
              width={340}
            />
            <div className="absolute top-[80px] left-[19px] z-20">
              <Image
                alt="Red Decoration"
                className="object-contain"
                height={72}
                src="/images/red-vector.png"
                style={{ transform: 'rotate(0deg)' }}
                width={72}
              />
            </div>
          </div>

          <div className="relative w-fit mx-auto lg:mx-0 lg:mt-[200px] lg:-ml-[70px]">
            <Image
              alt="Bottom Right Blob Event Image"
              className="object-contain max-w-none"
              height={340}
              src="/images/right-blob.png"
              width={360}
            />
            <div className="absolute top-[56px] -left-[20px] z-20">
              <Image
                alt="Blue Decoration"
                className="object-contain"
                height={83}
                src="/images/blue-vector.png"
                style={{ transform: 'rotate(0deg)' }}
                width={83}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
