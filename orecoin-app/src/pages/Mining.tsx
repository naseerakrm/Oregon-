import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  StopCircle, 
  TrendingUp, 
  Zap, 
  Clock, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { walletService } from '../services/wallet';
import { MiningPool, MiningSession, MiningStatus } from '../types';
import { formatNumber, formatRelativeTime, formatCurrency } from '../utils/cn';

const Mining: React.FC = () => {
  const { user } = useAuth();
  const [miningPools, setMiningPools] = useState<MiningPool[]>([]);
  const [activeSession, setActiveSession] = useState<MiningSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  useEffect(() => {
    const loadMiningData = async () => {
      try {
        const [poolsData, sessionsData] = await Promise.all([
          walletService.getMiningPools(),
          walletService.getMiningSessions(user?.id || ''),
        ]);
        
        setMiningPools(poolsData);
        
        // Find active session
        const active = sessionsData.find(session => 
          session.status === MiningStatus.ACTIVE
        );
        setActiveSession(active || null);
      } catch (error) {
        console.error('Failed to load mining data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadMiningData();
    }
  }, [user]);

  const handleStartMining = async (poolId: string) => {
    try {
      const newSession = await walletService.startMining(user?.id || '', poolId);
      setActiveSession(newSession);
      setSelectedPool('');
      setSessionModalOpen(false);
    } catch (error) {
      console.error('Failed to start mining:', error);
    }
  };

  const handleStopMining = async () => {
    if (!activeSession) return;
    
    try {
      await walletService.stopMining(activeSession.id);
      setActiveSession(null);
    } catch (error) {
      console.error('Failed to stop mining:', error);
    }
  };

  const getPoolPerformance = (pool: MiningPool) => {
    // Simulate performance calculation
    return Math.floor(Math.random() * 10) + 90; // 90-99%
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-600">جاري تحميل بيانات التعدين...</p>
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
            <h1 className="text-3xl font-bold text-dark-900">التعدين</h1>
            <p className="text-dark-600 mt-1">ابدأ في تعدين عملة ORE</p>
          </div>
          
          {!activeSession && (
            <Button
              variant="primary"
              onClick={() => setSessionModalOpen(true)}
              leftIcon={<Play size={18} />}
            >
              بدء التعدين
            </Button>
          )}
        </div>

        {/* Active mining session */}
        {activeSession ? (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Zap className="h-8 w-8 text-green-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-dark-900">
                    جاري التعدين...
                  </h2>
                  <p className="text-dark-600">
                    بدأت عملية التعدين في {formatRelativeTime(activeSession.startTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-dark-600">المكافآت المكتسبة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeSession.reward.toFixed(2)} ORE
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={handleStopMining}
                  leftIcon={<StopCircle size={18} />}
                >
                  إيقاف
                </Button>
              </div>
            </div>

            {/* Mining stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">معدل الهاش</span>
                  <TrendingUp className="text-blue-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  125 MH/s
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">الهاش كلياً</span>
                  <Clock className="text-purple-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  {formatNumber(activeSession.totalHashes)}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">وقت التشغيل</span>
                  <Clock className="text-orange-600" size={16} />
                </div>
                <p className="text-lg font-semibold text-dark-900 mt-1">
                  {Math.floor((Date.now() - activeSession.startTime.getTime()) / (1000 * 60 * 60))} ساعة
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600 text-sm">معدل الربح</span>
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
                لم تبدأ التعدين بعد
              </h2>
              <p className="text-dark-600 mb-6">
                ابدأ في تعدين عملة ORE واحصل على مكافآت يومية
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setSessionModalOpen(true)}
                leftIcon={<Play size={20} />}
              >
                بدء التعدين الآن
              </Button>
            </div>
          </Card>
        )}

        {/* Mining pools */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-dark-900 mb-6">مجموعات التعدين</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {miningPools.map((pool) => (
              <Card key={pool.id} hover>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-900">{pool.name}</h3>
                  <Badge variant={pool.isActive ? 'success' : 'default'}>
                    {pool.isActive ? 'متاح' : 'غير متاح'}
                  </Badge>
                </div>
                
                <p className="text-dark-600 mb-4">{pool.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-dark-600">معدل الهاش</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {formatNumber(pool.hashRate)} H/s
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">عدد المعدنين</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {formatNumber(pool.miners)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">معدل المكافأة</p>
                    <p className="text-lg font-semibold text-green-600">
                      {(pool.rewardRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">الرسوم</p>
                    <p className="text-lg font-semibold text-dark-900">
                      {(pool.fee * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-dark-600">الأداء: {getPoolPerformance(pool)}%</span>
                  </div>
                  {!activeSession && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedPool(pool.id)}
                      leftIcon={<Play size={16} />}
                    >
                      اختيار
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Mining guide */}
        <Card>
          <h2 className="text-xl font-semibold text-dark-900 mb-6">دليل التعدين</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-dark-900 mb-2">اختر مجموعة التعدين</h3>
              <p className="text-dark-600 text-sm">
                اختر مجموعة تعدين تتناسب مع احتياجاتك وأهدافك
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-dark-900 mb-2">ابدأ التعدين</h3>
              <p className="text-dark-600 text-sm">
                اضغط على زر البدء واترك النظام يعمل تلقائياً
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-dark-900 mb-2">احصل على المكافآت</h3>
              <p className="text-dark-600 text-sm">
                احصل على عملة ORE كمكافآت على أداءك في التعدين
              </p>
            </div>
          </div>
        </Card>

        {/* Start Mining Modal */}
        <Modal
          isOpen={sessionModalOpen}
          onClose={() => setSessionModalOpen(false)}
          title="بدء التعدين"
          size="lg"
        >
          <div>
            <p className="text-dark-600 mb-6">
              اختر مجموعة التعدين التي تريد الانضمام إليها
            </p>
            
            <div className="space-y-4 mb-6">
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
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => setSessionModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleStartMining(selectedPool)}
                disabled={!selectedPool}
              >
                بدء التعدين
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Mining;