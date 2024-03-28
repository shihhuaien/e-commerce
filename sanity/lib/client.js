import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import { apiVersion, dataset, projectId, useCdn, token } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token,
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);