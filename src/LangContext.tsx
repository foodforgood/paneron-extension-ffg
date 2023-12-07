import React from 'react';
import { LanguageID, languages } from './typeconst';

const LangContext = React.createContext<{ selected: LanguageID }>({ selected: languages[0] });

export default LangContext;
