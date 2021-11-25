import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from './themeContext';
import { WithThemeHello } from './hello';

import './styles.css';
import {
    ChangeEventHandler,
    FocusEventHandler,
    KeyboardEventHandler,
} from 'react';

export const withSelectAllOnFocus = <
    P extends React.InputHTMLAttributes<HTMLInputElement>
>(
    WrappedComponent: React.FC<P>,
) => (props: P) => {
    const onFocus: FocusEventHandler<HTMLInputElement> = (e) => {
        e.target.select();
    };
    return <WrappedComponent onFocus={onFocus} {...props} />;
};

export const withStuttering = <
    P extends React.InputHTMLAttributes<HTMLInputElement>
>(
    WrappedComponent: React.FC<P>,
) => (props: P) => {
    console.log(props.value);

    const [val, setVal] = React.useState(props.value);

    const onKeyDown: KeyboardEventHandler<KeyboardEvent> = (e) => {
        if (String.fromCharCode(e.keyCode).match(/(\w|\s)/g)) {
            setVal(val + e.key + e.key);
            console.log(val);
            e.preventDefault();
            e.stopPropagation();
        }
        return e;
    };
    return <WrappedComponent onKeyDown={onKeyDown} {...props} value={val} />;
};

function App() {
    const SomeInput = (props) => <input {...props} />;
    const InputSelectAll = withSelectAllOnFocus(SomeInput);
    const StutteredInputSelectAll = withStuttering(InputSelectAll);

    return (
        <div className="App">
            <ThemeProvider>
                <WithThemeHello loading={false} title="Select All Sandbox" />
            </ThemeProvider>
            <InputSelectAll value={'select all on focus'} />
            <br />
            <StutteredInputSelectAll value={'stutter'} />
        </div>
    );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
