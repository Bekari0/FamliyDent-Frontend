import type { HTMLAttributes } from "react";

export function Container({
  as: Tag = "div",
  width = "page",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "header" | "footer";
  width?: "page" | "content" | "readable";
}) {
  return (
    <Tag
      className={`page-container${width === "page" ? "" : ` page-container--${width}`} ${className}`.trim()}
      {...props}
    />
  );
}
