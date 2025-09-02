import { PropsWithChildren } from 'react';

export function PageHeader({ children }: PropsWithChildren) {
  return (
  <header className="flex justify-between items-center border-b pr-9" style={{ background: '#171c42 !important' }}>
      <div className="flex items-center ">
        <div className="flex items-center border-r p-1.5">
          <Button variant="ghost" size="icon" onClick={back}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>
      {children}
    </header>
  );
}
