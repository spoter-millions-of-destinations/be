import 'reflect-metadata';

import axios from 'axios';
import cheerio from 'cheerio';

import { Post } from '../../db/entities/post.entity';
import { User } from '../../db/entities/user.entity';

const BASE_URL = 'https://danangfantasticity.com/en/attractions';

async function fetchData(url: string) {
  const { data } = await axios.get(url);
  return data;
}

async function parseAttractions(html: string, users: User[]) {
  const $ = cheerio.load(html);
  const attractions: Post[] = [];
  const listingItems = $('.listing-item-blog').toArray();

  for (const element of listingItems) {
    const images: string[] = [];
    const el = $('.item-inner', element);
    const description = $(el).find('.post-summary').text().trim();

    const elDetailUrl = $(el).find('.title a').attr('href');
    if (!elDetailUrl) continue;
    const detailHtml = await fetchData(elDetailUrl);
    if (listingItems.findIndex((item) => item === element) === 2) {
      console.log('detailHtml', detailHtml);
    }

    const $detail = cheerio.load(detailHtml);

    $detail('.entry-content p img').each((_i, el) => {
      const imageUrl = $detail(el).attr('data-src');
      if (imageUrl) images.push(imageUrl);
    });

    const post = new Post();
    post.description = description;
    post.images = images;
    post.userId = users[Math.floor(Math.random() * users.length)].id;

    attractions.push(post);
  }

  return attractions;
}

export async function crawlData(users: User[]) {
  const html = await fetchData(BASE_URL);
  const attractions = await parseAttractions(html, users);
  console.log(attractions);

  // await Post.save(attractions);

  console.log('Data has been saved successfully.');
}

