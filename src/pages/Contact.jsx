import { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'
import '../styles/Contact.css'
import BackButton from '../components/BackButton'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate sending message (no backend yet)
    console.log('Contact form:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="contact-page fade-in">
        <BackButton />
      <h1>Contact Us</h1>
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <p>Have questions about wholesale orders? We're here to help.</p>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>wholesale@designersvault.com</span>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <span>+1 (555) 789-0123</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <span>123 Design District, NY 10001</span>
          </div>
        </div>
        <div className="contact-form-container">
          {submitted && (
            <div className="success-message">
              <FaCheckCircle />
              <span>Message sent! We'll reply within 24h.</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="send-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact