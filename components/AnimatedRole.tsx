'use client'
import { useEffect, useState } from 'react'

interface AnimatedRoleProps {
  roles: string[];
  prefix?: string;
}

const AnimatedRole = ({ roles, prefix = '' }: AnimatedRoleProps) => {
  const [currentRole, setCurrentRole] = useState(0);
  const [fade, setFade] = useState(true);
  const roleCount = roles.length;

  useEffect(() => {
    if (roleCount <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentRole((prev) => (prev + 1) % roleCount);
        setFade(true);
      }, 250);
    }, 3500);

    return () => clearInterval(interval);
  }, [roleCount]);

  return (
    <div className="inline-flex items-center gap-2.5 flex-wrap min-h-[2.75rem] py-1">
      {prefix && (
        <span className="text-slate-700 font-semibold text-xl sm:text-2xl md:text-3xl tracking-tight">
          {prefix}
        </span>
      )}
      <span
        className={`inline-flex items-center px-3.5 py-1 rounded-xl bg-rose-50 border border-rose-200/80 shadow-2xs text-rose-600 font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight transition-all duration-300 transform ${
          fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1.5 scale-95'
        }`}
      >
        {roles[currentRole] || ''}
      </span>
    </div>
  );
};

export default AnimatedRole;