import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";
import { buildBreadcrumbItems } from "./application-shell-model";
import styles from "./Breadcrumbs.module.css";

export function Breadcrumbs() {
  const location = useLocation();

  if (location.pathname === "/") return null;

  const items = buildBreadcrumbItems(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <div className={styles.container}>
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={`${index}-${item.label}`} className={styles.item}>
              {index > 0 && <ChevronRight size={14} className={styles.separator} />}
              {item.current ? (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.current}
                  aria-current="page"
                >
                  {item.label}
                </motion.span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className={index === 0 ? styles.link : styles.breadcrumbLink}
                >
                  {index === 0 && <Home size={14} />}
                  <span className={index === 0 ? styles.homeLabel : undefined}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className={styles.intermediate}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
