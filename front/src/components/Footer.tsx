import React from 'react';
import './Footer.css';

interface FooterProps {
  onLogout: () => void;
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ onLogout, isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${isDarkMode ? 'footer-dark' : 'footer-light'}`}>
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-copyright">
            © {currentYear} Sistema de Trámites. Todos los derechos reservados.
          </span>
        </div>
        
        <div className="footer-center">
          <div className="footer-links">
            <a href="#" className="footer-link">Términos</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Privacidad</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Ayuda</a>
          </div>
        </div>

        <div className="footer-right">
          <button 
            onClick={onLogout} 
            className={`footer-logout-btn ${isDarkMode ? 'logout-dark' : 'logout-light'}`}
          >
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;