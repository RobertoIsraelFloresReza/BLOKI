import { SetMetadata } from '@nestjs/common';

export const PAUSABLE_KEY = 'pausable';

/**
 * Decorator to mark methods that should be blocked when system is paused
 * Use this on critical operations like tokenization, marketplace trades, etc.
 */
export const Pausable = () => SetMetadata(PAUSABLE_KEY, true);
