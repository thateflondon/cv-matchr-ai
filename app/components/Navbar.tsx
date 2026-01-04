import { useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

interface UserProps {
  userName?: string;
}

const Navbar = ({ userName }: UserProps) => {
  const { auth } = usePuterStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <div className="logo-wrapper">
            <img className="app-logo" src="/icons/logo.png" alt="logo" />
            <p className="logo-text w-fit">atch</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="menu-right max-md:hidden">
          <Link to="/upload">
            <p className="primary-button w-fit">Upload Resume</p>
          </Link>
          {auth.isAuthenticated && (
            <>
              <div className="dashboard">Dashboard</div>
              {userName ? (
                <div className="username-container">
                  Welcome <span className="username-content">{userName}</span>
                </div>
              ) : (
                <div className="username-container">
                  Welcome <span className="username-content">guest</span>
                </div>
              )}
            </>
          )}
          {/*Hidden before app translation is made */}
          <div className="language-selection">
            <span className="language-choice">
              <img src="/icons/lang_fr.svg" alt="english" />
            </span>
            <span className="language-choice">
              <img src="/icons/lang_uk.svg" alt="english" />
            </span>
          </div>
        </div>

        {/* Hamburger Icon */}
        <button
          className="hamburger-button md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}>
          <div
            className={`mobile-menu-sidebar ${isMenuOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="mobile-menu-close"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Menu Items */}
            <div className="mobile-menu-content">
              <Link to="/upload" onClick={toggleMenu}>
                <div className="mobile-menu-item">
                  <p className="primary-button w-fit">Upload Resume</p>
                </div>
              </Link>

              {auth.isAuthenticated && (
                <>
                  <div className="mobile-menu-item">
                    <div className="dashboard">Dashboard</div>
                  </div>

                  <div className="mobile-menu-item">
                    {userName ? (
                      <div className="username-container">
                        Welcome{" "}
                        <span className="username-content">{userName}</span>
                      </div>
                    ) : (
                      <div className="username-container">
                        Welcome <span className="username-content">guest</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mobile-menu-item">
                <h4 className="pb-4">Select language</h4>
                <span className="language-choice flex">
                  <a className="w-[30px] mr-4" href="ENglish">
                    <img src="/icons/lang_uk.svg" alt="english" />
                  </a>
                  <a className="w-[30px]" href="FRench">
                    <img src="/icons/lang_fr.svg" alt="french" />
                  </a>
                  {/* <span className="ml-2">English</span> */}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
