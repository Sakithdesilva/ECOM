import path from "path";
import multer from "multer";
import express from "express";


const router = express.Router();

const storage = multer.diskStorage({
  destination(req,file,cb){
    cb(null,'uploads/');
  },
  filename(req,file,cb){
    const extname = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${extname}`)
  }
})

const fileFilter = (req,file,cb) => {
  const fileTypes = /jpe?g|png|webp/;
  const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = mimeTypes.test(file.mimetype);

  if(mimeType && extname){
    cb(null,true);
  }else{
    cb(new Error("Only jpeg,webp and png are allowed"),false);

  }

} 

const upload = multer({
  storage,
  fileFilter
})

router.post('/',upload.single("image"),(req,res)  => {
  res.send({
    message:"File Uploaded Successfully",
    image:  `/${req.file.path}`
  });

})



export default router;
