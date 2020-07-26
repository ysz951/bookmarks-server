CREATE TYPE article_category AS ENUM (
    'Listicle',
    'How-to',
    'News',
    'Interview',
    'Story'
);

ALTER TABLE bookmarks
  ADD COLUMN
    style article_category;
    update bookmarks set style = 'Story' where rating = '5';