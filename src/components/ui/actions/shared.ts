import type { ActionCommonProps } from "../../../types/ui";

interface BuildActionOptions extends ActionCommonProps {
  disabled?: boolean;
  loading?: boolean;
}

export const buildActionClassName = ({
  variant = "primary",
  size = "md",
  tone = "default",
  interaction = "default",
  fullWidth = false,
  disabled = false,
  loading = false,
  class: className = ""
}: BuildActionOptions): string => {
  return [
    "ui-action",
    `ui-action--${variant}`,
    `ui-action--${size}`,
    `ui-action--tone-${tone}`,
    `ui-action--interaction-${interaction}`,
    fullWidth && "ui-action--block",
    disabled && "is-disabled",
    loading && "is-loading",
    className
  ]
    .filter(Boolean)
    .join(" ");
};
