console.log('lesson 2');

// Lexical environment
// http://jsflow.org/docs/lex-env/

//// Closure
// https://learn.javascript.ru/closure
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Closures
// https://medium.com/@stasonmars/%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%B5%D0%BC-%D0%B7%D0%B0%D0%BC%D1%8B%D0%BA%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B2-javascript-%D1%80%D0%B0%D0%B7-%D0%B8-%D0%BD%D0%B0%D0%B2%D1%81%D0%B5%D0%B3%D0%B4%D0%B0-c211805b6898
// https://www.youtube.com/watch?v=pahO5XjnfLA

//// Сurrying
// https://learn.javascript.ru/currying-partials
// https://medium.com/@stasonmars/%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%B5%D0%BC-%D0%BA%D0%B0%D1%80%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B2-javascript-5ec4a1d88827

// Pattern Module
// https://habr.com/ru/company/ruvds/blog/419997/

// Recursion
// https://learn.javascript.ru/recursion
// https://www.youtube.com/watch?v=Kuq6oIN3PH0


// Task 01
// Реализовать функцию sum которая суммирует 2 числа следующим образом sum(3)(6) === 9

let globalScope = {
    outerScope: null,
    sum: 'Function',
}


function sum(n: number) {
    let sumFunctionScope = {
        outerScope: globalScope,
        n: undefined,
    }
    return function (n2: number) {
        let anonimFunctionScope ={
            outerScope: sumFunctionScope,
            n2: undefined,
        }
        return (n + n2);
    }
}

console.log(sum(3)(6)); //сделали два вызова подряд: вместо sum(3) возвращается ссылка на анонимную функцию и затем, результат этот нигде не сохраняем, а вызываем на месте
//можно записать в две записи
let param = sum(3);
param(6);

// Task 02
// Реализовать функцию makeCounter которая работает следующим образом:
// const counter = makeCounter();
// counter(); // 1
// counter(); // 2
// const counter2 = makeCounter();
// counter2(); // 1
// counter(); // 3

function makeCounter() {
    let makeCounterScope = {
        outerScope: globalScope,
        count: 0, //iter1 => 1, iter2 => 2
    }
    let count = 0;
    return function () {
        let anonimFunctionScope ={
            outerScope: makeCounterScope,
        }
        //count += 1;
        return ++count; //при префиксной ретурнится уже измененное значение, а при постфиксной - предыдущее
    }
}

const counter = makeCounter()  //возвращает ссылку на анонимную функцию
console.log(counter()); // 1
console.log(counter()); //2
const counter2 = makeCounter(); // создается новая переменная, снова вызывается makeCounter(), а значит создается другой объект makeCounterScope и отдельная другая анонимная функция, у кот уже outerScope: makeCounterScope ссылка на новый экземпляр makeCounterScope, соответс-но все значения начаьные значения
console.log(counter2()); //1
console.log(counter());


// Task 03
// Переписать функцию из Task 02 так, что бы она принимала число в качестве аргумента и это число было стартовым значением счетчика
// и возвращала следующий объект методов:
// increase: +1
// decrease: -1
// reset: установить счетчик в 0;
// set: установить счетчик в заданное значение;

//Объект не содает область видимости! Поэтому для методов в объекте область их видимости это область видимости функции

function makeCounter2(n: number) {
    let makeCounterScope = {
        outerScope: globalScope,
        n: undefined,
        count: n,
    }
    let count = n;
    return {
        increase: () => ++count,
        decrease: () => --count,
        reset: () => {
            count = 0;
            return count;
        },
        set: (num: number) => {
            count = num;
            return count;
        },
        getCount: () => counter

    }
}
//Recursion
//У рекурсионного цикла должно быть две основополагающие вещы: точка выхода из рекурсии и функция должна быть вызвана с новыми аргументами
//Напишите функцию sumTo(n), которая вычисляет сумму чисел 1 + 2 + ... + n.
// sumTo(1) = 1
// sumTo(2) = 2 + 1 = 3
// sumTo(3) = 3 + 2 + 1 = 6
// sumTo(4) = 4 + 3 + 2 + 1 = 10
// ...
// sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050

//с помощбю цикла for
function sumTo(n: number) {
    let result = 0;
    for(let i = n; i > 0; i--){
        result = result + i;
    }
}
console.log(sumTo(100));


//с помощью рекурсии

function sumToRec(n: number): number {
    if(n == 1) return n;
    return n + sumToRec(n - 1)
}
console.log(sumToRec(10));


// Task 04*
// Реализовать функцию superSum которая принимает число в качестве аргумента, которое указывает на количество слагаемых
// и что бы корректно работали следующие вызовы:
// 1) superSum(0) //0
// 2) superSum(3)(2)(5)(3) //10
// 3) superSum(3)(2)(5,3) //10
// 4) superSum(3)(2,5,3) //10
// 5) superSum(3)(2,5)(3) //10
// 6) superSum(3)(2,5)(3,9) //10

// P.S. типизируйте только аргументы, а при вызове функции используйте @ts-ignore

function superSum(num:number) {
    if(num <= 0) return 0;
    if(num == 1) return (n:number) => n; //итак исключения числовые мы обработали, приступаем к основной логике
    let _arguments: number[] = [];

    function helper(...args: number[]) {
        _arguments = [..._arguments, ...args];
        if(_arguments.length >= num) {
            _arguments.length = num;
            return _arguments.reduce( (acc, item) => acc + item);
        } else {
            return helper;
        }
    }
return helper;
}
// @ts-ignore
console.log(superSum(3)(2)(5)(3));
// @ts-ignore
console.log(superSum(3)(2,5,3));
// @ts-ignore
console.log(superSum(3)(2,5)(3,9));





// Task 05
// решить все задачи по рекурсии которые даны в конце статьи https://learn.javascript.ru/recursion

// Task 06
// написать функцию, которая повторяет функционал метода flat массива на всю глубину.

// just a plug
export default () => {};