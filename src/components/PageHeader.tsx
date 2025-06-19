
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-7 w-7 text-primary hidden md:block" />}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
