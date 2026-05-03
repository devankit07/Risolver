import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		default: null
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null
	},
	specializations: {
		type: [String],
		default: ['Frontend', 'Backend', 'DevOps']
	},
	customRoles: {
		type: [String],
		default: []
	}
}, { timestamps: true });

const organizationModel = mongoose.model('Organization', organizationSchema);

export default organizationModel;
