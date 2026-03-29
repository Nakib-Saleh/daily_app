import { Flow } from '../models/flow.js';

export class FlowRepository {
    async create(data) {
        return await Flow.create(data);
    }

    async findAll(filter = {}) {
        return await Flow.find(filter).sort({ updatedAt: -1 });
    }

    async findById(id) {
        return await Flow.findById(id);
    }

    async update(id, data) {
        return await Flow.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Flow.findByIdAndDelete(id);
    }
}
