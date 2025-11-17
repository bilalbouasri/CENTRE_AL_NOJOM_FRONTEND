import { createContext } from 'react';
import type { LanguageContextType } from './LanguageContext.types';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);