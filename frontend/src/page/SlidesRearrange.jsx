import { useContext } from 'react';
import PresentationContext from '../PresentationContext'
import {useNavigate} from 'react-router-dom';

function SlidesRearrange() {
  const navigate = useNavigate();
  const {
    setIsRearranging,
  } = useContext(PresentationContext);

  return <div>
    SlidesRearrange
    <button onClick={() => {
      setIsRearranging(false);
      navigate(-1);
    }}>Back</button>
  </div>;
}


export default SlidesRearrange;