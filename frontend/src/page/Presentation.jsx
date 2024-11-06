import { useParams } from 'react-router-dom';

function Presentation({ token }) {
  const { presentationId } = useParams();

  return (
    <div>presenationId: {presentationId} token: {token}</div>
  );

}

export default Presentation;