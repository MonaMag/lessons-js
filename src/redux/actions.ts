export enum ACTIONS_TYPE {
    CHANGE_CURRENCY_FIELD_TYPE = 'CurrencyExchange/CHANGE_CURRENCY_FIELD_TYPE',
    CHANGE_CHANGE_ACTION = 'CurrencyExchange/CHANGE_CHANGE_ACTION',
    CHANGE_CURRENT_CURRENCY = 'CurrencyExchange/CHANGE_CURRENT_CURRENCY',
}
//enum это объект констант, это объект js  у которого будет применен ObjectFreeze, которая замораживает объект для любого изменения; он бывает строковый (как  унас) и числовой; таким образом мы упаковываем все константы в одтн объект и экспортируем его, вместо многосичленных экспортов каждой константы отдельно и соответсвено избавляемся от большого количества импортов

export type ChangeCurrencyFieldType = {
    type: ACTIONS_TYPE.CHANGE_CURRENCY_FIELD_TYPE;
    payload: {
        amountOfBYN: string
        amountOfCurrency: string
    }
};

export type ChangeActionType = {
    type: ACTIONS_TYPE.CHANGE_CHANGE_ACTION;
    payload: {
        isBuying: boolean
    }
};


export type ChangeCurrentCurrencyType  = {
    type: ACTIONS_TYPE.CHANGE_CURRENT_CURRENCY;
    payload: {
        currentCurrency: string
    }
};


export type CurrencyReducersTypes = ChangeCurrencyFieldType | ChangeActionType | ChangeCurrentCurrencyType;


export const ChangeCurrencyFieldAC = (amountOfBYN: string, amountOfCurrency: string): ChangeCurrencyFieldType => {
   return {
   type: ACTIONS_TYPE.CHANGE_CURRENCY_FIELD_TYPE,
   payload: { amountOfBYN:  amountOfBYN, amountOfCurrency: amountOfCurrency},
   };
};


export const ChangeActionAC = (isBuying: boolean): ChangeActionType => {
    return {
        type: ACTIONS_TYPE.CHANGE_CHANGE_ACTION,
        payload: { isBuying }
    }
};

export const ChangeCurrentCurrencyAC = (currentCurrency: string): ChangeCurrentCurrencyType => {
    return {
        type: ACTIONS_TYPE.CHANGE_CURRENT_CURRENCY,
        payload: { currentCurrency }
    }
};

