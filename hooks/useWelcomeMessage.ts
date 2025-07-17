import { useEffect, useState } from 'react';

export default function useWelcomeMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('Bienvenido a MyBro ❤️. Estamos aquí para ti.');
  }, []);

  return message;
}
