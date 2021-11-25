import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from './themeContext';
import { WithThemeHello } from './hello';
import './styles.css';
import {
    ChangeEventHandler,
    FC,
    FocusEventHandler,
    KeyboardEventHandler,
} from 'react';

class HOCWrapper<T extends unknown> {
    static init = <T extends unknown>(component: FC<T>) =>
        new HOCWrapper(component);

    readonly component: FC<T>;

    constructor(component: FC<T>) {
        this.component = component;
    }

    add = (beh: (comp: FC<T>) => FC<T>) => new HOCWrapper(beh(this.component));
}

const attachableComponentFabric = <T extends unknown>(
    component: FC<T>,
    ...behaviours: ((comp: FC<T>) => FC<T>)[]
) => behaviours?.reduce((acc, val) => val(acc), component) ?? component;

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

    //Naive way
    const InputSelectAll = withSelectAllOnFocus(SomeInput);
    const StutteredInputSelectAll = withStuttering(InputSelectAll);

    //class way
    const ResComponent = HOCWrapper.init(SomeInput)
        .add(withSelectAllOnFocus)
        .add(withStuttering).component;

    //fabric function way
    const ResComponentFromFabric = attachableComponentFabric(
        SomeInput,
        withSelectAllOnFocus,
        withStuttering,
    );

    return (
        <div className="App">
            <ThemeProvider>
                <WithThemeHello loading={false} title="Select All Sandbox" />
            </ThemeProvider>
            <InputSelectAll value={'select all on focus'} />
            <br />
            <StutteredInputSelectAll value={'stutter'} />
             <br />
            <ResComponent value={'via class'} />
            <br />
            <ResComponentFromFabric value={'via fabric'} />
        </div>
    );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
