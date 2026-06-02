import { cn } from '@/lib/utils';
import {
  UploadCloud,
  FolderOpen,
  Clipboard,
  X,
  ScanSearch,
  ArrowLeft,
  Download,
  Copy,
  Check,
  Link2,
  Info,
  AlertTriangle,
  OctagonX,
  Layers,
  Layers2,
  Menu,
  ExternalLink,
  Github,
  SlidersHorizontal,
} from 'lucide-react';

const iconMap = {
  'upload-cloud':       UploadCloud,
  'folder-open':        FolderOpen,
  'clipboard':          Clipboard,
  'x':                  X,
  'scan-search':        ScanSearch,
  'arrow-left':         ArrowLeft,
  'download':           Download,
  'copy':               Copy,
  'check':              Check,
  'link-2':             Link2,
  'info':               Info,
  'alert-triangle':     AlertTriangle,
  'octagon-x':          OctagonX,
  'layers':             Layers,
  'layers-2':           Layers2,
  'menu':               Menu,
  'external-link':      ExternalLink,
  'github':             Github,
  'sliders-horizontal': SlidersHorizontal,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const IconComponent = iconMap[name];
  return (
    <IconComponent
      width={size}
      height={size}
      aria-hidden="true"
      className={cn('shrink-0', className)}
    />
  );
}