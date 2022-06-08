import MarkDownIt from 'markdown-it';

const markdown = new MarkDownIt({
  html: true,
  linkify: true,
});

export default markdown;
