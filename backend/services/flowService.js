import { FlowRepository } from '../repositories/flowRepository.js';

export class FlowService {
    constructor() {
        this.repository = new FlowRepository();
    }

    async createFlow(userId, data) {
        return await this.repository.create({ ...data, userId });
    }

    async getUserFlows(userId) {
        return await this.repository.findAll({ userId });
    }

    async getFlowById(id) {
        return await this.repository.findById(id);
    }

    // Ensure only the owner can update
    async updateFlow(userId, flowId, data) {
        const flow = await this.repository.findById(flowId);
        if (!flow) throw new Error('Flow not found');

        if (flow.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }

        return await this.repository.update(flowId, data);
    }

    // Ensure only the owner can delete
    async deleteFlow(userId, flowId) {
        const flow = await this.repository.findById(flowId);
        if (!flow) throw new Error('Flow not found');

        if (flow.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }

        return await this.repository.delete(flowId);
    }
}
