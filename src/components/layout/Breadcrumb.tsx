import { Link } from 'react-router-dom';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

export const Breadcrumb = () => {
  const segments = useBreadcrumb();

  return (
    <nav className="breadcrumb">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        
        return (
          <span key={index} className="breadcrumb-segment">
            {segment.url ? (
              <Link to={segment.url} className="breadcrumb-link">
                {segment.label}
              </Link>
            ) : (
              <span className="breadcrumb-current">{segment.label}</span>
            )}
            
            {!isLast && <span className="breadcrumb-separator">/</span>}
          </span>
        );
      })}
    </nav>
  );
};
