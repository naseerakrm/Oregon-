import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Filter,
  Download,
  Search,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { walletService } from '../services/wallet';
import { Transaction, TransactionType, TransactionStatus } from '../types';
import { formatCurrency, formatDate, formatRelativeTime, truncateText } from '../utils/cn';

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await walletService.getTransactions(user?.id || '');
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadTransactions();
    }
  }, [user]);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.RECEIVE:
      case TransactionType.MINING:
        return <ArrowDownLeft size={20} className="text-green-600" />;
      case TransactionType.SEND:
      case TransactionType.TRANSFER:
        return <ArrowUpRight size={20} className="text-red-600" />;
      default:
        return <RefreshCw size={20} className="text-blue-600" />;
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

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return <CheckCircle size={16} className="text-green-600" />;
      case TransactionStatus.PENDING:
        return <Clock size={16} className="text-yellow-600" />;
      case TransactionStatus.FAILED:
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return <Badge variant="success">مؤكد</Badge>;
      case TransactionStatus.PENDING:
        return <Badge variant="warning">معلق</Badge>;
      case TransactionStatus.FAILED:
        return <Badge variant="error">فشل</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="default">ملغي</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toString().includes(searchTerm);
    
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF
    const data = filteredTransactions.map(tx => ({
      'المعرف': tx.id,
      'النوع': getTransactionLabel(tx.type),
      'المبلغ': tx.amount,
      'العملة': tx.currency,
      'الحالة': tx.status,
      'التاريخ': formatDate(tx.createdAt),
      'الوصف': tx.description || '',
    }));
    
    console.log('Export data:', data);
    alert('سيتم تصدير المعاملات قريباً...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-600">جاري تحميل المعاملات...</p>
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
            <h1 className="text-3xl font-bold text-dark-900">المعاملات</h1>
            <p className="text-dark-600 mt-1">جميع معاملاتك المالية</p>
          </div>
          <Button onClick={handleExport} variant="outline" leftIcon={<Download size={18} />}>
            تصدير
          </Button>
        </div>

        {/* Filters and search */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع المعاملات</option>
                <option value="send">إرسال</option>
                <option value="receive">استقبال</option>
                <option value="mining">تعدين</option>
                <option value="transfer">تحويل</option>
                <option value="exchange">تبادل</option>
              </select>
              <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
                تصفية
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">إجمالي المعاملات</p>
                <p className="text-2xl font-bold text-dark-900">{transactions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">المعاملات المؤكدة</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(tx => tx.status === TransactionStatus.CONFIRMED).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">المعاملات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {transactions.filter(tx => tx.status === TransactionStatus.PENDING).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(
                    transactions
                      .filter(tx => tx.status === TransactionStatus.CONFIRMED)
                      .reduce((sum, tx) => sum + tx.amount, 0),
                    'ORE'
                  )}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions list */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-dark-900">قائمة المعاملات</h2>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-200">
                    <th className="text-right py-3 text-dark-600 font-medium">المعاملة</th>
                    <th className="text-right py-3 text-dark-600 font-medium">المبلغ</th>
                    <th className="text-right py-3 text-dark-600 font-medium">الحالة</th>
                    <th className="text-right py-3 text-dark-600 font-medium">التاريخ</th>
                    <th className="text-right py-3 text-dark-600 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200">
                  {filteredTransactions.map((transaction) => (
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
                            <p className="text-sm text-dark-600">
                              {truncateText(transaction.id, 20)}
                            </p>
                            {transaction.description && (
                              <p className="text-xs text-dark-500">
                                {truncateText(transaction.description, 40)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                          </span>
                          <p className="text-xs text-dark-500">
                            الرسوم: {transaction.fee} {transaction.currency}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="mr-2">
                            {getStatusBadge(transaction.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-dark-900">{formatDate(transaction.createdAt)}</p>
                          <p className="text-sm text-dark-600">
                            {formatRelativeTime(transaction.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(transaction)}
                          leftIcon={<Eye size={16} />}
                        >
                          تفاصيل
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-dark-400 mx-auto mb-4" />
              <p className="text-dark-600 mb-2">لا توجد معاملات</p>
              <p className="text-sm text-dark-500">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'لا توجد معاملات تطابق البحث'
                  : 'لم تقم بأي معاملات بعد'
                }
              </p>
            </div>
          )}
        </Card>

        {/* Transaction detail modal */}
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="تفاصيل المعاملة"
          size="lg"
        >
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Header info */}
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-dark-100 rounded-full mr-4">
                    {getTransactionIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">
                      {getTransactionLabel(selectedTransaction.type)}
                    </h3>
                    <p className="text-sm text-dark-600">
                      {formatDate(selectedTransaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getTransactionColor(selectedTransaction.type)}`}>
                    {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount} {selectedTransaction.currency}
                  </p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">معلومات أساسية</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-600">معرف المعاملة:</span>
                      <span className="font-mono text-sm">{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">النوع:</span>
                      <span>{getTransactionLabel(selectedTransaction.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">الحالة:</span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">العملة:</span>
                      <span>{selectedTransaction.currency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">تفاصيل مالية</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-600">المبلغ:</span>
                      <span className="font-medium">{selectedTransaction.amount} {selectedTransaction.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">الرسوم:</span>
                      <span>{selectedTransaction.fee} {selectedTransaction.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">الوقت:</span>
                      <span>{formatDate(selectedTransaction.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">آخر تحديث:</span>
                      <span>{formatDate(selectedTransaction.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {(selectedTransaction.senderAddress || selectedTransaction.recipientAddress) && (
                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">العناوين</h4>
                  <div className="space-y-3">
                    {selectedTransaction.senderAddress && (
                      <div>
                        <span className="text-dark-600 block mb-1">المرسل:</span>
                        <div className="bg-dark-50 p-3 rounded-lg">
                          <p className="font-mono text-sm break-all">
                            {selectedTransaction.senderAddress}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedTransaction.recipientAddress && (
                      <div>
                        <span className="text-dark-600 block mb-1">المستلم:</span>
                        <div className="bg-dark-50 p-3 rounded-lg">
                          <p className="font-mono text-sm break-all">
                            {selectedTransaction.recipientAddress}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedTransaction.description && (
                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">الوصف</h4>
                  <div className="bg-dark-50 p-4 rounded-lg">
                    <p className="text-dark-700">{selectedTransaction.description}</p>
                  </div>
                </div>
              )}

              {/* Transaction hash */}
              {selectedTransaction.transactionHash && (
                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">تجزئة المعاملة</h4>
                  <div className="bg-dark-50 p-3 rounded-lg">
                    <p className="font-mono text-sm break-all">
                      {selectedTransaction.transactionHash}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Transactions;