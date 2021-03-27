module.exports = class Task {
    constructor(id, input) {
        this.taskId = id
        this.taskLabel = input
        this.isCompleted = false
        this.isDeleted = false
    }
}