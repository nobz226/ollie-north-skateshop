import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="label mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] text-bone/45">
      <Link href="/" className="transition-colors hover:text-bone">
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.href} className="flex items-center gap-3">
            <span className="text-blood-500" aria-hidden>✦</span>
            {isLast ? (
              <span className="text-bone/85" aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-bone">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
