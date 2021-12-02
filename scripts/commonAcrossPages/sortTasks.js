function sortTasks(task1, task2) {
    const nameOfTask1 = task1.data()["name"];
    const nameOfTask2 = task2.data()["name"];
    return nameOfTask1.localeCompare(nameOfTask2);
}