import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Send,
  Settings,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/cn';
import { walletService } from '../services/wallet';
import { AnalyticsData, Wallet as WalletType, Currency } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [walletData, analyticsData] = await Promise.all([
          walletService.getWallet(user?.id || ''),
          walletService.getAnalyticsData(user?.id || ''),
        ]);
        setWallet(walletData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : `${isRTL ? 'translate-x-full' : '-translate-x-full'}`}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-200">
          <h1 className="text-xl font-bold text-primary-600">{t('app.title')}</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-dark-600 hover:text-dark-900"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-primary-600 bg-primary-50 rounded-lg"
            >
              <Activity size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
              {t('navigation.dashboard')}
            </Link>
            <Link
              to="/wallet"
              className="flex items-center px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Wallet size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
              {t('navigation.wallet')}
            </Link>
            <Link
              to="/mining"
              className="flex items-center px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <TrendingUp size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
              {t('navigation.mining')}
            </Link>
            <Link
              to="/transactions"
              className="flex items-center px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Send size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
              {t('navigation.transactions')}
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-200">
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <User size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
                {t('navigation.profile')}
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-dark-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Settings size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
                {t('navigation.settings')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} className={`${isRTL ? 'ml-3' : 'mr-3'}`} />
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={`${isRTL ? 'lg:ml-64' : 'lg:mr-64'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-dark-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-dark-600 hover:text-dark-900"
              >
                <Menu size={24} />
              </button>
              <h2 className={`${isRTL ? 'mr-4' : 'ml-4'} text-xl font-semibold text-dark-900`}>
                {t('dashboard.welcome')} {user?.firstName}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Badge variant="success">
                <div className={`w-2 h-2 bg-green-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'} animate-pulse`}></div>
                متصل
              </Badge>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600">رصيد المحفظة</p>
                  <p className="text-2xl font-bold text-dark-900">
                    {wallet ? formatCurrency(wallet.balance, Currency.ORE) : '0'}
                  </p>
                  <p className={`text-sm ${getChangeColor(analytics?.performance24h || 0)}`}>
                    {formatPercentage(analytics?.performance24h || 0)} اليوم
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Wallet className="h-8 w-8 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600">المعاملات</p>
                  <p className="text-2xl font-bold text-dark-900">
                    {analytics?.totalTransactions || 0}
                  </p>
                  <p className="text-sm text-dark-500">إجمالي المعاملات</p>
                </div>
                <div className="p-3 bg-ore-100 rounded-full">
                  <Send className="h-8 w-8 text-ore-600" />
                </div>
              </div>
            </Card>

            <Card className="hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600">مكافآت التعدين</p>
                  <p className="text-2xl font-bold text-dark-900">
                    {analytics ? formatCurrency(analytics.miningRewards, Currency.ORE) : '0'}
                  </p>
                  <p className="text-sm text-dark-500">إجمالي المكافآت</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600">القيمة الإجمالية</p>
                  <p className="text-2xl font-bold text-dark-900">
                    {analytics ? formatCurrency(analytics.portfolioValue, Currency.USD) : '$0'}
                  </p>
                  <p className={`text-sm ${getChangeColor(analytics?.performance7d || 0)}`}>
                    {formatPercentage(analytics?.performance7d || 0)} هذا الأسبوع
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-semibold text-dark-900 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/send">
                  <Button variant="primary" fullWidth className="flex items-center justify-center">
                    <Send size={18} className="mr-2" />
                    إرسال
                  </Button>
                </Link>
                <Link to="/receive">
                  <Button variant="outline" fullWidth className="flex items-center justify-center">
                    <TrendingDown size={18} className="mr-2" />
                    استقبال
                  </Button>
                </Link>
                <Link to="/mining">
                  <Button variant="secondary" fullWidth className="flex items-center justify-center">
                    <TrendingUp size={18} className="mr-2" />
                    بدء التعدين
                  </Button>
                </Link>
                <Link to="/exchange">
                  <Button variant="ghost" fullWidth className="flex items-center justify-center">
                    <DollarSign size={18} className="mr-2" />
                    تبادل
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-dark-900 mb-4">حالة الشبكة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">حالة الشبكة</span>
                  <Badge variant="success">متصل</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">الكتلة الحالية</span>
                  <span className="font-mono text-sm">#1,245,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">معدل الهاش</span>
                  <span className="font-mono text-sm">1.2 EH/s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-600">الوقت حتى الكتلة التالية</span>
                  <span className="font-mono text-sm">4 دقائق</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent transactions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-900">المعاملات الأخيرة</h3>
              <Link to="/transactions">
                <Button variant="ghost" size="sm">عرض الكل</Button>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-200">
                    <th className="text-right py-3 text-dark-600 font-medium">النوع</th>
                    <th className="text-right py-3 text-dark-600 font-medium">المبلغ</th>
                    <th className="text-right py-3 text-dark-600 font-medium">الحالة</th>
                    <th className="text-right py-3 text-dark-600 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200">
                  <tr className="hover:bg-dark-50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <TrendingDown size={16} className="text-green-600" />
                        </div>
                        <span className="text-dark-900">استقبال</span>
                      </div>
                    </td>
                    <td className="py-4 text-dark-900 font-medium">+25.5 ORE</td>
                    <td className="py-4">
                      <Badge variant="success">مؤكد</Badge>
                    </td>
                    <td className="py-4 text-dark-600">اليوم</td>
                  </tr>
                  <tr className="hover:bg-dark-50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <TrendingUp size={16} className="text-blue-600" />
                        </div>
                        <span className="text-dark-900">تعدين</span>
                      </div>
                    </td>
                    <td className="py-4 text-dark-900 font-medium">+15.75 ORE</td>
                    <td className="py-4">
                      <Badge variant="success">مؤكد</Badge>
                    </td>
                    <td className="py-4 text-dark-600">أمس</td>
                  </tr>
                  <tr className="hover:bg-dark-50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-full mr-3">
                          <Send size={16} className="text-red-600" />
                        </div>
                        <span className="text-dark-900">إرسال</span>
                      </div>
                    </td>
                    <td className="py-4 text-dark-900 font-medium">-15.25 ORE</td>
                    <td className="py-4">
                      <Badge variant="success">مؤكد</Badge>
                    </td>
                    <td className="py-4 text-dark-600">منذ 2 أيام</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;