type ContactFormEmailProps = {
  intent: 'project' | 'hiring'
  name: string
  email: string
  message: string
}

const ContactFormEmail = ({
  intent,
  name,
  email,
  message
}: ContactFormEmailProps) => (
  <div>
    <h1>{intent === 'hiring' ? 'Hiring enquiry' : 'Project enquiry'}</h1>
    <p>
      From <strong>{name}</strong> at {email}
    </p>
    <h2>Message:</h2>
    <p>{message}</p>
  </div>
)

export default ContactFormEmail
