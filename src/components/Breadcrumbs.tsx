import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="label flex flex-wrap items-center gap-x-2 gap-y-1 text-ink/50 mb-6">
      <Link
        href="/"
        className="flex items-center hover:text-moss-700 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.href} className="flex items-center space-x-2">
            <ChevronRight className="h-3 w-3 text-ink/30" />
            {isLast ? (
              <span className="text-ink">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-trap-500 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
