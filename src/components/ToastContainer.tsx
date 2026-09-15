import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-purple-500/40 bg-[#131829]/95 text-purple-200';
        let Icon = Info;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-[#0E1B1B]/95 text-emerald-200';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50 bg-[#1F1117]/95 text-rose-200';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-chakra transition-all duration-300 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
