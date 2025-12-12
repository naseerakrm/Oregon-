import React, { useState, useEffect } from 'react';
import { Copy, Send, QrCode, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { walletService } from '../services/wallet';
import { Wallet as WalletType, Transaction, Currency, TransactionType } from '../types';
import { formatCurrency, formatRelativeTime, copyToClipboard, truncateText } from '../utils/cn';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const [walletData, transactionsData] = await Promise.all([
          walletService.getWallet(user?.id || ''),
          walletService.getTransactions(user?.id || '', 10),
        ]);
        setWallet(walletData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to load wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadWalletData();
    }
  }, [user]);

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      const success = await copyToClipboard(wallet.address);
      if (success) {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Reload data
    if (user) {
      const [walletData, transactionsData] = await Promise.all([
        walletService.getWallet(user.id),
        walletService.getTransactions(user.id, 10),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
    }
    setIsLoading(false);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.RECEIVE:
      case TransactionType.MINING:
        return <ArrowDownLeft size={16} className="text-green-600" />;
      case TransactionType.SEND:
      case TransactionType.TRANSFER:
        return <ArrowUpRight size={16} className="text-red-600" />;
      default:
        return <RefreshCw size={16} className="text-blue-600" />;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.RECEIVE:
      case TransactionType.MINING:
        return 'text-green-600';
      case TransactionType.SEND:
      case TransactionType.TRANSFER:
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.RECEIVE:
        return 'استقبال';
      case TransactionType.SEND:
        return 'إرسال';
      case TransactionType.MINING:
        return 'تعدين';
      case TransactionType.TRANSFER:
        return 'تحويل';
      case TransactionType.EXCHANGE:
        return 'تبادل';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-600">جاري تحميل المحفظة...</p>
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
            <h1 className="text-3xl font-bold text-dark-900">المحفظة</h1>
            <p className="text-dark-600 mt-1">إدارة أموالك الرقمية</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw size={18} className="mr-2" />
            تحديث
          </Button>
        </div>

        {/* Wallet overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance card */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-dark-900">الرصيد</h2>
              <Badge variant="success">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                نشط
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-dark-900 mb-2">
                {wallet ? formatCurrency(wallet.balance, Currency.ORE) : '0 ORE'}
              </div>
              <p className="text-dark-600">
                ≈ {wallet ? formatCurrency(wallet.balance * 2.45, Currency.USD) : '$0'} USD
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => setSendModalOpen(true)}
                leftIcon={<Send size={18} />}
              >
                إرسال
              </Button>
              <Button
                variant="outline"
                onClick={() => setReceiveModalOpen(true)}
                leftIcon={<QrCode size={18} />}
              >
                استقبال
              </Button>
            </div>
          </Card>

          {/* Address card */}
          <Card>
            <h3 className="text-lg font-semibold text-dark-900 mb-4">عنوان المحفظة</h3>
            <div className="bg-dark-50 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm text-dark-700 break-all">
                {wallet?.address || 'لا يوجد عنوان'}
              </p>
            </div>
            <Button
              variant="outline"
              fullWidth
              onClick={handleCopyAddress}
              leftIcon={<Copy size={18} />}
            >
              {copiedAddress ? 'تم النسخ!' : 'نسخ العنوان'}
            </Button>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">إجمالي المعاملات</p>
                <p className="text-2xl font-bold text-dark-900">{transactions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">إجمالي المكافآت</p>
                <p className="text-2xl font-bold text-dark-900">342.5 ORE</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowDownLeft className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">القيمة بالدولار</p>
                <p className="text-2xl font-bold text-dark-900">
                  {wallet ? formatCurrency(wallet.balance * 2.45, Currency.USD) : '$0'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <RefreshCw className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-900">المعاملات الأخيرة</h2>
            <Button variant="ghost" size="sm">عرض الكل</Button>
          </div>

          {transactions.length > 0 ? (
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-dark-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-dark-100 rounded-full mr-3">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="text-dark-900 font-medium">
                              {getTransactionLabel(transaction.type)}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-dark-600">
                                {truncateText(transaction.description, 30)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge 
                          variant={
                            transaction.status === 'confirmed' ? 'success' : 
                            transaction.status === 'pending' ? 'warning' : 'error'
                          }
                        >
                          {transaction.status === 'confirmed' ? 'مؤكد' :
                           transaction.status === 'pending' ? 'معلق' : 'فشل'}
                        </Badge>
                      </td>
                      <td className="py-4 text-dark-600">
                        {formatRelativeTime(transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-dark-400 mx-auto mb-4" />
              <p className="text-dark-600">لا توجد معاملات بعد</p>
              <p className="text-sm text-dark-500">ستظهر معاملاتك هنا عند البدء</p>
            </div>
          )}
        </Card>

        {/* Send Modal */}
        <Modal
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
          title="إرسال ORE"
          size="md"
        >
          <form className="space-y-4">
            <Input
              label="عنوان المحفظة المستلمة"
              placeholder="0x..."
              helperText="تأكد من صحة عنوان المحفظة"
            />
            <Input
              label="المبلغ"
              type="number"
              placeholder="0.00"
              helperText="الحد الأدنى: 0.01 ORE"
            />
            <div className="flex justify-between text-sm text-dark-600">
              <span>رسوم الشبكة:</span>
              <span>0.1 ORE</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-dark-900">
              <span>المجموع:</span>
              <span>0.00 ORE</span>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" fullWidth onClick={() => setSendModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" fullWidth>
                إرسال
              </Button>
            </div>
          </form>
        </Modal>

        {/* Receive Modal */}
        <Modal
          isOpen={receiveModalOpen}
          onClose={() => setReceiveModalOpen(false)}
          title="استقبال ORE"
          size="md"
        >
          <div className="text-center">
            <div className="w-48 h-48 bg-dark-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <QrCode size={120} className="text-dark-400" />
            </div>
            <div className="bg-dark-50 p-4 rounded-lg mb-6">
              <p className="font-mono text-sm break-all">
                {wallet?.address}
              </p>
            </div>
            <p className="text-sm text-dark-600 mb-6">
              شارك هذا العنوان أو الكود QR مع المرسل
            </p>
            <Button variant="primary" fullWidth onClick={handleCopyAddress}>
              {copiedAddress ? 'تم نسخ العنوان!' : 'نسخ العنوان'}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Wallet;