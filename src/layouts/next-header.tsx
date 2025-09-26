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
  Globe,
  Box,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'umi';
import { BellButton } from './bell-button';
import '@/theme/header.less';

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
  /* { path: Routes.Root, name: 'Home', icon: House }, */
      { path: Routes.Agents, name: 'Agents', icon: Cpu },
      { path: Routes.Datasets, name: t('Knowledge base'), icon: Library },
      { path: Routes.Chats, name: t('header.chat'), icon: MessageSquareText },
      /* { path: Routes.Searches, name: t('header.search'), icon: Search }, */
  // Force plural label in hamburger menu
      { path: Routes.Files, name: t('header.fileManager'), icon: File },
      { path: Routes.ForecastingPortal, name: 'Forecasting Portal', icon: Box },
  // External link
  { path: 'https://cloud.langfuse.com/', name: 'Observability', icon: Globe },
    ],
    [t],
  );

  // Navigation items will be rendered in the hamburger menu below

  const handleLogoClick = useCallback(() => {
    navigate(Routes.Root);
  }, [navigate]);

  const heimdalLogo = require('@/assets/heimdal2.png');
  const kalixLogo = require('@/assets/KalixLogo2.png');
  const isForecasting = pathname.startsWith(Routes.ForecastingPortal);

  // Inline hover color handling for hamburger menu icon
  const [menuHover, setMenuHover] = useState(false);
  // Inline hover color handling for theme toggle button
  const [themeHover, setThemeHover] = useState(false);

  return (
    <section className="heimdal-header">
      <div className="heimdal-left" >
        <img
          src={isForecasting ? kalixLogo : heimdalLogo}
          alt={isForecasting ? 'Kalix logo' : 'Heimdal logo'}
          className="heimdal-logo"
          onClick={handleLogoClick}
        />

    {/* height: 1.8rem;
    width: auto;
    object-fit: contain;
    margin: 0.75rem 1rem;
    margin-top: 1rem; */}

        {isForecasting ? (
          <span style={{ color: 'white', fontSize: 18, fontWeight: 600, height: '1.8rem', width: 'auto', objectFit: 'contain', margin: '0.75rem -1rem', marginTop: '1.2rem' }} >Forecaster</span>
        ) : null}
      </div>
  {/* Top navigation moved into hamburger menu next to avatar */}
  <div className="heimdal-actions">
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
        <Button
          variant={'header'}
          onClick={onThemeClick}
          onMouseEnter={() => setThemeHover(true)}
          onMouseLeave={() => setThemeHover(false)}
          style={{
            background: 'transparent',
            color: themeHover ? '#449ef4' : 'white',
          }}
        >
          {theme === 'light' ? (
            <Sun style={{ color: themeHover ? '#449ef4' : 'white' }} />
          ) : (
            <Moon style={{ color: themeHover ? '#449ef4' : 'white' }} />
          )}
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
            <Button
              variant={'header'}
              onMouseEnter={() => setMenuHover(true)}
              onMouseLeave={() => setMenuHover(false)}
              style={{
                background: 'transparent',
                color: menuHover ? '#449ef4' : 'white',
              }}
            >
              <Menu
                style={{ color: menuHover ? '#449ef4' : 'white' }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {tagsData.map((tag) => (
              <DropdownMenuItem
                key={tag.path}
                onClick={() => {
                  if (/^https?:\/\//i.test(tag.path)) {
                    window.open(tag.path, '_blank', 'noopener,noreferrer');
                  } else {
                    navigate(tag.path);
                  }
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
