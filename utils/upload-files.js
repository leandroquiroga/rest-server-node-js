const path = require("path");
const { v4: uuidv4 } = require("uuid");

const extensionImg = ["jpg", "jpeg", "png", "gif"];
const extensionDocs = ["txt", "md"];
const extensionVideo = ["mp4", 'mov'];


// Uploaded Files 
const uploadFile = (file, uploadPath, rej, res, nameExtension) => {
  file.mv(uploadPath, (err) => {
    if (err) return rej({err});
    
    res(nameExtension);
  });
}

const uploadedAndValidateFiles = ({file}, folder = '') => {

  return new Promise((res, rej) => {
    
    // Get the extension of file
    const nameExtension = file.name.split(".");
    const extension = nameExtension[nameExtension.length - 1];

    // Check if exists the extension
    if ( !extensionImg.includes(extension)
          && !extensionDocs.includes(extension)
            && !extensionVideo.includes(extension) ) 
              return rej({msg: `The extension ${extension} not allowed`})

    // Change name of file
    const nameFileNew = uuidv4() + "." + extension;

    // Maked path file 

    // Create folder assets
    if(extensionImg.includes(extension)){

      let nameFileImg;

      // Save folder users
      if( folder === 'users') {
        nameFileImg = path.join(__dirname, "../uploads", "users" ,nameFileNew);
        uploadFile(file, nameFileImg, rej, res, nameFileNew);
        return
      };

      // Save folder products
      if( folder === 'products') {
        nameFileImg = path.join(__dirname, "../uploads", "products" ,nameFileNew);
        uploadFile(file, nameFileImg, rej, res, nameFileNew);
        return
      };

      // Save folder assets
      nameFileImg = path.join(__dirname, "../uploads", "assets" ,nameFileNew);
      uploadFile(file, nameFileImg, rej, res, nameFileNew);
      return
    };

    // Create folder docs
    if(extensionDocs.includes(extension)){
      const nameFileDocs = path.join(__dirname, "../uploads", "docs" ,nameFileNew);
      uploadFile(file, nameFileDocs, rej, res, nameFileNew);
      return
    };

    // Create folder videos
    if(extensionVideo.includes(extension)){
      const nameFilevoextensionVideo = path.join(__dirname, "../uploads", "video" ,nameFileNew);
      uploadFile(file, nameFilevoextensionVideo, rej, res, nameFileNew);
      return
    };
  });
};

module.exports = uploadedAndValidateFiles;
