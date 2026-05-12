import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import '../styles/BackButton.css'

function BackButton() {
  const navigate = useNavigate()
  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back
    </button>
  )
}

export default BackButton