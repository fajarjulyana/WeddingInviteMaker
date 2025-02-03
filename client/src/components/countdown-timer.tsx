import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <Card key={unit} className="p-4 text-center min-w-[100px]">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground capitalize">{unit}</div>
        </Card>
      ))}
    </div>
  );
}
