/**
 * Compare function for sorting tasks in alphabetical order
 * @param task1 data type would be the data fetched from Firebase
 * @param task2 data type would be the data fetched from Firebase
 * @returns {number }
 */
function sortTasks(task1, task2) {
    const nameOfTask1 = task1.data()["name"];
    const nameOfTask2 = task2.data()["name"];
    return nameOfTask1.localeCompare(nameOfTask2);
}