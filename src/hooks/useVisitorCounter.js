
import { useState, useEffect } from 'react';

export const useVisitorCounter = () => {
  const [count, setCount] = useState(() => {
    try {
      const savedCount = localStorage.getItem('ffcs-visitor-count');
      return savedCount ? parseInt(savedCount, 10) : 0;
    } catch (error) {
      console.error('Error reading visitor count from localStorage', error);
      return 0;
    }
  });

  useEffect(() => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('ffcs-visitor-count', newCount.toString());
  }, []); // This effect now runs only once on initial mount, as intended.

  // This effect will run only on the very first load of the app instance.
   useEffect(() => {
    const isFirstVisit = !localStorage.getItem('ffcs_visitor_has_visited');
    if (isFirstVisit) {
      const currentCount = parseInt(localStorage.getItem('ffcs-visitor-count') || '0', 10);
      const newCount = currentCount + 1;
      localStorage.setItem('ffcs-visitor-count', newCount.toString());
      localStorage.setItem('ffcs_visitor_has_visited', 'true');
      setCount(newCount);
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


  return count;
};
