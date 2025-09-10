import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IFlowTemplate } from '@/interfaces/database/flow';
import i18n from '@/locales/config';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
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

  return (
    <Card
      className="border-colors-outline-neutral-standard group relative min-h-40 transition-all hover:border-[#2d71b3] hover:shadow-[0_0_0_2px_rgba(45,113,179,0.15)]"
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
              <div className="text-[18px] font-bold ">
                {title}
              </div>
            </div>
            <p className="break-words">{description}</p>
            <Button
              variant="default"
              className="w-1/3 absolute bottom-4 inset-x-4 justify-center text-center m-auto opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClick}
            >
              {t('flow.useTemplate')}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
