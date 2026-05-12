import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import '../styles/ScrollToTop.css'

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300)
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return isVisible ? (
    <button className="scroll-to-top" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  ) : null
}

export default ScrollToTop