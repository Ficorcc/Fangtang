import type { APIRoute } from 'astro';
import { friends } from '../../friends';

const LILOG_API = 'https://lilog.cn/is/index.php?action=get_user_feeds&uid=54008&limit=100&token=2bd4eea157becfd45baf299494394392';
const JH_API = 'https://jh.3v.hk/api.php?action=get_all_items&uid=16&token=741afb1d210656544af0490d0824ca6e&limit=200';

function matchFriend(feedTitle: string) {
  const title = feedTitle.toLowerCase().trim();
  for (const friend of friends) {
    const name = friend.name.toLowerCase().trim();
    if (title === name || title.includes(name) || name.includes(title)) {
      return friend;
    }
  }
  return null;
}

async function fetchLilog() {
  try {
    const res = await fetch(LILOG_API, { 
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'BlogReader/1.0' }
    });
    const data = await res.json();
    
    if (data.status === 'success' && data.data) {
      return data.data.map((item: any) => {
        const friend = matchFriend(item.source_title);
        return {
          id: `lilog_${btoa(item.link).slice(-20)}`,
          title: item.title,
          link: item.link,
          date: item.date,
          timestamp: item.timestamp * 1000,
          description: (item.summary || '').replace(/<[^>]+>/g, '').substring(0, 120),
          source: friend?.name || item.source_title,
          sourceUrl: friend?.url || new URL(item.link).origin,
        };
      });
    }
  } catch (e) {
    console.error('Lilog fetch error:', e);
  }
  return [];
}

async function fetchJH() {
  try {
    const res = await fetch(JH_API, { 
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'BlogReader/1.0' }
    });
    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data.map((item: any) => {
        const friend = matchFriend(item.feed_title);
        return {
          id: `jh_${btoa(item.link).slice(-20)}`,
          title: item.title,
          link: item.link,
          date: item.pub_date,
          timestamp: new Date(item.pub_date).getTime(),
          description: (item.description || '').replace(/<[^>]+>/g, '').substring(0, 120),
          source: friend?.name || item.feed_title,
          sourceUrl: friend?.url || new URL(item.link).origin,
        };
      });
    }
  } catch (e) {
    console.error('JH fetch error:', e);
  }
  return [];
}

export const GET: APIRoute = async () => {
  const [lilogArticles, jhArticles] = await Promise.all([
    fetchLilog(),
    fetchJH(),
  ]);
  
  const allArticles = [...lilogArticles, ...jhArticles];
  
  const seen = new Set<string>();
  const uniqueArticles: any[] = [];
  
  for (const article of allArticles) {
    const key = article.link;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticles.push(article);
    }
  }
  
  uniqueArticles.sort((a, b) => b.timestamp - a.timestamp);
  
  const sources = new Set(uniqueArticles.map(a => a.source));
  
  const result = {
    source: '双 API 聚合',
    lilog_count: lilogArticles.length,
    jh_count: jhArticles.length,
    feeds_count: sources.size,
    total: uniqueArticles.length,
    duplicates: allArticles.length - uniqueArticles.length,
    articles: uniqueArticles,
    failed: (lilogArticles.length === 0 ? 1 : 0) + (jhArticles.length === 0 ? 1 : 0),
  };
  
  if (uniqueArticles.length === 0) {
    result.articles = friends.slice(0, 10).map(f => ({
      title: f.name,
      link: f.url,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      description: f.description,
      source: f.name,
      sourceUrl: f.url,
    }));
    result.total = 10;
  }
  
  return new Response(
    JSON.stringify(result, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate'
      }
    }
  );
};
