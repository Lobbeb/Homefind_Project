import mongoose from "mongoose";

const aiSchema = new mongoose.Schema(
  {
    loan_status: {
      type: Boolean,
      required: false,
    },

    loan_amount: {
        type: Float32Array,
        required: true,
    },

    credit_History: {
        type: Boolean,
        required: true,
    },

    self_employed: {
        type: Boolean,
        required: true,
    },

    applicant_income: {
        type: Int32Array,
        required: true,
    },

    coapplicant_income: {
        type: Int32Array,
        required: false,
        default: 0,
    },

    property_Area: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            const allowedValues = ['urban', 'semiurban', 'rural'];
            return allowedValues.includes(value);
          },
          message: 'Invalid number of dependents',
        },
    },
    
    education: {
        type: Boolean,
        required: true,
    },

    gender: {
      type: Boolean,
      required: true,
    },

    married: {
      type: Boolean,
      required: true,
    },

    dependents: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const allowedValues = ['0', '1', '2', '3+'];
          return allowedValues.includes(value);
        },
        message: 'Invalid number of dependents',
      },
    },

  },
  { timestamps: true }
);

const AI = mongoose.model("AI", aiSchema); // Create model from schema
export default AI; // Export model