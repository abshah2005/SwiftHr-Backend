// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// cloudinary.config({
//   cloud_name: "dvmccihlf",
//   api_key: "143439724258563",
//   api_secret: "yZS0GKhjWuxbysnHae5J-6ZInYE",
// });

// // const uploadonCloudinary=async (localFilePath)=>{

// //     try {
// //         if (!localFilePath) return null;
// //         const response = await cloudinary.uploader.upload(localFilePath, {
// //           resource_type: "auto",
// //         });
// //         fs.unlinkSync(localFilePath);
// //         return response;
// //       } catch (error) {
// //         fs.unlinkSync(localFilePath);
// //         return null;
// //       }
// //     };

// const uploadonCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     fs.unlinkSync(localFilePath);
//     throw new Error("File not uploaded to Cloudinary");
//   }
// };


// export {uploadonCloudinary};


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "dvmccihlf",
  api_key: "143439724258563",
  api_secret: "yZS0GKhjWuxbysnHae5J-6ZInYE",
});

const uploadonCloudinary=async (localFilePath)=>{

    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return response;
      } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
      }
    };

export {uploadonCloudinary};