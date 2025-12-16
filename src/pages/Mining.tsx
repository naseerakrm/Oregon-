import React, { useState } from 'react';
import { 
  Play, 
  StopCircle, 
  TrendingUp, 
  Zap, 
  Clock, 
  ChevronRight,
  Cpu,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useProtocol } from '../contexts/ProtocolContext';
import { MiningMode, DeviceType, MiningPool } from '../types';
import { formatNumber, formatRelativeTime } from '../utils/cn';
import DnaFingerprint from '../components/mining/DnaFingerprint';
import FractalTree from '../components/mining/FractalTree';
import FairnessMeter from '../components/mining/FairnessMeter';

const Mining: React.FC = () => {
  const { t } = useTranslation();
  const { 
    miningPools, 
    activeSession, 
    dnaProfile, 
    startMining, 
    stopMining, 
    isLoading 
  } = useProtocol();

  const [selectedPool, setSelectedPool] = useState<string>('');
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [miningMode, setMiningMode] = useState<MiningMode>(MiningMode.POOL);
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.DESKTOP);

  const handleStartMining = async () => {
    try {
      await startMining(selectedPool, miningMode, deviceType);
      setSessionModalOpen(false);
      setSelectedPool('');
    } catch (error) {
      console.error('Failed to start mining:', error);
    }
  };

  const handleStopMining = async () => {
    try {
      await stopMining();
    } catch (error) {
      console.error('Failed to stop mining:', error);
    }
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.MOBILE: return <Smartphone size={20} />;
      case DeviceType.TABLET: return <Tablet size={20} />;
      case DeviceType.DESKTOP: return <Monitor size={20} />;
      case DeviceType.RIG: return <Cpu size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  if (isLoading && !dnaProfile) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-600">{t('common.messages.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">{t('mining.title')}</h1>
            <p className="text-dark-600 mt-1">{t('mining.subtitle')}</p>
          </div>
          
          {!activeSession && (
            <Button
              variant="primary"
              onClick={() => setSessionModalOpen(true)}
              leftIcon={<Play size={18} />}
            >
              {t('mining.start')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* DNA Profile Card */}
            <Card className="lg:col-span-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <DnaFingerprint profile={dnaProfile} />
                    </div>
                    <div className="flex-1 border-t md:border-t-0 md:border-s border-gray-100 pt-6 md:pt-0 md:ps-6">
                         <FractalTree profile={dnaProfile} />
                    </div>
                </div>
            </Card>

            {/* Fairness Meter Card */}
            <Card className="flex items-center justify-center">
                <FairnessMeter score={85} /> 
            </Card>
        </div>

        {/* Active mining session */}
        {activeSession ? (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full me-4">
                  <Zap className="h-8 w-8 text-green-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-dark-900">
                    {t('mining.active')}
                  </h2>
                  <p className="text-dark-600">
                    {formatRelativeTime(new Date(activeSession.startTime))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-end">
                  <p className="text-sm text-dark-600">{t('mining.rewards')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeSession.reward.toFixed(2)} ORE
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={handleStopMining}
                  leftIcon={<StopCircle size={18} />}
                >
                  {t('mining.stop')}
                </Button>
              </div>
            </div>

            {/* Mining stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">{t('mining.hashRate')}</span>
                  <TrendingUp className="text-blue-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  125 MH/s
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">Hashes</span>
                  <Clock className="text-purple-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  {formatNumber(activeSession.totalHashes)}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">{t('common.messages.loading')}</span> 
                  {/* Using loading text as placeholder for time */}
                  <Clock className="text-orange-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  {Math.floor((Date.now() - new Date(activeSession.startTime).getTime()) / (1000 * 60 * 60))}h
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">{t('mining.efficiency')}</span>
                  <TrendingUp className="text-green-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  95.2%
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Play className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-dark-900 mb-2">
                {t('mining.inactive')}
              </h2>
              <p className="text-dark-600 mb-6">
                {t('mining.subtitle')}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setSessionModalOpen(true)}
                leftIcon={<Play size={20} />}
              >
                {t('mining.start')}
              </Button>
            </div>
          </Card>
        )}

        {/* Mining pools */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-dark-900 mb-6">{t('mining.poolStats')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {miningPools.map((pool) => (
              <Card key={pool.id} hover>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-900">{pool.name}</h3>
                  <Badge variant={pool.isActive ? 'success' : 'default'}>
                    {pool.isActive ? t('mining.active') : t('mining.inactive')}
                  </Badge>
                </div>
                
                <p className="text-dark-600 mb-4">{pool.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-dark-600">{t('mining.hashRate')}</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {formatNumber(pool.hashRate)} H/s
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">{t('mining.miners')}</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {formatNumber(pool.miners)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">{t('mining.rewards')}</p>
                    <p className="text-lg font-semibold text-green-600">
                      {(pool.rewardRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">{t('mining.fee')}</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {(pool.fee * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {!activeSession && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                          setSelectedPool(pool.id);
                          setSessionModalOpen(true);
                      }}
                      leftIcon={<Play size={16} />}
                    >
                      {t('mining.selectPool')}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Mining Modal */}
        <Modal
          isOpen={sessionModalOpen}
          onClose={() => setSessionModalOpen(false)}
          title={t('mining.start')}
          size="lg"
        >
          <div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('mining.device')}</label>
                <div className="flex gap-4">
                    {[DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP, DeviceType.RIG].map(type => (
                        <button
                            key={type}
                            onClick={() => setDeviceType(type)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border flex-1 transition-all ${
                                deviceType === type 
                                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {getDeviceIcon(type)}
                            <span className="text-xs mt-2">{t(`mining.deviceCapabilities.${type}`)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('mining.mode')}</label>
                <div className="flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onClick={() => setMiningMode(MiningMode.SOLO)}
                        className={`px-4 py-2 text-sm font-medium border rounded-s-lg flex-1 ${
                            miningMode === MiningMode.SOLO
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {t('mining.solo')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMiningMode(MiningMode.POOL)}
                        className={`px-4 py-2 text-sm font-medium border rounded-e-lg flex-1 ${
                            miningMode === MiningMode.POOL
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {t('mining.pool')}
                    </button>
                </div>
            </div>

            {miningMode === MiningMode.POOL && (
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                <label className="block text-sm font-medium text-gray-700">{t('mining.selectPool')}</label>
                {miningPools.map((pool) => (
                    <div
                    key={pool.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPool === pool.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-dark-200 hover:border-dark-300'
                    }`}
                    onClick={() => setSelectedPool(pool.id)}
                    >
                    <div className="flex items-center justify-between">
                        <div>
                        <h4 className="font-semibold text-dark-900">{pool.name}</h4>
                        <p className="text-sm text-dark-600">{pool.description}</p>
                        </div>
                        <ChevronRight 
                        size={20} 
                        className={`transition-transform ${
                            selectedPool === pool.id ? 'rotate-90 text-primary-600' : 'text-dark-400'
                        }`} 
                        />
                    </div>
                    </div>
                ))}
                </div>
            )}
            
            <div className="flex gap-3 mt-8">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => setSessionModalOpen(false)}
              >
                {t('common.buttons.cancel')}
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleStartMining}
                disabled={miningMode === MiningMode.POOL && !selectedPool}
              >
                {t('mining.start')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Mining;
