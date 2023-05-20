import Joi from 'joi';
import { publisherDb } from './index';
import { NotFoundError, ValidationError } from '../errors';
import { uploader } from '../services/uploaderService';

const schema = Joi.object({
  name: Joi.string().min(4).max(64).required(),
  logo: Joi.any().required(),
});

const getPublisher = (id) => publisherDb.getPublisher(id);

const createPublisher = async (props, logoFile) => {
  const fileUploaded = await uploader.uploadFile(logoFile, 'publishers');
  props.logo = fileUploaded;
  const publisher = await publisherDb.createPublisher(props);
  return publisher;
};

const searchPublishers = async (query) => {
  const publishers = await publisherDb.searchPublishers(query);
  const count = await publisherDb.getPublishersCount(query);
  return { publishers, count };
};

const listPublishers = () => publisherDb.listPublishers();

const deletePublisher = async (id) => {
  const publisher = await publisherDb.getPublisher(id);

  if (!publisher) {
    throw new NotFoundError('publisher not found');
  }

  await publisherDb.deletePublisher(id);
  await uploader.delete(publisher.logo.public_id);
};

const updatePublisher = async (id, props, logoFile) => {
  const publisher = await publisherDb.getPublisher(id);

  if (!publisher) {
    throw new NotFoundError('publisher not found');
  }

  if (publisher.logo.url === props.logo) {
    const { logo, ...propsRest } = props;
    const updatedPublisher = await publisherDb.updatePublisher(publisher._id, propsRest);
    return updatedPublisher;
  }

  const fileUploaded = await uploader.upload(logoFile, 'publishers');
  props.logo = fileUploaded;
  await uploader.delete(publisher.logo.public_id);
  const updatedPublisher = await publisherDb.updatePublisher(publisher._id, props);

  return updatedPublisher;
};

export const publisherServices = {
  createPublisher,
  searchPublishers,
  listPublishers,
  deletePublisher,
  updatePublisher,
  getPublisher,
};
