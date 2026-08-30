import { useEffect, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS, useNav } from "../context/NavContext";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hovered, setHovered } = useNav();
  const onTank = location.pathname === "/fishtank";
  const [visible, setVisible] = useState(!onTank);

  useEffect(() => {
    setVisible(!onTank);
  }, [onTank]);

  return (
    <>
      {onTank && (
        <div
          className="nav-trigger"
          onMouseEnter={() => setVisible(true)}
          onTouchStart={(e) => {
            e.preventDefault();
            setVisible((v) => !v);
          }}
        />
      )}
      {onTank && visible && (
        <button
          type="button"
          className="nav-close"
          aria-label="隐藏导航栏"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      )}
      <header
        className={
          "navbar" +
          (onTank ? " auto-hide" : "") +
          (onTank && visible ? " visible" : "")
        }
        onMouseLeave={() => {
          setHovered(null);
          if (onTank) setVisible(false);
        }}
      >
        <div className="site-brand" onClick={() => navigate("/")}>
          个人主页<span className="site-brand-en">PERSONAL</span>
        </div>
        <nav className="navbar-inner">
          {NAV_ITEMS.map((item, i) => {
            const active =
              location.pathname === item.path ||
              (location.pathname === "/" && hovered === i);
            return (
              <button
                key={item.path}
                type="button"
                className={"nav-item" + (active ? " active" : "")}
                style={{ "--accent": item.color } as CSSProperties}
                onMouseEnter={() => setHovered(i)}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-index">0{i + 1}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>
    </>
  );
}
