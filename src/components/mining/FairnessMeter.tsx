import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface FairnessMeterProps {
  score: number; // 0-100
}

const FairnessMeter: React.FC<FairnessMeterProps> = ({ score }) => {
  const { t } = useTranslation();
  
  const data = [
    { name: 'Score', value: score },
    { name: 'Rest', value: 100 - score },
  ];
  const COLORS = ['#10B981', '#E5E7EB']; // Green-500, Gray-200

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">{t('mining.fairnessScore')}</h3>
      <div className="h-32 w-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center items-center mb-4">
            <span className="text-3xl font-bold text-gray-800">{score}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">{t('mining.fairnessDesc')}</p>
    </div>
  );
};

export default FairnessMeter;
