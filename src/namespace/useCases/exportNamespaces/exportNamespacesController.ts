import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ExportNamespacesUseCase } from './exportNamespacesUseCase';
import fs from 'fs';

export class ExportNamespacesController extends BaseController {
  constructor(private useCase: ExportNamespacesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const { filePath, directoryPath } = result.value.getValue();

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
