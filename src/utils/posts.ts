import { marked } from 'marked';

export interface PostData {
  title: string;
  date: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
}

export interface Post {
  slug: string;
  data: PostData;
  body: string;
  html: string;
  frontmatter: PostData;
  compiledContent: () => string;
}

const postFiles = import.meta.glob('../content/posts/*.md', { eager: true, as: 'raw' }) as Record<string, string>;

function extractFrontmatterAndBody(raw: string): { frontmatter: PostData; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: { title: '', date: '' }, body: raw };
  }
  
  const frontmatterStr = match[1];
  const body = match[2].trim();
  
  const frontmatter: PostData = { title: '', date: '' };
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      if (key === 'title') frontmatter.title = value;
      if (key === 'date') frontmatter.date = value;
      if (key === 'category') frontmatter.category = value;
      if (key === 'excerpt') frontmatter.excerpt = value;
      if (key === 'tags') {
        const tagsMatch = frontmatterStr.match(/tags:\s*\n(\s*-\s*.+\n?)+/g);
        if (tagsMatch) {
          frontmatter.tags = [];
          const tagLines = tagsMatch[0].split('\n').filter(l => l.trim().startsWith('-'));
          tagLines.forEach(tagLine => {
            const tag = tagLine.replace(/^\s*-\s*/, '').trim();
            if (tag) frontmatter.tags!.push(tag);
          });
        }
      }
    }
  });
  
  return { frontmatter, body };
}

export const getAllPosts = (): Post[] => {
  return Object.entries(postFiles).map(([path, rawContent]: [string, string]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { frontmatter, body } = extractFrontmatterAndBody(rawContent);
    const html = marked.parse(body) as string;
    return {
      slug,
      data: frontmatter,
      frontmatter: frontmatter,
      body: body,
      html: html,
      compiledContent: () => html
    };
  });
};

export const getSortedPosts = (): Post[] => {
  return getAllPosts().sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
};

export const getPostsByTag = (tag: string): Post[] => {
  return getSortedPosts().filter(post => 
    post.data.tags?.includes(tag)
  );
};

export const getPostsByCategory = (category: string): Post[] => {
  return getSortedPosts().filter(post => 
    post.data.category === category
  );
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  getAllPosts().forEach(post => {
    post.data.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  getAllPosts().forEach(post => {
    if (post.data.category) {
      categories.add(post.data.category);
    }
  });
  return Array.from(categories).sort();
};
