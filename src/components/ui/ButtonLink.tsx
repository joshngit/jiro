import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  to: string;
}

export function ButtonLink({ children, to, ...props }: Props) {
  return (
    <Link
      to={to}
      {...props}
      className="w-full bg-joc-primary flex items-center justify-center py-6 rounded-md text-joc-primary text-2xl"
    >
      {children}
    </Link>
  );
}
