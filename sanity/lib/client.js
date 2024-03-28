import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

//import { apiVersion, dataset, projectId, useCdn, token } from '../env'

export const client = createClient({
  apiVersion: '2024-03-02',
  dataset: 'production',
  projectId: '492tg9zk',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);