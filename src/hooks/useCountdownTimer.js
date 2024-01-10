import { useEffect, useRef, useState } from 'react';

const useCountdownTimer = (startDate) => {
  const [timeDifference, setTimeDifference] = useState('');
  const [timerEnded, setTimerEnded] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const calculateTimeDifference = () => {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      const currentDate = new Date();
      const timeDiff = endDate - currentDate;

      if (timeDiff <= 0) {
        setTimerEnded(true);
        clearInterval(intervalRef.current);
        return 'Timer ended';
      }

      const seconds = Math.floor(timeDiff / 1000);
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const remainingSeconds = seconds % 60;

      return `${days} DAYS : ${hours} HOURS : ${minutes} MINUTES : ${remainingSeconds} SECONDS`;
    };

    // Initialize the time difference
    setTimeDifference(calculateTimeDifference(startDate));

    // Update the time difference every second
    intervalRef.current = setInterval(() => {
      setTimeDifference(calculateTimeDifference(startDate));
    }, 1000);

    // Cleanup interval on unmount or when startDate changes
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [startDate]);

  return { timeDifference, timerEnded };
};

export default useCountdownTimer;
