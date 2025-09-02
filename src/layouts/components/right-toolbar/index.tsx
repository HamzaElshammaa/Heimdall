import { MenuOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import React, { useCallback, useMemo } from 'react';
import User from '../user';

import { useTheme } from '@/components/theme-provider';
import { LanguageList, LanguageMap, ThemeEnum } from '@/constants/common';
import { useChangeLanguage } from '@/hooks/logic-hooks';
import { useFetchUserInfo, useListTenant } from '@/hooks/user-setting-hooks';
import { TenantRole } from '@/pages/user-setting/constants';
import { BellRing, MoonIcon, SunIcon } from 'lucide-react';
import { useNavigate } from 'umi';
import styled from './index.less';

type NavItem = {
  path: string;
  name: string;
  icon: React.ElementType;
};

interface RightToolBarProps {
  navItems?: NavItem[];
  onNavigate?: (path: string) => void;
  currentPathName?: string;
}

const Circle = ({ children, ...restProps }: React.PropsWithChildren) => {
  return (
    <div {...restProps} className={styled.circle}>
      {children}
    </div>
  );
};

/* const handleGithubCLick = () => {
  window.open('https://github.com/infiniflow/ragflow', 'target');
};

const handleDocHelpCLick = () => {
  window.open('https://ragflow.io/docs/dev/category/guides', 'target');
};
 */
const RightToolBar: React.FC<RightToolBarProps> = ({
  navItems = [],
  onNavigate,
  currentPathName,
}) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  const { data } = useListTenant();

  const showBell = useMemo(() => {
    return data.some((x) => x.role === TenantRole.Invite);
  }, [data]);

  const navMenuItems: MenuProps['items'] = (navItems || []).map((item) => {
    const IconComp = item.icon;
    return {
      key: item.path,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={styled.menuIcon}>
            {IconComp ? <IconComp className={styled.iconSvg} /> : null}
          </span>
          <span>{item.name}</span>
        </div>
      ),
    };
  });

  const onDropdownClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      const url = String(key);
      if (/^https?:\/\//i.test(url)) {
        window.open(url, '_blank');
        return;
      }
      onNavigate?.(url);
    },
    [onNavigate],
  );

  const onMoonClick = React.useCallback(() => {
    setTheme(ThemeEnum.Light);
  }, [setTheme]);
  const onSunClick = React.useCallback(() => {
    setTheme(ThemeEnum.Dark);
  }, [setTheme]);

  const handleBellClick = useCallback(() => {
    navigate('/user-setting/team');
  }, [navigate]);

  return (
    <div className={styled.toolbarWrapper}>
      <Space wrap size={16}>
        <Circle>
          {theme === 'dark' ? (
            <MoonIcon onClick={onMoonClick} size={20} color="#fff" />
          ) : (
            <SunIcon onClick={onSunClick} size={20} color="#fff" />
          )}
        </Circle>
        {showBell && (
          <Circle>
            <div className="relative" onClick={handleBellClick}>
              <BellRing className="size-4 " />
              <span className="absolute size-1 rounded -right-1 -top-1 bg-red-600"></span>
            </div>
          </Circle>
        )}
        <User />
    <Dropdown
          menu={{ items: navMenuItems, onClick: onDropdownClick }}
          placement="bottomRight"
        >
          <Circle aria-label="Open navigation menu">
      <MenuOutlined style={{ color: '#fff' }} />
          </Circle>
        </Dropdown>
        
      </Space>
    </div>
  );
};

export default RightToolBar;
