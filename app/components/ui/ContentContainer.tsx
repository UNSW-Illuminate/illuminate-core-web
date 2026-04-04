import { type ReactNode } from 'react';

type ContentContainerProps = {
  children: ReactNode;
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ContentContainer({ children, className }: ContentContainerProps) {
  return <div className={joinClasses('mx-auto w-full max-w-7xl', className)}>{children}</div>;
}