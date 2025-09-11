import './index.less';
import { useCallback } from 'react';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { Routes } from '@/routes';
import { useTranslation } from 'react-i18next';
import { getNavItems } from '@/layouts/components/header/nav-items';
import { Globe } from 'lucide-react';

const Home = () => {
  const navigate = useNavigateWithFromState();
  const { t } = useTranslation();

  // pull icons from shared nav items so they match the header
  const navItems = getNavItems((k: string) => k);

  const tiles = [
    // Agent first
    { path: Routes.Agents, label: 'Agents', icon: navItems[2]?.icon },
  { path: Routes.Datasets, label: 'Knowledge base', icon: navItems[0]?.icon },
    { path: Routes.Chats, label: 'Chat', icon: navItems[1]?.icon },
    { path: Routes.Files, label: 'File Management', icon: navItems[3]?.icon },
  // External portal: Langfuse
  { path: 'https://cloud.langfuse.com/', label: 'Observability', icon: Globe },
  ];

  const onClick = useCallback(
    (path: string) => () => {
      if (/^https?:\/\//i.test(path)) {
        window.open(path, '_blank');
        return;
      }
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


