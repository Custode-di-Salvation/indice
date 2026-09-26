import { formatEntityStatus, formatNodeStatus } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  type?: 'entity' | 'node';
}

export const StatusBadge = ({ status, type = 'entity' }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();
  
  const getBadgeClass = () => {
    switch (normalizedStatus) {
      // Entity statuses
      case 'attivo': return 'badge-attivo';
      case 'chiuso': return 'badge-chiuso';
      case 'dormiente': return 'badge-dormiente';
      case 'in_revisione': return 'badge-revisione';
      case 'incompleto': return 'badge-incompleto';
      
      // Node statuses
      case 'locale': return 'badge-locale';
      case 'intermittente': return 'badge-intermittente';
      case 'silente': return 'badge-silente';
      case 'ignoto': return 'badge-ignoto';
      case 'accesso_negato': return 'badge-negato';
      
      default: return 'badge-default';
    }
  };

  const label = type === 'node' 
    ? formatNodeStatus(status) 
    : formatEntityStatus(status);

  return (
    <span className={`status-badge ${getBadgeClass()}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
};
