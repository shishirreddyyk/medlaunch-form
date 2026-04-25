import './Header.css'

export default function Header({ userName }) {
  const initials = userName
    ? userName.trim().split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '–'

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="4" fill="white" fillOpacity="0.15"/>
              <path d="M7 7h6.5a7.5 7.5 0 010 15H7V7z" fill="white"/>
              <circle cx="20" cy="14" r="3" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <div className="header-title">
            <span className="header-brand-name">DNV Healthcare</span>
            <span className="header-sub">Accreditation & Certification</span>
          </div>
        </div>
        {userName && (
          <div className="header-right">
            <span className="header-username">{userName}</span>
            <div className="header-avatar" title={userName} aria-label="User profile">
              {initials}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
