import { getNavItems } from './nav-items';
import { useTranslate } from '@/hooks/common-hooks';
import { useFetchAppConf } from '@/hooks/logic-hooks';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { Flex, Layout, Radio, Space, theme } from 'antd';
import { MouseEventHandler, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'umi';
import Toolbar from '../right-toolbar';

import { useTheme } from '@/components/theme-provider';
import styles from './index.less';

const { Header } = Layout;

const RagHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigateWithFromState();
  const { pathname } = useLocation();
  const { t } = useTranslate('header');
  const appConf = useFetchAppConf();
  const { theme: themeRag } = useTheme();
  const tagsData = useMemo(() => getNavItems(t), [t]);

  const currentPath = useMemo(() => {
    return (
      tagsData.find((x) => pathname.startsWith(x.path))?.name || 'knowledge'
    );
  }, [pathname, tagsData]);

  const handleChange = useCallback(
    (path: string): MouseEventHandler =>
      (e) => {
        e.preventDefault();
        navigate(path);
      },
    [navigate],
  );

  // Use Link for client-side navigation to avoid full page reloads

  return (
    <Header
      className=""
      style={{
        padding: '0 16px',
        background: '#171c42', // Dark blue background
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px',
  boxShadow: '0 0 .8rem rgba(0, 0, 0, .3)',
      }}
    >
      <Link to="/">
        <Space size={12} className={styles.logoWrapper}>
          <img src={require('@/assets/heimdal2.png')} alt="" className={styles.appIcon} />
          {/* <span className={styles.appName}>{appConf.appName}</span> */}
        </Space>
      </Link>
      <Space size={[0, 8]} wrap>
        {/* <Radio.Group
          defaultValue="a"
          buttonStyle="solid"
          className={
            themeRag === 'dark' ? styles.radioGroupDark : styles.radioGroup
          }
          value={currentPath}
        >
          {tagsData.map((item, index) => (
            <Radio.Button
              className={`${themeRag === 'dark' ? 'dark' : 'light'} ${index === 0 ? 'first' : ''} ${index === tagsData.length - 1 ? 'last' : ''}`}
              value={item.name}
              key={item.name}
            >
              <a href={item.path}>
                <Flex
                  align="center"
                  gap={8}
                  onClick={handleChange(item.path)}
                  className="cursor-pointer"
                >
                  <item.icon
                    className={styles.radioButtonIcon}
                    stroke={item.name === currentPath ? 'black' : 'white'}
                  ></item.icon>
                  {item.name}
                </Flex>
              </a>
            </Radio.Button>
          ))}
        </Radio.Group> */}
      </Space>
      <Toolbar
        navItems={tagsData}
        onNavigate={(p: string) => navigate(p)}
        currentPathName={currentPath}
      ></Toolbar>
    </Header>
  );
};

export default RagHeader;
