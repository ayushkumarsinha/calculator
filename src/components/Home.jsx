import React, { useState } from 'react';

function Home(props) {
    const [displayValue, setDisplayValue] = useState(0);
    const [displayLastValue, setDisplayLastValue] = useState("");
    const [pressedEqual, setPressedEqual] = useState(false);
    const [opDisabled, setOpDisabled] = useState(false);
    const parseCalculationString = (s) => {
        var calculation = [],
            current = '';
        for (var i = 0, ch; ch = s.charAt(i); i++) {
            if ('^*/+-'.indexOf(ch) > -1) {
                if (current == '' && ch == '-') {
                    current = '-';
                } else {
                    calculation.push(parseFloat(current), ch);
                    current = '';
                }
            } else {
                current += s.charAt(i);
            }
        }
        if (current != '') {
            calculation.push(parseFloat(current));
        }
        return calculation;
    }
    
    const calculate = (calc) => {
        var ops = [{'^': (a, b) => Math.pow(a, b)},
                   {'*': (a, b) => a * b, '/': (a, b) => a / b},
                   {'+': (a, b) => a + b, '-': (a, b) => a - b}],
            newCalc = [],
            currentOp;
        for (var i = 0; i < ops.length; i++) {
            for (var j = 0; j < calc.length; j++) {
                if (ops[i][calc[j]]) {
                    currentOp = ops[i][calc[j]];
                } else if (currentOp) {
                    newCalc[newCalc.length - 1] = 
                        currentOp(newCalc[newCalc.length - 1], calc[j]);
                    currentOp = null;
                } else {
                    newCalc.push(calc[j]);
                }
                console.log(newCalc);
            }
            calc = newCalc;
            newCalc = [];
        }
        if (calc.length > 1) {
            console.log('Error: unable to resolve calculation');
            return calc;
        } else {
            return calc[0];
        }
    }
    const onButtonClick = (val) =>{
        var value = displayValue;
        var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var operators = ["+", "-", "/", "*"];
        var scientific = ["sin", "cos", "tan"];
        var operations = ["undo", "C", "CE", "all-clear", "(", ")"];
        switch (val) {
            // case "CE":
            //     setDisplayLastValue("");
            //     setDisplayValue(0);
            //     break;
            case "C":
                setDisplayLastValue(displayValue);
                setDisplayValue(0);
                break;
            case "undo":
                var newVal = displayValue.split("").splice(0,displayValue.length-1).join("");
                setDisplayValue(newVal === "" ? 0 : newVal);
                break;
            case "all-clear":
                setDisplayLastValue("");
                setDisplayValue(0);
                break;
            case "=":
                var dispVal = displayValue;
                if(displayValue.indexOf("(") === -1 && displayValue.indexOf(")") === -1){
                    var result = calculate(parseCalculationString(displayValue));
                    setDisplayValue(result);
                    setPressedEqual(true);
                }
                else if(dispVal.indexOf("(") !== -1 && dispVal.indexOf(")") !== -1){
                    var bracketResult = "0";
                    for (let index = dispVal.indexOf("(")+1; index < dispVal.indexOf(")"); index++) {
                        bracketResult = bracketResult + dispVal[index];                        
                    }                    
                    var tempresult = calculate(parseCalculationString(bracketResult));
                    console.log("Here--");
                    console.log(tempresult);
                    console.log("--");
                    var dispVal = dispVal.split("(")[0]+tempresult.toString()+dispVal.split(")")[1];
                    // for (let index = dispVal.indexOf("("); index < dispVal.indexOf(")"); index++) {
                    //     if(dispVal[index] === ")")
                    //         dispVal.replace(dispVal[index],tempresult.toString());
                    //     else
                    //         dispVal.replace(dispVal[index],"");                       
                    // }
                    var result = calculate(parseCalculationString(dispVal));
                    setDisplayValue(result);
                    setPressedEqual(true);
                }
                break;
            default:
                if(pressedEqual){
                    setDisplayLastValue(displayValue);
                    setDisplayValue(0);
                    value = undefined;
                    setPressedEqual(false);
                }
                if(operators.includes(val) && operators.includes(displayValue[displayValue.length-1])){
                    var newVal = displayValue.split("").splice(0,displayValue.length-1).join("");
                    setDisplayValue(newVal === "" ? 0 : newVal);
                }
                value = numbers.includes(val) ? (value === undefined || displayValue === 0 ? "" : value) + "" + parseInt(val) : (value === undefined || displayValue === 0 ? "" : value) + "" + val;
                setOpDisabled(operations.includes(val) ? true : false);
                setDisplayValue(value);
                break;
        }
        // if (val === "="){

        // }
        // else{
        //     value = numbers.includes(val) ? (value === undefined || displayValue === 0 ? "" : value) + "" + parseInt(val) : value + "" + val;
        //     setDisplayValue(value);
        // }
    }
    return(
        <div className="calculator">
        <input type="text" className="calculator-screen calculator-screen-history" value={displayLastValue} disabled />
            <input type="text" className="calculator-screen" value={displayValue} disabled />
            <div className="calculator-keys">
    
                <button type="button" onClick={()=>onButtonClick("+")} disabled={opDisabled} className="operator" value="+">+</button>
                <button type="button" onClick={()=>onButtonClick("-")} disabled={opDisabled} className="operator" value="-">-</button>
                <button type="button" onClick={()=>onButtonClick("*")} disabled={opDisabled} className="operator" value="*">&times;</button>
                <button type="button" onClick={()=>onButtonClick("/")} disabled={opDisabled} className="operator" value="/">&divide;</button>
                
                <button type="button" onClick={()=>onButtonClick("(")} className="operator" value="(">(</button>
                <button type="button" onClick={()=>onButtonClick(")")} className="operator" value=")">)</button>
                <button type="button" onClick={()=>onButtonClick("C")} className="operator" value="C">C</button>
                {/* <button type="button" onClick={()=>onButtonClick("all-clear")} className="all-clear" value="all-clear">CE</button> */}
                <button type="button" onClick={()=>onButtonClick("undo")} className="operator" value="undo">U</button>
                
                <button type="button" onClick={()=>onButtonClick("7")} value="7">7</button>
                <button type="button" onClick={()=>onButtonClick("8")} value="8">8</button>
                <button type="button" onClick={()=>onButtonClick("9")} value="9">9</button>
                <button type="button" onClick={()=>onButtonClick("sin")} className="operator" value="sin">Sin</button>

                <button type="button" onClick={()=>onButtonClick("4")} value="4">4</button>
                <button type="button" onClick={()=>onButtonClick("5")} value="5">5</button>
                <button type="button" onClick={()=>onButtonClick("6")} value="6">6</button>
                <button type="button" onClick={()=>onButtonClick("cos")} className="operator" value="cos">Cos</button>
                

                <button type="button" onClick={()=>onButtonClick("1")} value="1">1</button>
                <button type="button" onClick={()=>onButtonClick("2")} value="2">2</button>
                <button type="button" onClick={()=>onButtonClick("3")} value="3">3</button>
                <button type="button" onClick={()=>onButtonClick("tan")} className="operator" value="tan">Tan</button>
                

                <button type="button" onClick={()=>onButtonClick("0")} value="0">0</button>
                <button type="button" onClick={()=>onButtonClick(".")} className="decimal" value=".">.</button>
                {/* <button type="button" onClick={()=>onButtonClick("undo")} className="operator" value="undo">U</button> */}
                <button type="button" onClick={()=>onButtonClick("all-clear")} className="all-clear" value="all-clear">CE</button>

                <button type="button" onClick={()=>onButtonClick("=")} className="equal-sign" value="=">=</button>

            </div>
        </div>
    );
}

export default Home;