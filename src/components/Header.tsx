import { cn } from '../lib/cn';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { paths } from '../routes/paths';
import { showHeaderActionPath } from '../constants/common';
import { useAccount } from '../hooks/use-account';
import logo from '../assets/logo.png';

type Props = {
  title: string;
  onClick?: () => void;
};

export default function Header({ title, onClick }: Props) {
  const { isConnected } = useAccount();
  const { pathname } = useLocation();
  const pathInfo = useMemo(() => {
    return Object.values(paths).find((path) => path.url === pathname) as {
      name?: string;
      url: string;
    };
  }, [pathname]);

  const isShowConnectAction =
    !showHeaderActionPath.includes(pathname) || !isConnected;

  return (
    <div className="container pb-2">
      <header className="flex items-center gap-4 py-4">
        <div className="flex-1 flex items-center gap-2 md:gap-4 text-xl">
          <img src={logo} alt="logo" className="h-9" />
        </div>
        {isShowConnectAction && (
          <button
            className={cn(
              'bg-joc-primary px-3 md:px-4 py-1 rounded-full text-lg md:text-xl font-medium text-joc-primary',
              !onClick ? '' : 'hover:opacity-80 transition-opacity',
            )}
            onClick={onClick}
            disabled={!onClick}
          >
            {title}
          </button>
        )}
      </header>
      {pathInfo?.name && <div className="text-2xl">{pathInfo.name}</div>}
    </div>
  );
}
