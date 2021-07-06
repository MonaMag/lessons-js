import React from 'react';
import CurrencyExchange from '../../components/CurrencyExchange/CurrencyExchange';
import { CurrencyState, CurrencyType } from '../../redux/currencyReducer';
import { Dispatch } from 'redux';
import {
    ChangeActionAC,
    ChangeCurrencyFieldAC,
    ChangeCurrentCurrencyAC,
    CurrencyReducersTypes
} from '../../redux/actions';
import { connect, ConnectedProps } from 'react-redux';

const CurrencyEContainer: React.FC<TProps> = props => {
//деструктуризация пропсов: мы не деструктурируем пропсы в самой функции, а просто получаем все пропсы и уже в рамках компоненты первой строкой делаем деструк-ю пропсов, для лучшей читаемости
    /*const {
        currencies,
        currentCurrency,
        isBuying,
        amountOfBYN,
        amountOfCurrency,
        setCurrencyAmount,
        setAction,
        changeCurrency,
    } = props;*/
    const {
        currencies,
        currentCurrency,
        isBuying,
        amountOfBYN,
        amountOfCurrency,
        ChangeCurrencyFieldAC,
        ChangeActionAC,
        ChangeCurrentCurrencyAC
    } = props;

    let currencyRate: number = 0;
    //создаем массив имен валют: пробегаемся по массиву с валютами, проверяем на соответствие выбранной валюте и далее в зависимости что у нас покупка или продажа, выбирается курс и возвращаем имя валиты. Раз у нас это массив хранит только имя валюты, значит в будущем от отвечает за отрисовку кнопки с именем валюты
    const currenciesName = currencies.map((currency: CurrencyType) => {
        if (currency.currencyName === currentCurrency) {
            currencyRate = isBuying ? currency.buyRate : currency.sellRate;
        }
        return currency.currencyName;
    });

    const changeCurrencyField = (e: React. ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        // isFinite позволяет нам понять число это или нетб т.е позволяет четко определить можно ли привести к числу то значение которое нам передано или нет. Но есть особенность: isFinite(null)=true, т.е везде где у нас null нужна дополнительная проверка на null
        //Но у нас инпут, а инпут никогда не возвращает null, он возв-т в крайнем случае undefined или пустую строку
        if (!isFinite(+value)) return;
        //здесь явным образом приводится значение к числу, хотя здесь это и не обязательно
        //следующая проверка бесмыслена, но здесь необходима тк typescript не умеет работать с дата-атрибутами, в нем не прописана типизация для них и не знает про dataset, поэтому в typescript необходима делать эту проверку, чтоб он убедился что значение есть
        if (e.currentTarget.dataset.currency) {
            const trigger: string = e.currentTarget.dataset.currency;
            if (trigger === 'byn') {
                if (value === '') {
                    //setCurrencyAmount(value, value);
                    ChangeCurrencyFieldAC(value, value);
                } else {
                    // приоритет у Number выше чем у унарного плюса, у + самый низкий приоритет, поэтому он выполнится, после выполнения всей строки Number(value).toFixed(2), toFixed возвращает строку, округляет до заданого количества знаков после запятой
                    //setCurrencyAmount(value, (+Number(value).toFixed(2) / currencyRate).toFixed(2));
                    ChangeCurrencyFieldAC(value, (+Number(value).toFixed(2) / currencyRate).toFixed(2));
                }
            } else {
                if (value === '') {
                    //setCurrencyAmount(value, value);
                    ChangeCurrencyFieldAC(value, value);
                } else {
                    //setCurrencyAmount((+Number(value).toFixed(2) * currencyRate).toFixed(2), value);
                    ChangeCurrencyFieldAC((+Number(value).toFixed(2) * currencyRate).toFixed(2), value);
                }
            }
        }
    };

    //это у нас кнопка Buy Sell и будет отвечать за то что будет храниться в redux в переменной isBuying
    const changeAction = (e: React.MouseEvent<HTMLSpanElement>) => {
        //e.currentTarget.dataset.action === 'buy' ? setAction(true) : setAction(false);
        e.currentTarget.dataset.action === 'buy' ? ChangeActionAC(true) : ChangeActionAC(false);
    };
// это нажатие на одну из кнопок, чтобы изменить текущую валюту; это один из вариантов выполнения выражения в JS через логические операторы
    const changeCurrentCurrency = (e: React.MouseEvent<HTMLLIElement>) => {
        //e.currentTarget.dataset.currency && changeCurrency(e.currentTarget.dataset.currency);
        e.currentTarget.dataset.currency && ChangeCurrentCurrencyAC(e.currentTarget.dataset.currency);
        //если  e.currentTarget.dataset.currency false, то возвращает false, ничего не отрисуется, если true, то начинает выполнять второе выражение, собственно нам и надщ чтобы запустилась эта функция, сам результат логического И нас не интересует, но мы точно знаем что эта функция changeCurrency(e.currentTarget.dataset.currency) выполнится, только в том случае, если в первом выражении не null либо не undefined;  т.е таким способом мы делаем проверку на наличие значения, что необходимо для TypeScript
    };

    return (
        // <React.Fragment> это тоже что и <></>, более старая ее версия, уже не используем
        //Для чего вообще мы мспользуем <></>? Чтобы не добавлять лишние узлы в DOM, чтобы не делать лишних вложенностей, тк текущее DOM дерево поддерживает маским глубину 32 элементов, т.е в глубь может уходить от одного узла на 32 узла внутьрь, далее дерево поломается
        <React.Fragment>
            <CurrencyExchange
                currenciesName={currenciesName}
                currentCurrency={currentCurrency}
                currencyRate={currencyRate}
                isBuying={isBuying}
                amountOfBYN={amountOfBYN}
                amountOfCurrency={amountOfCurrency}
                changeCurrencyField={changeCurrencyField}
                changeAction={changeAction}
                changeCurrentCurrency={changeCurrentCurrency}
            />
        </React.Fragment>
    );
};

const mapStateToProps = ( { currency } : {currency: CurrencyState} ): CurrencyState => {
    return {
        currencies: currency.currencies,
        currentCurrency: currency.currentCurrency,
        isBuying: currency.isBuying,
        amountOfBYN: currency.amountOfBYN,
        amountOfCurrency: currency.amountOfCurrency,
    };
};


/*const mapDispatchToProps = (dispatch: Dispatch<CurrencyReducersTypes>) : any => {
    return {
        setCurrencyAmount(amountOfBYN: string, amountOfCurrency: string) {
            dispatch(ChangeCurrencyFieldAC(amountOfBYN, amountOfCurrency));
        },
        setAction(isBuying: boolean) {
            dispatch(ChangeActionAC(isBuying));
        },
        changeCurrency(currency: string) {
            dispatch( ChangeCurrentCurrencyAC(currency));
        },
    };
};*/



//const connector = connect(mapStateToProps, mapDispatchToProps)(CurrencyEContainer);
//Такую запись можно делить на кусочки:

//const connector = connect(mapStateToProps, mapDispatchToProps);
const connector = connect(mapStateToProps, { ChangeCurrencyFieldAC, ChangeActionAC, ChangeCurrentCurrencyAC });

//забираем тип из этой функции, для этого используем ConnectedProps из библиотеки react-redux, она доставет все тыпы которые в ней есть
//т.е типизирует полностью mstp, mdtp
type TProps = ConnectedProps<typeof connector>;
//далее уже вызываем функцию CurrencyEContainer и также используем созданную типизацию для нее.
export default connector(CurrencyEContainer);

