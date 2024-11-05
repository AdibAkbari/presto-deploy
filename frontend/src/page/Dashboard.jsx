import InputModal from '../component/InputModal.jsx';

function Dashboard({token}) {
  return <>
    <InputModal
      instruction={'Enter the name for your presentation'}
      nameOfInput={'Presentation Name'}
      token={token}
    />
  </>;
};

export default Dashboard;
