import { useCallback, useEffect, useState, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import { Link } from 'react-router-dom'
import { PrevButton, NextButton } from './CarouselPiler'

type SlideItem = {
  id: number
  title: string
  url: string
  description?: string
  image?: string
}

type CarouselProps = {
  slides: SlideItem[]
  options?: EmblaOptionsType
}

const Carousel = ({ slides, options }: CarouselProps) => {
  const emblaOptions = useMemo(
    () => ({ ...(options || {}), loop: true, watchDrag: false, slidesToScroll: 1 }),
    [options]
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    const total = emblaApi.scrollSnapList().length
    if (total === 0) return
    const current = emblaApi.selectedScrollSnap()
    const prevIndex = (current - 1 + total) % total
    emblaApi.scrollTo(prevIndex)
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    const total = emblaApi.scrollSnapList().length
    if (total === 0) return
    const current = emblaApi.selectedScrollSnap()
    const nextIndex = (current + 1) % total
    emblaApi.scrollTo(nextIndex)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    if ((emblaApi as any).options && (emblaApi as any).options().loop) {
      setPrevBtnDisabled(false)
      setNextBtnDisabled(false)
      return
    }

    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide.id}>
              <Link to={slide.url} className="embla__slide__inner">
              {slide.image && (
                <img
                src={slide.image}
                alt={slide.title}
                className="embla__slide__image"
                />
              )}
  <div className="embla__slide__content">
    <h3>{slide.title}</h3>
    {slide.description && <p>{slide.description}</p>}
  </div>
</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </div>
  )
}

export default Carousel