import React from 'react';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import styles from './index.less';
import { history } from 'umi';
// Use the same icons as the header dropdown
import { getNavItems, NavItem } from '@/layouts/components/header/nav-items';
import { useTranslate } from '@/hooks/common-hooks';

type PortalItem = NavItem;

const LandingPage: React.FC = () => {
  const { data: user } = useFetchUserInfo();
  const username = user?.nickname || 'there';
  const { t } = useTranslate('header');
  const items: PortalItem[] = getNavItems(t);

  const onClick = (item: PortalItem) => {
    const url = item.path;
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    history.push(url);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome {username} what do you want to do today ?</h1>
      <div className={styles.tilesContainer}>
        {items.map((item: PortalItem) => {
          const IconComp = item.icon as React.ElementType | undefined;
          return (
            <div
              key={item.path}
              className={`${styles.portalSelector} portal-selector`}
              role="button"
              tabIndex={0}
              aria-label={item.name}
              onClick={() => onClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick(item);
                }
              }}
            >
              <div className={styles.portalContents}>
                {IconComp ? (
                  <span className={styles.iconWrap} aria-hidden>
                    <IconComp className={styles.iconSvg} />
                  </span>
                ) : null}
                <span className={styles.label}>{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;
