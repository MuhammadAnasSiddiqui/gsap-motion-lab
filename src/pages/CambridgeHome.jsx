import { useEffect, useRef } from 'react'
import { useReveal } from '../lib/useReveal'
import Hero from '../components/Hero'
import Stats from '../components/sections/Stats'
import Steps from '../components/sections/Steps'
import PublishForm from '../components/sections/PublishForm'
import BookSpin from '../components/sections/BookSpin'
import Gallery from '../components/sections/Gallery'
import WhyChoose from '../components/sections/WhyChoose'
import AuthorStories from '../components/sections/AuthorStories'
import Banners from '../components/sections/Banners'
import Genres from '../components/sections/Genres'
import Testimonials from '../components/sections/Testimonials'
import FaqFooter from '../components/sections/FaqFooter'

// Cambridge Book Publishing homepage, served at /camblp.
function CambridgeHome() {
  const main = useRef(null)
  // Generic [data-reveal] scroll reveals for every section below the hero.
  useReveal(main)
  useEffect(() => { document.title = 'Cambridge Book Publishing' }, [])

  return (
    <main ref={main}>
      <Hero />
      <Stats />
      <Steps />
      <PublishForm />
      <BookSpin />
      <Gallery />
      <WhyChoose />
      <AuthorStories />
      <Banners />
      <Genres />
      <Testimonials />
      <FaqFooter />
    </main>
  )
}

export default CambridgeHome
