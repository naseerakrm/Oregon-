import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import { Card, Button, Input } from '../components/ui';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { validateEmail } from '../utils/cn';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = t('auth.login.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      errors.email = t('auth.login.errors.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('auth.login.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('auth.login.errors.passwordMinLength');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-ore-50 flex flex-col items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Language switcher */}
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">{t('app.title')}</h1>
          <p className="text-dark-600">{t('app.subtitle')}</p>
        </div>

        <Card className="animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-dark-900 mb-2">{t('auth.login.title')}</h2>
            <p className="text-dark-600">{t('auth.login.subtitle')}</p>
          </div>

          {error && (
            <div className={`mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className={`text-red-600 ${isRTL ? 'mr-2' : 'ml-2'}`} size={20} />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.login.emailLabel')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              leftIcon={<Mail size={18} />}
              placeholder={t('auth.login.emailPlaceholder')}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label={t('auth.login.passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                leftIcon={<Lock size={18} />}
                placeholder={t('auth.login.passwordPlaceholder')}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-8 text-dark-400 hover:text-dark-600`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-300 rounded"
                />
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-dark-600`}>{t('auth.login.rememberMe')}</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              {isLoading ? t('auth.login.loadingButton') : t('auth.login.submitButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              {t('auth.login.noAccount')}{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.login.createAccount')}
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">{t('auth.login.demoCredentials')}</h4>
            <p className="text-sm text-blue-700">{t('auth.login.demoEmail')}</p>
            <p className="text-sm text-blue-700">{t('auth.login.demoPassword')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;