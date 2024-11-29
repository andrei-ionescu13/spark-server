import fs from 'node:fs';
import { PublisherModel } from '../publisher/model';
import { PublisherRepo } from '../publisher/publisherRepo';
import { CloudinaryUploaderService } from '../services/uploaderService';
import { textUtils } from '../utils/textUtils';

const publishers = [
  'Paradox Interactive',
  'SEGA',
  'BANDAI NAMCO Entertainment',
  'Slitherine Ltd.',
  'Plug In Digital',
  'THQ Nordic',
  'Dark Horse Comics',
  'Team17 Digital Ltd',
  'Bethesda Softworks',
  'Dovetail Games',
  'Aspyr',
  'Alawar Entertainment',
  'Disney Interactive',
  'CAPCOM',
  'Devolver Digital',
  'Raw Fury',
  'Warner Bros. Interactive Entertainment',
  '505 Games',
  'Deep Silver',
  'Frontier Developments',
  'Curve Games',
  'Merge Games',
  'KISS ltd',
  'Rebellion',
  'Konami Digital Entertainment',
  'Artifex Mundi',
  'Lucasfilm',
  'Arc System Works',
  'Humongous Entertainment',
  '11 bit studios',
  'Vertigo Games',
  'SCS Software',
  'Focus Entertainment',
  'Jackbox Games Inc.',
  'Playstation PC LLC',
  'Modus Games',
  'Humble Games',
  'Annapurna Interactive',
  'Jagex Ltd',
  'Packt',
  '3D Realms',
  'KOEI TECMO GAMES CO. LTD.',
  'Prime Matter',
  'Skybound Games',
  'Atari',
  'Fatshark',
  'Motorsport Games',
  'Owlcat Games',
  'Rockstar Games',
  'Aksys Games',
  'No Gravity',
  'Zachtronics',
  'Ravenage Games',
  'Austin Dragon',
  'Square Enix',
  'Microsoft Studios',
  'Petroglyph',
  'Dotemu',
  'Shiro Games',
  'gigantumgames',
  'Bungie',
  'Hello Games',
  'An Inkwell of Nectar',
];

export const generatePublishers = async () => {
  const logoFile = fs.readFileSync(__dirname + '/publisher-placeholder.svg', 'utf8');

  const publisherRepo = new PublisherRepo(PublisherModel);
  const uploaderService = new CloudinaryUploaderService();
  const uploadedLogo = await uploaderService.uploadFile(
    { buffer: Buffer.from(logoFile) },
    'publishers',
  );

  const props = publishers.map((genre) => ({
    name: genre,
    slug: textUtils.generateSlug(genre),
    logo: uploadedLogo,
  }));

  const promises = props.map((x) => publisherRepo.createPublisher(x));
  await Promise.all(promises);
  console.log('publishers generated');
};
