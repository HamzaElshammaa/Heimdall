import { ReactComponent as KnowledgeBaseIcon } from '@/assets/svg/knowledge-base.svg';
import { ReactComponent as GraphIcon } from '@/assets/svg/graph.svg';
import { ReactComponent as FileIcon } from '@/assets/svg/file-management.svg';
import { MessageOutlined, SearchOutlined } from '@ant-design/icons';
import { Box } from 'lucide-react';

export type NavItem = {
  path: string;
  name: string;
  icon: React.ElementType;
};

// t is the i18n translate function from useTranslate('header')
export const getNavItems = (t: (k: string) => string): NavItem[] => [
  { path: '/knowledge', name: t('knowledgeBase'), icon: KnowledgeBaseIcon },
  { path: '/chat', name: t('chat'), icon: MessageOutlined },
  { path: '/search', name: t('search'), icon: SearchOutlined },
  { path: '/flow', name: t('flow'), icon: GraphIcon },
  { path: '/file', name: t('fileManager'), icon: FileIcon },
  // External link item
  { path: 'http://localhost:9090', name: 'cube flow', icon: Box },
];
