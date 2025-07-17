import useWelcomeMessage from '../hooks/useWelcomeMessage';

export default function Welcome() {
  const mensaje = useWelcomeMessage();

  return (
    <div>
      <h2>{mensaje}</h2>
    </div>
  );
}
