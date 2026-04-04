import { type ReactNode } from 'react';

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return <p className={joinClasses('text-base text-white/45', className)}>{children}</p>;
}