import * as React from 'react';

type Optionalize<T extends K, K> = Omit<T, keyof K>;

export interface IFocusable {
    onFocus?: React.FocusEventHandler<IFocusable>;
}

export function withSelectAllOnFocus(Component: HTMLInputElement) {
    return (props: P) => {
        const onFocus: React.FocusEventHandler<IFocusable> = (e) => {
            console.log(e.target);
            e.target.select();
        };

        return <Component {...props} onFocus={onFocus} />;
    };
}
