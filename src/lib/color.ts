/**
 * Alpha variant of any CSS color, including var(--token) values.
 * Hex suffix tricks like `${color}20` cannot work with CSS variables, color-mix can.
 */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;
