import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Segmented navigation removed; using a hamburger menu instead
import { ThemeEnum } from '@/constants/common';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { Routes } from '@/routes';
// camelCase removed; language dropdown removed
import {
  ChevronDown,
  Cpu,
  File,
  House,
  Library,
  MessageSquareText,
  Moon,
  Search,
  Sun,
  Menu,
} from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'umi';
import { BellButton } from './bell-button';

const handleDocHelpCLick = () => {
  window.open('https://ragflow.io/docs/dev/category/guides', 'target');
};

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigateWithFromState();
  const { navigateToOldProfile } = useNavigatePage();

  // language change hook removed
  const { setTheme, theme } = useTheme();

  const {
    data: { language = 'English', avatar, nickname },
  } = useFetchUserInfo();

  // language selector removed

  const onThemeClick = React.useCallback(() => {
    setTheme(theme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark);
  }, [setTheme, theme]);

  const tagsData = useMemo(
    () => [
  { path: Routes.Root, name: 'Home', icon: House },
      { path: Routes.Datasets, name: t('header.dataset'), icon: Library },
      { path: Routes.Chats, name: t('header.chat'), icon: MessageSquareText },
      { path: Routes.Searches, name: t('header.search'), icon: Search },
      { path: Routes.Agents, name: t('header.flow'), icon: Cpu },
      { path: Routes.Files, name: t('header.fileManager'), icon: File },
    ],
    [t],
  );

  // Navigation items will be rendered in the hamburger menu below

  const handleLogoClick = useCallback(() => {
    navigate(Routes.Root);
  }, [navigate]);

  return (
    <section
      className="flex justify-between items-center text-white"
      style={{
        boxSizing: 'content-box',
        display: 'flex',
        zIndex: 102,
        height: '3.5rem',
        backgroundColor: '#171c43',
        fontSize: '1rem',
        width: '100%',
        boxShadow: '0 0 .8rem rgba(0, 0, 0, .3)',
      }}
    >
      <div className="flex items-center gap-4">
          <img
            src={require('@/assets/heimdal2.png')}
            alt="Heimdal logo"
            className="mr-[12] cursor-pointer"
            style={{ height: '1.8rem', width: 'auto', objectFit: 'contain', margin: '.75rem 1rem' }}
            onClick={handleLogoClick}
          />
  {/* GitHub link removed per user request */}
      </div>
  {/* Top navigation moved into hamburger menu next to avatar */}
  <div className="flex items-center gap-5 text-white">
        {/* Language dropdown removed */}
        {/*
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-1">
              {t(`common.${camelCase(language)}`)}
              <ChevronDown className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((x) => (
              <DropdownMenuItem key={x.key} onClick={handleItemClick(x.key)}>
                {x.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        */}
        {/* Help button removed */}
        <Button variant={'ghost'} onClick={onThemeClick}>
          {theme === 'light' ? <Sun /> : <Moon />}
        </Button>
        <BellButton></BellButton>

                  <RAGFlowAvatar
            name={nickname}
            avatar={avatar}
            className="size-8 cursor-pointer"
            onClick={navigateToOldProfile}
          ></RAGFlowAvatar>
        <div className="relative">
                  {/* Hamburger menu: contains nav items (Home, Datasets, Chats, Searches, Agents, Files) */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={'ghost'}>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {tagsData.map((tag) => (
              <DropdownMenuItem
                key={tag.path}
                onClick={() => {
                  navigate(tag.path);
                }}
              >
                {tag.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

          {/* Temporarily hidden */}
          {/* <Badge className="h-5 w-8 absolute font-normal p-0 justify-center -right-8 -top-2 text-bg-base bg-gradient-to-l from-[#42D7E7] to-[#478AF5]">
            Pro
          </Badge> */}
        </div>
      </div>
    </section>
  );
}
