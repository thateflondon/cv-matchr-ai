import { Link } from "react-router";

interface UserProps {
  userName?: string;
}

const Navbar = ({ userName }: UserProps) => {
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo-wrapper">
          {/* <span className="app-logo" src="/public/icons/check.svg" alt="check" /> */}
          <span className="app-logo"></span>
          <p className="logo-text w-fit">CV Match</p>
        </div>
      </Link>

      <div className="menu-right">
        <Link to="/upload">
          <p className="primary-button w-fit">Upload Resume</p>
        </Link>
        <div className="dashboard">Dashboard</div>
        {
            userName ? (
            <div className="username-container">Welcome <span className="username-content">{userName}</span></div>
        ) : (
            <div className="username-container">Welcome <span className="username-content">guest</span></div>
        )
        }
        <span className="language-choice"><img src="/icons/lang_uk.svg" alt="english" /></span>
      </div>
    </nav>
  );
};

export default Navbar;