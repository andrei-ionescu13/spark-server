import cloudinary, { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadFileResponse extends UploadApiResponse {
  publicId: string;
  createdAt: string;
  secureUrl: string;
  originalFilename: string;
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploaderService {
  uploadFile: (file, folder?: string | undefined) => Promise<UploadFileResponse>;
  uploadFiles: (files, folder?: string | undefined) => Promise<UploadFileResponse[]>;
  delete: (publicId: string) => Promise<any>;
  deleteMultiple: (publicIds: string[]) => Promise<any>;
  uploadFromUrl: (
    url: string,
    folder?: string | undefined,
    resource_type?: string,
    public_id?: string,
  ) => Promise<any>;
}

export class CloudinaryUploaderService implements UploaderService {
  uploadFile = (file, folder: string | undefined = undefined): Promise<UploadFileResponse> =>
    new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
          }

          if (result) {
            resolve({
              ...result,
              publicId: result.public_id,
              createdAt: result.created_at,
              secureUrl: result.secure_url,
              originalFilename: result.original_filename,
              resourceType: result.resource_type,
            });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
    });

  uploadFiles = (files: Express.Multer.File[], folder?: string): Promise<UploadFileResponse[]> =>
    Promise.all(files.map((file) => this.uploadFile(file, folder)));

  delete = (publicId): Promise<any> => cloudinary.v2.uploader.destroy(publicId);

  deleteMultiple = (publicIds: string[]) => {
    console.log(publicIds);
    return cloudinary.v2.api.delete_resources(publicIds);
  };

  uploadFromUrl = async (
    url: string,
    folder: string | undefined = undefined,
    resource_type?: any,
    public_id?: any,
  ): Promise<UploadFileResponse> => {
    const result = await cloudinary.v2.uploader.upload(url, {
      folder,
      resource_type,
      public_id,
      overwrite: true,
      invalidate: true,
    });

    return {
      ...result,
      publicId: result.public_id,
      createdAt: result.created_at,
      secureUrl: result.secure_url,
      originalFilename: result.original_filename,
      resourceType: result.resource_type,
    };
  };
}
