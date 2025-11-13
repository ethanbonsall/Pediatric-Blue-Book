interface CalorieCircleProps {
  formattedAmount: string;
  formattedIdeal: string;
  isBelowThreshold: boolean;
}

const CalorieCircle = ({
  formattedAmount,
  formattedIdeal,
  isBelowThreshold,
}: CalorieCircleProps) => {
  const parseNumeric = (value: string): number => {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const amount = parseNumeric(formattedAmount);
  const ideal = parseNumeric(formattedIdeal);
  const percent = Math.min(Math.max((amount / (ideal || 1)) * 100, 0), 100);

  const color = isBelowThreshold ? "#b91c1c" : "#15803d";
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="10"
          stroke="lightgray"
          fill="none"
          className="transition-all duration-700"
        />
      </svg>

      <svg className="w-full h-full absolute top-0 left-0 rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="10"
          stroke={color}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold">{formattedAmount}</p>
        <p className="text-xs text-gray-600">{formattedIdeal}</p>
      </div>
    </div>
  );
};

export default CalorieCircle;
