import './certificate.css'

function Certificate() {
  return (
    <section className="certificate-section">
      <div className="certificate-container">
        <h2>Certificate of Completion</h2>
        
        <p>
          You will receive your own certificate after completing the course and 
          submitting your two projects with live and GitHub links. You'll also need 
          to explain your project in a live session with me.
        </p>

        <p>
          This certificate is proof of your hard work and dedication towards learning 
          MERN stack development. It is a testament to your commitment to excellence 
          and your passion for technology.
        </p>
      
        <p>
          This certificate is not just a PDF but also validates that you are a real 
          certified developer who can build real-world applications from start to 
          deployment. It has a unique QR code that can be scanned to validate your 
          certificate.
        </p>
        
        <div className="certificate-image">
          <img src="./certificate.jpg" alt="Certificate of Completion" />
        </div>
      </div>
    </section>
  )
}

export default Certificate