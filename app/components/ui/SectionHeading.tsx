import { type ReactNode } from 'react';

type SectionHeadingProps = {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function SectionHeading({ children, as: Tag = 'h2', className }: SectionHeadingProps) {
  return <Tag className={joinClasses('font-light text-white', className)}>{children}</Tag>;
}