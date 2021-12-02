/**
 * Format number such that number less than 10 would have a preceding zero.
 * This function would be used to format the number in the input field in the timer.
 * @param {number} num 
 * @returns {string}
 */
function formatNumbers(num){
    const numInStringForm = num.toString()
    if (numInStringForm.length === 1){
        return '0' + numInStringForm;
    }
    return numInStringForm;
}