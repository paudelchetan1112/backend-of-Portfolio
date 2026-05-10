import Project from "../model/ProjectModel.js";
import User from "../model/userModel.js";
export const CreateProject = async (req, res) => {
  const {
    title,
    description,
    image,
    githubLink,
    liveLink,
    technologies,
    languages,
    category,
    featured,
  } = req.body;
  
  try {
    if (!title)
      return res.status(401).json({
        error: "Project Title is required",
      });
    if (!description)
      return res.status(401).json({
        error: "Project Description is required",
      });
    const newProject = {
      title,
      description,
      image: image || "",
      githubLink: githubLink || "",
      liveLink: liveLink || "",
      technologies: technologies || [],
      languages: languages || [],
      category: category || "web",
      featured: featured || false,
    };
    await Project.create(newProject);
    res.status(201).json({
      message: "new project successfully created",
      project:newProject,
    });
  } catch (error) {
    console.error("Error while creating new project");
    res.status(500).json({
      error: "Error while creating new project",
    });
  }
};
export const GetAllProject=async(req,res)=>{
try {
    const data=await Project.find();
    if(data.length==0){
       return res.status(404).json({
"error":"project not found",

        })
    }
    return res.status(202).json({
        
        "projects":data
    })
} catch (error) {
    console.log("Error while fetching project", error)
    res.status(500).json({
        "error":"Error while fetching data"
    })
}
}

export const DeleteById=async(req,res)=>{
    try {
        const {id}=req.params;
        console.log(id);
        const deletedProject=await Project.findByIdAndDelete({"_id":id});
if(!deletedProject){
    return res.status(401).json({
        "error":"Cannot deleting this project"
    });
}
return res.status(200).json({
    "message":"successfully deleted",
    
})
        
    } catch (error) {
        console.error("Error while deleting this project", error);
        return res.status(500).json({
            "error":"Something went wrong"
        })
        
    }

}
export const GetSingleProject=async(req,res)=>{
    try {
        const {id}=req.params;
        const singleProject=await Project.findById({"_id":id})
        if(!singleProject){
            return res.status(404).json({
                "error":"Cannot find this project"
            })
        }
        return res.status(200).json({
            "message":"sucessfully fetched",
            "project":singleProject
        })
    } catch (error) {
        console.error("Error while fetching single project",error);
        res.status(500).json({
            "error":"something went wrong"
        })
        
    }
}

export const UpdateProject = async (req, res) => {
  const {
    title,
    description,
    image,
    githubLink,
    liveLink,
    technologies,
    languages,
    category,
    featured,
  } = req.body;
  const {id}=req.params;
 
  try {
  const project=await Project.findById(id); 
  if (!project) {
  return res.status(404).json({
    error: "Project not found",
  });
}
    
      project.title=title||project.title;
      project.description=description||project.description;
      project.image=image||project.image;
      project.githubLink=githubLink || project.githubLink;
      project.liveLink=liveLink || project.liveLink;
      project.technologies=technologies || project.technologies;
      project.languages=languages || project.languages;
      project.category=category || project.category;
     project.featured =
  featured !== undefined
    ? featured
    : project.featured;
    
   await project.save();
    res.status(201).json({
      message: "project updated successfully",
     project
    });
  } catch (error) {
    console.error("Error while updating project");
    res.status(500).json({
      error: "Error while updating project",
    });
  }
};