import notesModel from "../../../../DB/model/notes.model.js";
import userModel from "../../../../DB/model/user.model.js";
import cloudinary from "../../../service/cloudinary.js";

export const getNotes = async (req, res) => {
  const errMessage = req.flash("errMessage")[0];
  const oldInput = req.flash("oldInput")[0];
  const notes = await notesModel.find();
  res.render("note", { errMessage, oldInput, notes });
};
export const addNote = async (req, res) => {
  if (!req.file) {
    req.flash("errMessage", "Image required");
    req.flash("oldInput", req.body);
    res.redirect("/api/v1/note");
  } else {
    const { noteBody } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      req.flash("errMessage", "In-valid user");
      req.flash("oldInput", req.body);
      res.redirect("/api/v1/note");
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Notes/${user._id}`,
      });
      const note = await notesModel.create({
        noteBody,
        picture: secure_url,
        createdBy: user._id,
      });
      await userModel.updateOne({_id:user._id},{
        $push: { notes: note._id },
      })
      res.redirect("/api/v1/note");
    }
  }
};
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const note = await notesModel.deleteOne({ _id: id, createdBy: req.user._id });
  await userModel.updateOne({_id:req.user._id},{
    $pull: { notes: note._id },
  })
  res.redirect("/api/v1/note");
};
export const getNoteToUpdate = async (req, res) => {
  const { id } = req.params;
  const note = await notesModel.findOne({ _id: id});
  const errMessage = req.flash("errMessage")[0];
  const oldInput = req.flash("oldInput")[0];
  res.render("updateNote", { note, errMessage, oldInput });
};
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { noteBody } = req.body;
  const note = await notesModel.findOne({ _id: id, createdBy: req.user._id });
  if (!note) {
    res.redirect(`/api/v1/note`);
  } else {
    let image;
    if (!req.file) {
      image = note.picture;
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Notes/${req.user._id}`,
      });
      image = secure_url;
    }
    await notesModel.updateOne(
        { _id: note._id, createdBy: req.user._id },
        {
          noteBody,
          picture: image,
        }
      );
      res.redirect("/api/v1/note");
  }
};
