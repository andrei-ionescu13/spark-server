import { keyServices, keyValidation } from './index';
import dotenv from 'dotenv';
dotenv.config();

export const keysController = {
  createKey: async (req, res, next) => {
    const { productId, key: keyValue } = req.body;

    try {
      keyValidation.createKey({ productId, keyValue });
      const key = await keyServices.createKey(productId, keyValue);
      res.json({ id: key._id });
    } catch (error) {
      next(error);
    }
  },
  importKeys: async (req, res, next) => {
    try {
      keyServices.importKeys(req.file);
      res.json({ ok: 'ok' });
    } catch (error) {}
  },
  deleteKey: async (req, res, next) => {
    const { id } = req.params;

    try {
      await keyServices.deleteKey(id);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },
  deleteMultipleKeys: async (req, res, next) => {
    const { ids } = req.body;

    try {
      await Promise.all(ids.map((id) => keyServices.deleteKey(id)));
      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },
  searchKeys: async (req, res, next) => {
    try {
      const result = await keyServices.searchKeys(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  updateKeyStatus: async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      keyValidation.updateKeyStatus({ status });
      const updatedKey = await keyServices.updateKey(id, { status });
      //@ts-ignore
      res.json({ status: updatedKey.status });
    } catch (error) {
      next(error);
    }
  },

  // exportKeys: async (req, res, next) => {
  //   const productsWithKeys = await productDb.listProducts()

  //   const fileName = `${Date.now().toString()}.json`;
  //   const filePath = path.join(process.cwd(), 'public', fileName);
  //   fs.writeFileSync(filePath, JSON.stringify(productsWithKeys));

  //   res.download(filePath, fileName, function (err) {
  //     fs.unlinkSync(filePath);
  //   });
  // },

  // updateKeyStatus: async (req, res) => {
  //   const { id } = req.params;
  //   const props = req.body;
  //   const key = await keyDb.getKey(id)

  //   if (!key) {
  //     res.status(404).send();
  //   }

  //   const updatedKey = await keyDb.updateKey(id, props)
  //   res.json(updatedKey.status)
  // },

  // // updateKey: async (req, res, next) => {
  // //   const { id } = req.params;
  // //   const props = req.body;

  // //   console.log(props)

  // //   const { error } = schema.validate({
  // //     ...props,
  // //     coverImage: props.coverImage || req.file
  // //   });

  // //   if (error) {
  // //     next(new ValidationError(error.message))
  // //     return;
  // //   }

  // //   const key = await keyDb.getKey(id)

  // //   if (!key) {
  // //     res.status(404).send();
  // //     return;
  // //   }

  // //   if (key.status === 'archived') {
  // //     return res.status(400).send({ message: `can't update an archived key` });
  // //   }

  // //   if (key.coverImage === props.coverImage) {
  // //     const updatedKey = await keyDb.updateKey(id, props)
  // //     res.json({ key: updatedKey })

  // //     return;
  // //   }

  // //   const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
  // //     async (error, result) => {
  // //       props.coverImage = result.url;
  // //       props.coverImagePublicId = result.public_id;

  // //       await cloudinary.v2.uploader.destroy(key.coverImagePublicId);
  // //       const updatedKey = await keyDb.updateKey(id, props)

  // //       res.json({ key: updatedKey })
  // //     }
  // //   );

  // //   streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
  // // },

  // // duplicateKey: async (req, res) => {
  // //   const { id } = req.params;
  // //   const key = await keyDb.duplicateKey(id);
  // //   res.status(201).json({ id: key._id })
  // // },

  // // updateKeyMeta: async (req, res, next) => {
  // //   const { id } = req.params;
  // //   const props = req.body;
  // //   const { error } = updateKeyMetaSchema.validate(props);

  // //   if (error) {
  // //     next(new ValidationError(error.message))
  // //     return;
  // //   }

  // //   const key = await keyDb.getKey(id)

  // //   if (key.status === 'archived') {
  // //     return res.status(400).send({ message: `can't update an archived key` });
  // //   }

  // //   await keyDb.updateKey(id, props)
  // //   res.send({ ok: 'ok' })
  // // },

  // // updateKeyStatusAndTag: async (req, res, next) => {
  // //   const { id } = req.params;
  // //   const props = req.body;
  // //   const { error } = updateKeyStatusAndTagSchema.validate(props);

  // //   if (error) {
  // //     next(new ValidationError(error.message))
  // //     return;
  // //   }

  // //   const key = await keyDb.getKey(id)

  // //   if (key.status === 'archived' && props.status === 'archived') {
  // //     return res.status(400).send({ message: `can't update an archived key` });
  // //   }

  // //   const updatedKey = await keyDb.updateKey(id, props)
  // //   const { status, tag } = updatedKey;

  // //   res.json({ status, tag })
  // // },

  // // updateKeyDetails: async (req, res, next) => {
  // //   const { id } = req.params;
  // //   const props = req.body;

  // //   const { error } = updateKeyDetailsSchema.validate({
  // //     ...props,
  // //     coverImage: props.coverImage || req.file
  // //   });

  // //   if (error) {
  // //     next(new ValidationError(error.message))
  // //     return;
  // //   }

  // //   const key = await keyDb.getKey(id)

  // //   if (!key) {
  // //     res.status(404).send();
  // //     return;
  // //   }

  // //   if (key.status === 'archived') {
  // //     return res.status(400).send({ message: `can't update an archived key` });
  // //   }

  // //   if (key.coverImage === props.coverImage) {
  // //     const updatedKey = await keyDb.updateKey(id, props)

  // //     res.json({
  // //       description: updatedKey.description,
  // //       title: updatedKey.title,
  // //       slug: updatedKey.slug,
  // //       markdown: updatedKey.markdown,
  // //       coverImage: updatedKey.coverImage,
  // //     })
  // //     return;
  // //   }

  // //   const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
  // //     async (error, result) => {
  // //       props.coverImage = result.url;
  // //       props.coverImagePublicId = result.public_id;

  // //       await cloudinary.v2.uploader.destroy(key.coverImagePublicId);
  // //       const updatedKey = await keyDb.updateKey(id, props)

  // //       res.json({
  // //         description: updatedKey.description,
  // //         title: updatedKey.title,
  // //         slug: updatedKey.slug,
  // //         markdown: updatedKey.markdown,
  // //         coverImage: updatedKey.coverImage,
  // //       })
  // //     }
  // //   );

  // //   streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
  // // },

  // searchKeyKeys: async (req, res) => {
  //   const { id } = req.params;
  //   const keys = await keyDb.searchKeyKeys(id, req.query);

  //   res.json(keys)
  // },

  // deleteKeyKey: async (req, res) => {
  //   const { id, keyId } = req.params;
  //   await keyDb.deleteKeyKey(id, keyId);

  //   res.json({ ok: 'ok' })
  // },

  // addKeyKey: async (req, res) => {
  //   const { id } = req.params;
  //   const { key } = req.body;

  //   await keyDb.addKeyKey(id, key);

  //   res.json({ ok: 'ok' })
  // }
};
