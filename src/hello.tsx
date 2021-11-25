import * as React from 'react';
import { withTheme } from './withTheme';

import './styles.css';

export interface HelloProps {
    title: React.ReactNode;
    primary: string;
}

const Hello: React.FC<HelloProps> = ({ title, primary }) => {
    return (
        <div className="hello">
            <h1 style={{ color: primary }}>Hello {title}</h1>
        </div>
    );
};

export const WithThemeHello = withTheme(Hello);
