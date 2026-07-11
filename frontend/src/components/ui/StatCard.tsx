import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  bgColorClass: string;
}

export default function StatCard({
  icon,
  label,
  value,
  bgColorClass,
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md py-8 text-white shadow-sm ${bgColorClass}`}
    >
      {icon}
      <span className="mb-2 text-lg">{label}</span>
      <span className="text-5xl font-normal">{value}</span>
    </div>
  );
}
