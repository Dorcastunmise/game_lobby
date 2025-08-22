import { useEffect, useState } from "react";

export default function CountdownTimer({ seconds, onComplete }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time]);

  return <div className="countdown">Time Left: {time}s</div>;
}
