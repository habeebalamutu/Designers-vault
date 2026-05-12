import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Designers Vault – Wholesale Elegance</p>
        <p>Contact: support@designersvault.com</p>
      </div>
    </footer>
  )
}

export default Footer