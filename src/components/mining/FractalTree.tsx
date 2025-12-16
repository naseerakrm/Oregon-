import React from 'react';
import { useTranslation } from 'react-i18next';
import { DnaProfile } from '../../types';

interface FractalTreeProps {
  profile: DnaProfile | null;
}

const FractalTree: React.FC<FractalTreeProps> = ({ profile }) => {
  const { t } = useTranslation();

  if (!profile) return null;

  return (
    <div className="flex flex-col items-center p-4">
        <h3 className="text-lg font-semibold mb-4">{t('dna.lineage')}</h3>
        <div className="flex flex-wrap justify-center gap-4">
            {profile.lineage.map((l, i) => (
                <div key={i} className="flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 border-2 border-primary-200">
                        {l.generation}
                     </div>
                     <div className="h-6 w-0.5 bg-gray-300 my-1"></div>
                     <div className="text-xs text-gray-500 font-medium">
                        {(l.contribution * 100).toFixed(0)}%
                     </div>
                     <div className="text-[10px] text-gray-400 mt-1 max-w-[60px] truncate">
                        {l.ancestorId}
                     </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default FractalTree;
