import './index.less';
import { useCallback } from 'react';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { Routes } from '@/routes';
import { useTranslation } from 'react-i18next';
import { getNavItems } from '@/layouts/components/header/nav-items';
import { House } from 'lucide-react';

const Home = () => {
  const navigate = useNavigateWithFromState();
  const { t } = useTranslation();

  // pull icons from shared nav items so they match the header
  const navItems = getNavItems((k: string) => k);

  const tiles = [
    // Home and Search temporarily removed
    { path: Routes.Datasets, label: 'Dataset', icon: navItems[0]?.icon },
    { path: Routes.Chats, label: 'Chat', icon: navItems[1]?.icon },
    { path: Routes.Agents, label: 'Agent', icon: navItems[3]?.icon },
    { path: Routes.Files, label: 'File Management', icon: navItems[4]?.icon },
  ];

  const onClick = useCallback(
    (path: string) => () => {
      navigate(path as any);
    },
    [navigate],
  );

  return (
    <div className="home-page">
      <div className="tilesContainer" role="list">
        {tiles.map((t) => {
          const Icon = t.icon as any;
          return (
            <div
              key={t.path}
              role="button"
              tabIndex={0}
              className="portalSelector"
              onClick={onClick(t.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick(t.path)();
              }}
            >
              <div className="portalContents">
                <div className="portalIcon" aria-hidden>
                  {Icon ? <Icon className="iconSvg" /> : null}
                </div>
                <div className="portalLabel">{t.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
