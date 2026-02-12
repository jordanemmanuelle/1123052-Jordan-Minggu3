import { useCallback, useEffect, useMemo, useState } from "react";


export const LearningHooks = () => {
    const [counter, setCounter] = useState(0);
    const [counter2, setCount2] = useState(0);
    const [myArray] = useState([5, 4, 1, 2]);
    
    function sortMyArray(arr: number[]) {
        checkRender("Sort Array");
        return arr.sort();
    }
    
    const sortedArray = sortMyArray(myArray);
    console.log(sortedArray);
    

    checkRender("-");

    const updatedCounter = useMemo(() => {
        checkRender("UpdatedCounter");
        return counter * 13;
    }, [counter]);

    const updatedCounter2 = useMemo(() => {
        checkRender("UpdatedCounter2");
        return counter2 * 19;
    }, [counter2]);

    useEffect(() => {
        checkRender("Update Counter 2: " + counter2);
    }, [counter2]);

    const reset = useCallback(() => {
        checkRender("GAYSEN");
        setCounter(0);
        setCount2(0);
    }, []);

    // useEffect(() => {
    //     if (counter2 >= 3 && counter >= 3) {
    //         reset();
    //     }
    // }, [counter, counter2, reset]);

    const checking =(a: number) => {
        console.log("Checking Called");
        return a >= 3;
    }

    if (checking(counter) && checking(counter2)) {
        console.log("Reset");
        reset();
    }

    return (   
        <div>
            <h1> LearningHooks </h1>
            <button onClick={() => setCounter(counter + 1)}> Increment Counter 1: {counter} </button>
            <button onClick={() => setCount2(counter2 + 1)}> Increment Counter 2: {counter2} </button>
            <button onClick={reset}> Reset </button>
            <br />
            <p> Updated Counter 1 (multiplied by 13): {updatedCounter} </p>
            <p> Updated Counter 2 (multiplied by 19): {updatedCounter2} </p>
        </div>
    );
}

function checkRender(label: string) {
    console.log("Rendering", label, Math.random());
}