'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <RadixTabs.Root value={activeId} onValueChange={onChange} className={className}>
      <RadixTabs.List className="inline-flex gap-1 p-0.5 bg-surface rounded-md">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.id}
            value={item.id}
            className={cn(
              'h-8 px-3 text-sm font-medium rounded-sm text-text-secondary transition-all duration-150',
              'hover:text-text-primary',
              'data-[state=active]:bg-bg-elevated data-[state=active]:text-text-primary',
              'data-[state=active]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.id} value={item.id}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}