import { EmblaOptionsType } from 'embla-carousel'
import Navbar from '../components/layout/Navbar'
import Carousel from '../components/ui/Carousel'
import '../styles/components/carousel.css'

const OPTIONS: EmblaOptionsType = { align: 'start' }

const SLIDES = [
  {
    id: 1,
    title: 'Mining site',
    url: '/interactive',
    description: 'Mine the blocks and see the physics in action',
    image: '/images/interactive/tooltip.jpg',
  },
  {
    id: 2,
    title: 'Scrolled animation site',
    url: '/interactive',
    description: 'A UI centered site focusing on animations.',
    image: '/images/interactive/physics.jpg',
  },
  {
    id: 3,
    title: 'Ball physics site',
    url: '/interactive',
    description: 'A ball you can interact with, throw and bounce.',
    image: '/images/interactive/materials.jpg',
  },
]

function Interactive() {
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>The interactive area</h2>
        <p>
            Here you will be able to find interactive experiments. 
        </p>
      </div>

      <Carousel slides={SLIDES} options={OPTIONS} />
    </>
  )
}

export default Interactive
