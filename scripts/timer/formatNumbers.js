function formatNumbers(num){
    const numInStringForm = num.toString()
    if (numInStringForm.length === 1){
        return '0' + numInStringForm;
    }
    return numInStringForm;
}