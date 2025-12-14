import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { validateEmail } from '../utils/cn';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = t('auth.register.errors.firstNameRequired');
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = t('auth.register.errors.firstNameMinLength');
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t('auth.register.errors.lastNameRequired');
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = t('auth.register.errors.lastNameMinLength');
    }

    if (!formData.username.trim()) {
      errors.username = t('auth.register.errors.usernameRequired');
    } else if (formData.username.trim().length < 3) {
      errors.username = t('auth.register.errors.usernameMinLength');
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = t('auth.register.errors.usernameInvalid');
    }

    if (!formData.email) {
      errors.email = t('auth.register.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      errors.email = t('auth.register.errors.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('auth.register.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('auth.register.errors.passwordMinLength');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = t('auth.register.errors.passwordComplex');
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('auth.register.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.register.errors.passwordsMismatch');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register(formData);
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

  const passwordRequirements = [
    { text: t('auth.register.passwordRequirements.length'), met: formData.password.length >= 8 },
    { text: t('auth.register.passwordRequirements.upper'), met: /[A-Z]/.test(formData.password) },
    { text: t('auth.register.passwordRequirements.lower'), met: /[a-z]/.test(formData.password) },
    { text: t('auth.register.passwordRequirements.number'), met: /\d/.test(formData.password) },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-ore-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
       {/* Language switcher */}
       <div className="absolute top-4 end-4">
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
            <h2 className="text-2xl font-bold text-dark-900 mb-2">{t('auth.register.title')}</h2>
            <p className="text-dark-600">{t('auth.register.subtitle')}</p>
          </div>

          {error && (
            <div className={`mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className={`text-red-600 ${isRTL ? 'mr-2' : 'ml-2'}`} size={20} />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('auth.register.firstNameLabel')}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={formErrors.firstName}
                leftIcon={<User size={18} />}
                placeholder={t('auth.register.firstNamePlaceholder')}
                autoComplete="given-name"
                required
              />

              <Input
                label={t('auth.register.lastNameLabel')}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={formErrors.lastName}
                leftIcon={<User size={18} />}
                placeholder={t('auth.register.lastNamePlaceholder')}
                autoComplete="family-name"
                required
              />
            </div>

            <Input
              label={t('auth.register.usernameLabel')}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              leftIcon={<UserCheck size={18} />}
              placeholder={t('auth.register.usernamePlaceholder')}
              autoComplete="username"
              required
            />

            <Input
              label={t('auth.register.emailLabel')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              leftIcon={<Mail size={18} />}
              placeholder={t('auth.register.emailPlaceholder')}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label={t('auth.register.passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                leftIcon={<Lock size={18} />}
                placeholder={t('auth.register.passwordPlaceholder')}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-8 text-dark-400 hover:text-dark-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password requirements */}
            {formData.password && (
              <div className="bg-dark-50 p-3 rounded-lg">
                <p className="text-sm text-dark-600 mb-2">{t('auth.register.passwordRequirementsTitle')}</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.met ? (
                        <CheckCircle size={14} className={`text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      ) : (
                        <div className={`w-3.5 h-3.5 border border-dark-300 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-dark-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label={t('auth.register.confirmPasswordLabel')}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={formErrors.confirmPassword}
                leftIcon={<Lock size={18} />}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute end-3 top-8 text-dark-400 hover:text-dark-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-300 rounded mt-0.5"
                required
              />
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-dark-600`}>
                {t('auth.register.agreeTo')}{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  {t('auth.register.terms')}
                </Link>
                {' '}{t('auth.register.and')}{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  {t('auth.register.privacy')}
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              {isLoading ? t('auth.register.loadingButton') : t('auth.register.submitButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              {t('auth.register.hasAccount')}{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
