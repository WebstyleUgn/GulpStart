(function() {
    const a = 11;

    const isEleven = num => num === 11;

    const manyVars = isEleven(a);

    console.log(manyVars, "this is var b");
})()