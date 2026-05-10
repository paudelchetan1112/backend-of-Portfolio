import mongoose from "mongoose";
const projectSchema=new mongoose.Schema({
     title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    liveLink: {
        type: String
    },

    githubLink: {
        type: String
    },

    technologies: [
        {
            type: String
        }
    ],

    languages: [
        {
            type: String
        }
    ],

    category: {
        type: String,
        enum: [
            "web",
            "mobile",
            "desktop",
            "ai",
            "other"
        ],
        default: "web"
    },

    featured: {
        type: Boolean,
        default: false
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });
const Project = mongoose.model(
    "Project",
    projectSchema
);
export default Project;
