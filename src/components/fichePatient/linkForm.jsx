import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './linkForm.css';

const SendGoogleForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const googleFormLink = 'https://forms.gle/your-google-form-link';

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    setSending(true);
    setError('');
    setSuccess(false);

    try {
      await emailjs.send(
        'service_mx9acsp', // Remplacez par votre ID de service EmailJS
        'template_kt1vnxm', // Remplacez par votre ID de template EmailJS
        {
          to_email: email,
          form_link: googleFormLink,
        },
        '3OSs-9t0ItkYc4v2Y' // Remplacez par votre clé publique EmailJS
      );

      setSuccess(true);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de l\'envoi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="googleFormMainContainer">
      <h2>Envoyer un formulaire d'admission</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Formulaire envoyé avec succès !</p>}
      <form onSubmit={sendEmail}>
        <div className='googleFormContainer'>
        <label>
          Adresse e-mail :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        
        <button type="submit" disabled={sending}>
          {sending ? 'Envoi en cours...' : 'Envoyer le formulaire'}
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default SendGoogleForm;