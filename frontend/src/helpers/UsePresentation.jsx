import { useState, useEffect } from 'react';
import { getStore, updateStore } from './ApiDatastore';

const usePresentation = (token, presentationId) => {
  const [presentation, setPresentation] = useState(null);
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    if (token) {
      getStore(token)
        .then(response => {
          const store = response.data.store || [];
          setPresentations(store);
          const currentPresentation = store.find(p => p.presentationId === presentationId);
          setPresentation(currentPresentation || null);
        })
        .catch(error => console.error('Error loading presentation:', error));
    }
  }, [token, presentationId]);

  const savePresentationsToStore = (updatedData) => {
    updateStore(token, updatedData)
      .then(() => {
        console.log('Presentation edited successfully', updatedData);
        setPresentations(updatedData);
      })
      .catch(error => console.error('Error editing presentations:', error));
  };

  return {
    presentation,
    setPresentation,
    presentations,
    savePresentationsToStore,
  };
};

export default usePresentation;
