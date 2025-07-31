import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderMailbox from './HeaderMailbox';
import Container from './Container';
import { getEmailDomains, getDefaultEmailDomain, EMAIL_DOMAINS, DEFAULT_EMAIL_DOMAIN } from '../config';

interface HeaderProps {
  mailbox: Mailbox | null;
  onMailboxChange?: (mailbox: Mailbox) => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  mailbox = null, 
  onMailboxChange = () => {}, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  const [emailDomains, setEmailDomains] = useState<string[]>(EMAIL_DOMAINS);
  const [defaultDomain, setDefaultDomain] = useState<string>(DEFAULT_EMAIL_DOMAIN);
  
  // 异步获取邮箱域名配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const domains = await getEmailDomains();
        const defaultDom = await getDefaultEmailDomain();
        setEmailDomains(domains);
        setDefaultDomain(defaultDom);
      } catch (error) {
        console.error('加载邮箱域名配置失败:', error);
      }
    };
    loadConfig();
  }, []);
  
  return (
    <header className="border-b">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="text-2xl font-bold">
            {t('app.title')}
          </Link>
          
          {mailbox && (
            <div className="flex items-center bg-muted/70 rounded-md px-3 py-1.5">
              <HeaderMailbox 
                mailbox={mailbox} 
                onMailboxChange={onMailboxChange}
                domain={defaultDomain}
                domains={emailDomains}
                isLoading={isLoading}
              />
              {/* 仅修改 */}
              <div className="ml-3 pl-3 border-l border-muted-foreground/20">
                <LanguageSwitcher />
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
