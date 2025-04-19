import chalk from 'chalk';
import { ConfigManager } from '../config/configManager';

type LogLevel = 'info' | 'success' | 'error' | 'warn' | 'custom';

interface LogEntry {
  message: string;
  level?: LogLevel;
  emoji?: string;
  color?: (text: string) => string; // only for 'custom' level
  error?: unknown;
}

const levelStyles: Record<LogLevel, { emoji: string; color: (text: string) => string }> = {
  info: { emoji: 'ℹ️', color: chalk.gray },
  success: { emoji: '✅', color: chalk.green },
  error: { emoji: '❌', color: chalk.red },
  warn: { emoji: '⚠️', color: chalk.yellow },
  custom: { emoji: '', color: chalk.white }, // overridden manually
};

/**
 *
 * automatically formats each msg in newline for a message list
 */
export function logMessages(logs: LogEntry[]) {
  const config = ConfigManager.getInstance().getConfig(); // 🟢 always latest config
  for (const log of logs) {
    const { message, level = 'info', emoji, color, error } = log;
    const style = levelStyles[level];

    const icon = emoji ?? style.emoji;
    const text = icon ? `${icon} ${message}` : message;

    const coloredText = level === 'custom' ? (color ? color(text) : text) : style.color(text);

    console.log(coloredText);

    if (config.verbose && error instanceof Error) {
      console.log(chalk.dim(error.stack));
    }
  }
}

export function getErrorMsg(error: unknown) {
  return error instanceof Error ? error.message : '❌ Unexpected error';
}
