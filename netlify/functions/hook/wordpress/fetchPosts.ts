import fetchEntries from './api';
import { filterObject } from '../helpers';

const WHITELIST = [
  'id',
  'date',
  'modified',
  'slug',
  'status',
  'type',
  'title',
  'excerpt',
  'content',
  'content_sanitized',
  'attachments',
  'author',
  'categories',
  'tags',
];

export type Attachment = {
  alt: string;
  caption: string;
  height: number;
  id: number;
  meta: {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: string[];
  };
  mimetype: string;
  post_date: string;
  post_modified: string;
  source: string;
  title: string;
  width: number;
};

export type Post = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
    /* Only available when using Refined REST plugin on Wordpress */
    plaintext?: string;
  };
  /* Only available when using Refined REST plugin on Wordpress */
  attachments?: Attachment[];
  author: string;
  categories: string[];
  tags: string[];
};

export default async (): Promise<Post[]> =>
  fetchEntries<Post>()().then((posts) =>
    posts.map((post) => {
      const {
        content,
        content_sanitized,
        ...rest
      }: Post & {
        content_sanitized?: { rendered: string; plaintext: string };
      } = filterObject(post, WHITELIST, false);

      return {
        ...rest,
        content: content_sanitized ?? content,
      };
    }),
  );
