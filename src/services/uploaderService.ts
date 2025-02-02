import cloudinary, { UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploaderService {
  uploadFile: (file, folder?: string | undefined) => Promise<UploadApiResponse | undefined>;
  delete: (publicId: string) => Promise<any>;
  uploadFromUrl: (
    url: string,
    folder?: string | undefined,
    resource_type?: string,
    public_id?: string,
  ) => Promise<any>;
}

export class CloudinaryUploaderService implements UploaderService {
  uploadFile = (
    file,
    folder: string | undefined = undefined,
  ): Promise<UploadApiResponse | undefined> =>
    new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
    });

  delete = (publicId): Promise<any> => cloudinary.v2.uploader.destroy(publicId);

  uploadFromUrl = (
    url: string,
    folder: string | undefined = undefined,
    resource_type?: any,
    public_id?: any,
  ): Promise<any> =>
    cloudinary.v2.uploader.upload(url, {
      folder,
      resource_type,
      public_id,
      overwrite: true,
      invalidate: true,
    });
}
