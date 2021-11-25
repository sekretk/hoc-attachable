import * as React from 'react';
import { InjectedThemeProps } from './withTheme';

export const ThemeContext = React.createContext<InjectedThemeProps>(null);

export const ThemeProvider: React.FC = ({ children }) => {
    return (
        <ThemeContext.Provider value={{ primary: 'red' }}>
            {children}
        </ThemeContext.Provider>
    );
};
