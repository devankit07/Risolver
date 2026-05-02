import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	specializations: {
		type: [String],
		default: ['Frontend', 'Backend', 'DevOps']
	}
}, { timestamps: true });

const organizationModel = mongoose.model('Organization', organizationSchema);

export default organizationModel;
