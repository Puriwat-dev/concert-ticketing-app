import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
  variant: "light" | "dark";
}

export default function RoleCard({
  title,
  description,
  icon,
  href,
  buttonText,
  variant,
}: RoleCardProps) {
  const isLight = variant === "light";
  
  const cardClasses = isLight 
    ? "bg-white text-[#0070A4]" 
    : "bg-[#0070A4] text-white";
    
  const buttonClasses = isLight 
    ? "bg-[#0070A4] text-white" 
    : "bg-white text-[#0070A4]";

  return (
    <div className={`role-card ${cardClasses}`}>
      <div className="mb-12">
        {icon}
      </div>

      <h2 className="mb-12 text-4xl font-medium">{title}</h2>
      
      <p className="mb-24 text-sm leading-relaxed">
        {description}
      </p>

      <Link
        href={href}
        className={`mt-auto flex w-full items-center justify-center gap-2 rounded-md py-3 font-semibold ${buttonClasses}`}
      >
        {buttonText}
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
