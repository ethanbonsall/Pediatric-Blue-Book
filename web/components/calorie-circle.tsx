// File: web/components/calorie-circle.tsx
// Visual component that displays calorie information as a circular progress indicator.
// Shows current calorie amount vs ideal amount with color-coded status (red if below threshold, green otherwise).

// Props interface for CalorieCircle component
interface CalorieCircleProps {
  formattedAmount: string; // Current calorie amount to display
  formattedIdeal: string; // Ideal calorie amount for comparison
  isBelowThreshold: boolean; // Whether current amount is below the threshold (determines color)
}

const CalorieCircle = ({
  formattedAmount,
  formattedIdeal,
  isBelowThreshold,
}: CalorieCircleProps) => {
  // Function: Extracts numeric value from formatted string (removes units, etc.)
  const parseNumeric = (value: string): number => {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const amount = parseNumeric(formattedAmount);
  const ideal = parseNumeric(formattedIdeal);
  const percent = Math.min(Math.max((amount / (ideal || 1)) * 100, 0), 100);

  const color = isBelowThreshold ? "#b91c1c" : "#15803d";

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const radius = isMobile ? 40 : 80;
  const strokeWidth = isMobile ? 6 : 10;

  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative w-24 h-24  md:w-48 md:h-48">
      <svg className="w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth={strokeWidth}
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
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-lg md:text-2xl font-semibold">{formattedAmount}</p>
        <p className="text-xs text-gray-600">{formattedIdeal}</p>
      </div>
    </div>
  );
};

export default CalorieCircle;
