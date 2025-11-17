import React from 'react';

type Props = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const Card: React.FC<Props> = ({ title, className = '', children }) => {
  return (
    <div className={`bg-slate-900/60 border border-slate-700 rounded-lg p-4 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-semibold text-slate-100 mb-3">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
