import { createContext } from 'react';
import { LanguageID, languages } from './typeconst';

const LangContext = createContext<{ selected: LanguageID }>({ selected: languages[0] });

export default LangContext;
