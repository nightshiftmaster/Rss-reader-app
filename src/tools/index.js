/* eslint-disable import/no-cycle */
import validate from './validator';
import { postsRender, feedsRender } from './renders';
import { loadRss, fetchNewPosts } from './getData';

export {
  validate, postsRender, feedsRender, loadRss, fetchNewPosts,
};
