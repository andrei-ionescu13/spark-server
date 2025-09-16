import { Request, Response } from 'express';
import fs from 'fs';
import { Controller } from '../../../../Controller';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';

export class ExportNamespacesController extends Controller {
  constructor(private useCase: ExportNamespacesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const { filePath, directoryPath } = result.value;

      res.download(filePath, function (err) {
        //remove translations zip and directory after download
        fs.rmSync(filePath, { recursive: true, force: true });
        fs.rmSync(directoryPath, { recursive: true, force: true });
      });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
