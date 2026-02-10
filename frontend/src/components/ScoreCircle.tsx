"use client";

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ScoreCircle({
  score,
  size = 160,
  strokeWidth = 12,
  label = "Overall Score",
}: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#22c55e", text: "text-green-400", bg: "text-green-500/20" };
    if (s >= 60) return { stroke: "#a78bfa", text: "text-violet-400", bg: "text-violet-500/20" };
    if (s >= 40) return { stroke: "#facc15", text: "text-yellow-400", bg: "text-yellow-500/20" };
    return { stroke: "#ef4444", text: "text-red-400", bg: "text-red-500/20" };
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{Math.round(score)}</span>
          <span className="text-xs text-white/40">/100</span>
        </div>
      </div>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}
