"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StaffSchema = new mongoose_1.Schema({
    ParentId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Staff = (0, mongoose_1.model)('Staff', StaffSchema);
exports.default = Staff;
//# sourceMappingURL=staff.js.map