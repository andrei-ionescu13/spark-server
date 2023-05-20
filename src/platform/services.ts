import { platformDb } from './index';
import { NotFoundError } from '../errors';
import { uploader } from '../services/uploaderService';

const getPlatform = (id) => platformDb.getPlatform(id);

const createPlatform = async (props, logoFile) => {
  const fileUploaded = await uploader.uploadFile(logoFile, 'platforms');
  props.logo = fileUploaded;

  const platform = await platformDb.createPlatform(props);
  return platform;
};

const searchPlatforms = async (query) => {
  const platforms = await platformDb.searchPlatforms(query);
  const count = await platformDb.getPlatformsCount(query);
  return { platforms, count };
};

const listPlatforms = () => platformDb.listPlatforms();

const deletePlatform = async (id) => {
  const platform = await platformDb.getPlatform(id);

  if (!platform) {
    throw new NotFoundError('platform not found');
  }

  await platformDb.deletePlatform(id);
  await uploader.delete(platform.logo.public_id);
};

const updatePlatform = async (id, props, logoFile) => {
  const platform = await platformDb.getPlatform(id);

  if (!platform) {
    throw new NotFoundError('platform not found');
  }

  if (platform.logo.url === props.logo) {
    const { logo, ...propsRest } = props;
    const updatedPlatform = await platformDb.updatePlatform(platform._id, propsRest);
    return updatedPlatform;
  }

  const fileUploaded = await uploader.uploadFile(logoFile, 'platforms');
  props.logo = fileUploaded;
  await uploader.delete(platform.logo.public_id);
  const updatedPlatform = await platformDb.updatePlatform(platform._id, props);

  return updatedPlatform;
};

export const platformServices = {
  createPlatform,
  searchPlatforms,
  listPlatforms,
  deletePlatform,
  updatePlatform,
  getPlatform,
};
