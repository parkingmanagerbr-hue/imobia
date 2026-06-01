import { Badge } from './Badge';

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';

interface LeadBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<
  LeadStatus,
  { label: string; variant: 'primary' | 'info' | 'success' | 'danger' }
> = {
  NEW: { label: 'Novo', variant: 'primary' },
  CONTACTED: { label: 'Contatado', variant: 'info' },
  QUALIFIED: { label: 'Qualificado', variant: 'success' },
  LOST: { label: 'Perdido', variant: 'danger' },
};

export function LeadBadge({ status }: LeadBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
