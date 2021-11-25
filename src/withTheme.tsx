import * as React from 'react';
import { ThemeContext } from './themeContext';

const { useContext } = React;

type Optionalize<T extends K, K> = Omit<T, keyof K>;

export interface InjectedThemeProps {
    primary: string;
}

// EnhancedThemeProps 需要是可选参数, 暂时不知道怎么解决
export interface EnhancedThemeProps {
    loading?: boolean;
}

export function withTheme<P extends InjectedThemeProps = InjectedThemeProps>(
    Component: React.ComponentType<P>,
) {
    const WithTheme = ({
        loading = false,
        ...props
    }: Optionalize<P, InjectedThemeProps> & EnhancedThemeProps) => {
        const { primary } = useContext(ThemeContext);

        return loading ? (
            <i className="loading">loading</i>
        ) : (
            <Component primary={primary} {...props as P} />
        );
    };

    WithTheme.displayName = `withTheme${Component.displayName}`;

    return WithTheme;
}
