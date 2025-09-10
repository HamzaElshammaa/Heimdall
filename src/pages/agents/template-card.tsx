import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IFlowTemplate } from '@/interfaces/database/flow';
import i18n from '@/locales/config';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface IProps {
  data: IFlowTemplate;
  isCreate?: boolean;
  showModal(record: IFlowTemplate): void;
}

export function TemplateCard({ data, showModal, isCreate = false }: IProps) {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    showModal(data);
  }, [data, showModal]);

  // Normalize language to the keys provided by templates (en/zh)
  const langKey = useMemo(() => {
    const lng = (i18n.language || 'en').toLowerCase();
    return lng.startsWith('zh') ? 'zh' : 'en';
  }, [i18n.language]) as 'en' | 'zh';

  const title = useMemo(() => {
    const t = (data?.title as any);
    if (t && typeof t === 'object') return t[langKey] ?? t.en ?? t.zh ?? '';
    if (typeof t === 'string') return t;
    return '';
  }, [data?.title, langKey]);

  const description = useMemo(() => {
    const d = (data?.description as any);
    if (d && typeof d === 'object') return d[langKey] ?? d.en ?? d.zh ?? '';
    if (typeof d === 'string') return d;
    return '';
  }, [data?.description, langKey]);

  // Inline hover styling to mimic portal selector behavior
  const [hovered, setHovered] = useState(false);
  const baseStyle: React.CSSProperties = {
    backgroundColor: 'var(--portal-selector-color, #ffffff)',
    borderColor: 'var(--portal-selector-border-color, #90b0c0)',
    borderWidth: '0.01rem',
    borderStyle: 'solid',
    borderRadius: '.6rem',
    position: 'relative',
    cursor: 'pointer',
  };
  const hoverStyle: React.CSSProperties = hovered
    ? {

        borderColor: '#2d71b3',
        borderTopWidth: '.4rem',
      }
    : { borderTopWidth: '0.1rem' };

  return (
    <Card
      className="group relative min-h-40"
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <CardContent className="p-4 ">
        {isCreate && (
          <div
            className="flex flex-col justify-center items-center gap-4 mb-4 absolute top-0 right-0 left-0 bottom-0 cursor-pointer "
            onClick={handleClick}
          >
            <Plus size={50} fontWeight={700} />
            <div>{t('flow.createAgent')}</div>
          </div>
        )}
        {!isCreate && (
          <>
            <div className="flex justify-start items-center gap-4 mb-4">
              <RAGFlowAvatar
                className="w-7 h-7"
                avatar={
                  data.avatar ? data.avatar : 'https://github.com/shadcn.png'
                }
                name={title || 'Agent'}
              ></RAGFlowAvatar>
              <div
                className="text-[18px] font-bold"
                style={{ color: hovered ? '#449ef4' : undefined }}
              >
                {title}
              </div>
            </div>
            <p className="break-words">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
