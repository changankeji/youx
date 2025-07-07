import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EmailList from '../components/EmailList';
import { MailboxContext } from '../contexts/MailboxContext';
import Container from '../components/Container';
import { API_BASE_URL } from '../config';

// 添加结构化数据组件
const StructuredData: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ZMAIL-24小时匿名邮箱",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CNY"
    },
    "description": "创建临时邮箱地址，接收邮件，无需注册，保护您的隐私安全",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1024"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    mailbox, 
    isLoading, 
    emails, 
    selectedEmail, 
    setSelectedEmail, 
    isEmailsLoading,
    setMailbox
  } = useContext(MailboxContext);
  const [secretInput, setSecretInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // 使用ref来跟踪是否已经处理过404错误
  const handlingNotFoundRef = useRef(false);
  
  // 密钥登录处理
  const handleSecretLogin = async () => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/mailboxes/by-secret/${secretInput}`);
      const data = await res.json();
      if (data.success && data.mailbox) {
        setMailbox(data.mailbox);
        setSelectedEmail(null);
      } else {
        setLoginError(t('mailbox.secretLoginFailed'));
      }
    } catch (e) {
      setLoginError(t('mailbox.secretLoginFailed'));
    } finally {
      setLoginLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <StructuredData />
      {/* 顶部密钥登录框 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder={t('mailbox.secretPlaceholder')}
          value={secretInput}
          onChange={e => setSecretInput(e.target.value)}
          className="border rounded px-2 py-1 w-64 font-mono"
        />
        <button
          className="px-4 py-1 bg-primary text-primary-foreground rounded"
          onClick={handleSecretLogin}
          disabled={loginLoading}
        >
          {t('mailbox.secretLoginBtn')}
        </button>
        {loginError && <span className="text-red-500 text-xs ml-2">{loginError}</span>}
      </div>
      <EmailList 
        emails={emails} 
        selectedEmailId={selectedEmail}
        onSelectEmail={setSelectedEmail}
        isLoading={isEmailsLoading}
      />
      
      {/* 介绍内容区域 */}
      <div className="mt-8 space-y-6">
        {/* 功能介绍 */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">{t('intro.features.title')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-shield-alt text-primary mt-1"></i>
                <div>
                  <h3 className="font-medium">{t('intro.features.privacy.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro.features.privacy.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-clock text-primary mt-1"></i>
                <div>
                  <h3 className="font-medium">{t('intro.features.temporary.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro.features.temporary.description')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-user-secret text-primary mt-1"></i>
                <div>
                  <h3 className="font-medium">{t('intro.features.anonymous.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro.features.anonymous.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-bolt text-primary mt-1"></i>
                <div>
                  <h3 className="font-medium">{t('intro.features.instant.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro.features.instant.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使用场景 */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">{t('intro.useCases.title')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
               <i className="fas fa-check-circle text-2xl text-primary mb-3"></i>
               <h3 className="font-medium mb-2">{t('intro.useCases.verification.title')}</h3>
               <p className="text-sm text-muted-foreground">{t('intro.useCases.verification.description')}</p>
             </div>
            <div className="text-center p-4">
              <i className="fas fa-download text-2xl text-primary mb-3"></i>
              <h3 className="font-medium mb-2">{t('intro.useCases.downloads.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('intro.useCases.downloads.description')}</p>
            </div>
            <div className="text-center p-4">
              <i className="fas fa-vial text-2xl text-primary mb-3"></i>
              <h3 className="font-medium mb-2">{t('intro.useCases.testing.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('intro.useCases.testing.description')}</p>
            </div>
          </div>
        </section>

        {/* 安全提示 */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">{t('intro.security.title')}</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <i className="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
              <p className="text-sm text-muted-foreground">{t('intro.security.warning1')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-500 mt-1"></i>
              <p className="text-sm text-muted-foreground">{t('intro.security.warning2')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-trash-alt text-red-500 mt-1"></i>
              <p className="text-sm text-muted-foreground">{t('intro.security.warning3')}</p>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">{t('intro.faq.title')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{t('intro.faq.q1.question')}</h3>
              <p className="text-sm text-muted-foreground">{t('intro.faq.q1.answer')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('intro.faq.q2.question')}</h3>
              <p className="text-sm text-muted-foreground">{t('intro.faq.q2.answer')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{t('intro.faq.q3.question')}</h3>
              <p className="text-sm text-muted-foreground">{t('intro.faq.q3.answer')}</p>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default HomePage;