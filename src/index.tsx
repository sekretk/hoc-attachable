import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from './themeContext';
import { WithThemeHello } from './hello';
import './styles.css';
import {
    ChangeEventHandler,
    FC,
    FocusEventHandler,
    Fragment,
    KeyboardEventHandler,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
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

interface IValorized<T> {
    value: T;
    onChanged: ChangeEventHandler<T>;
}

export const withPristine = <T extends unknown, P extends IValorized<T>>(
    WrappedComponent: React.FC<P>,
) => (
    props: P & {
        onOwnedChange: (val: boolean) => void;
    },
) => {
    const { value, onOwnedChange } = props;

    const [owned, setOwned] = useState(false);
    const [valProp, setPropValue] = useState(props.value);
    const [focused, setFocused] = React.useState(false);
    const onBlur = () => setFocused(false);

    const owning = useCallback(
        (own: boolean) => {
            if (owned !== own) {
                onOwnedChange(own);
            }
            setOwned(own);
        },
        [owned],
    );

    useEffect(() => {
        if (value !== valProp) {
            owning(false);
            if (!focused) {
                setPropValue(value);
            }
        }
    }, [value]);

    const onFocus: FocusEventHandler<P> = (e) => {
        owning(true);
        return e;
    };

    const onChange: ChangeEventHandler<P> = (e) => {
        setPropValue(e.target.value);
    };

    return (
        <WrappedComponent
            onFocus={onFocus}
            {...props}
            className={owned ? 'owned' : 'calculated'}
            value={valProp}
            onChange={onChange}
        />
    );
};

const App = React.memo(() => {
    const SomeInput = useCallback((props) => <input {...props} />, []);

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

    const PristinedInput = useMemo(() => withPristine(SomeInput), [SomeInput]);

    const [pVal, setPval] = useState('default value');

    const onClick = () => setPval(Math.random().toString());

    const onPristineChanged = (val) => console.log('pristine:', val);

    const onChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
        console.log(e.target.value);
        setPval(e.target.value);
    };

    const [roVal, setROVal] = useState('im not not readonly');

    const [inpVal, setInpVal] = useState('im inpval');

    const InputElem = <input value={inpVal} />;

    useEffect(() => {
        setInterval(onClick, 5000);
    }, []);

    return (
        <div className="App">
            {/* <ThemeProvider>
                <WithThemeHello loading={false} title="Select All Sandbox" />
            </ThemeProvider>
            <input value={roVal} onChange={(e) => setROVal(e.target.value)} />
            <br />
            <InputSelectAll value={'select all on focus'} />
            <br />
            <StutteredInputSelectAll value={'stutter'} />
             <br />
            <ResComponent value={'via class'} />
            <br />
            <ResComponentFromFabric value={'via fabric'} />
            <br /> */}
            <PristinedInput
                value={pVal}
                onOwnedChange={(val) => console.log('owned:', val)}
                onChange={(e) => setPval(e.target.value)}
            />
            <button onClick={onClick}>Cal value</button>
            {/* <br />
            <SomeInput
                value={roVal}
                onChange={(e) => setROVal(e.target.value)}
            /> */}
        </div>
    );
});

const rootElement = document.getElementById('root');
render(<App />, rootElement);
