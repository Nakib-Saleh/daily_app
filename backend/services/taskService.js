import { TaskRepository } from '../repositories/taskRepository.js';

export class TaskService {
    constructor() {
        this.repository = new TaskRepository();
    }

    async getAllTasks() {
        return await this.repository.getAll();
    }

    async addTask(data) {
        return await this.repository.add(data);
    }

    async getTaskById(id) {
        return await this.repository.getById(id);
    }

    async updateTask(id, data) {
        return await this.repository.update(id, data);
    }

    async deleteTask(id) {
        return await this.repository.delete(id);
    }
}
