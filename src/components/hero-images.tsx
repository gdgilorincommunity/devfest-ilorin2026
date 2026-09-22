'use client'

import { HeroBlob, HeroBlobClipPaths } from '@/components/hero-blob'
import { HeroImageScroller } from '@/components/hero-image-scroller'
import { HERO_BLOB_CLUSTERS } from '@/lib/hero-blobs'

const HERO_IMAGE_SIZE = {
  mobile: 300,
  desktop: 330,
} as const

const [clusterOne, clusterTwo, clusterThree, clusterFour] = HERO_BLOB_CLUSTERS

export function HeroImages() {
  return (
    <>
      <HeroBlobClipPaths />

      <div className="relatives w-full pb-4 lg:hidden">
        {' '}
        {/*Removed the mt-auto to reduce the excess space on the images top in mobile version */}
        <HeroImageScroller direction="left" speed="medium">
          {HERO_BLOB_CLUSTERS.map((cluster, index) => (
            <li
              key={cluster.id}
              className="relative flex shrink-0 items-center justify-center"
              style={{
                height: HERO_IMAGE_SIZE.mobile,
                width: HERO_IMAGE_SIZE.mobile,
              }}
            >
              <HeroBlob
                cluster={cluster}
                priority={index === 0}
                size={HERO_IMAGE_SIZE.mobile}
              />
            </li>
          ))}
        </HeroImageScroller>
      </div>

      <div className="relative mt-8 hidden h-full w-full flex-col items-center justify-between gap-16 lg:mt-6 lg:flex lg:flex-row lg:items-stretch lg:gap-0 lg:px-0">
        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-7.75 lg:pl-16.25">
          <div className="relative mx-auto w-fit lg:mx-0">
            <HeroBlob
              priority
              cluster={clusterOne}
              size={HERO_IMAGE_SIZE.desktop}
            />
          </div>

          <div className="relative mx-auto mt-16 w-fit lg:mx-0 lg:mt-2.5 lg:ml-21.25">
            <HeroBlob cluster={clusterTwo} size={HERO_IMAGE_SIZE.desktop} />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pt-0 lg:pr-23">
          <div className="relative mx-auto w-fit lg:mx-0 lg:-mt-12.5">
            <HeroBlob cluster={clusterThree} size={HERO_IMAGE_SIZE.desktop} />
          </div>

          <div className="relative mx-auto w-fit lg:mx-0 lg:mt-20 lg:-ml-17.5">
            <HeroBlob cluster={clusterFour} size={HERO_IMAGE_SIZE.desktop} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroImages
