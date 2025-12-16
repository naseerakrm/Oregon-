import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { DnaProfile } from '../../types';

interface DnaFingerprintProps {
  profile: DnaProfile | null;
}

const DnaFingerprint: React.FC<DnaFingerprintProps> = ({ profile }) => {
  const { t } = useTranslation();

  if (!profile) return <div>Loading...</div>;

  const data = [
    { subject: t('dna.resilience'), A: profile.traits.resilience, fullMark: 100 },
    { subject: t('dna.efficiency'), A: profile.traits.efficiency, fullMark: 100 },
    { subject: t('dna.luck'), A: profile.traits.luck, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <h3 className="text-lg font-semibold mb-2 text-center">{t('dna.fingerprint')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name={t('dna.traits')}
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DnaFingerprint;
