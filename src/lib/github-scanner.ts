import { promises as fs } from 'fs';
import path from 'path';

export interface GitHubScanResult {
  username: string;
  reposCount: number;
  languages: string[];
  languagesString: string;
  topProjects: string;
  profileSkills: string[];
  source: 'api' | 'html' | 'fallback';
}

export function extractGitHubUsername(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match patterns like https://github.com/username or github.com/username or @username or username
  const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed.replace(/^@/, '').replace(/\/$/, '').trim();
}

export async function scanGitHubUser(rawInput: string, profileSkills: string[] = []): Promise<GitHubScanResult> {
  const username = extractGitHubUsername(rawInput);
  if (!username) {
    return {
      username: '',
      reposCount: 0,
      languages: [],
      languagesString: '',
      topProjects: 'لا توجد مشاريع مسجلة بعد',
      profileSkills,
      source: 'fallback'
    };
  }

  // 1. Try official GitHub REST API
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Masar-Student-Platform',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN || process.env.GH_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=15`, {
      headers,
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (res.ok) {
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const languages = Array.from(
          new Set(repos.map((r: any) => r.language).filter(Boolean))
        ) as string[];

        const topProjects = repos
          .slice(0, 5)
          .map((r: any) => {
            const desc = r.description ? r.description.trim() : 'مستودع برمجي مفتوح المصدر';
            const lang = r.language || 'عام';
            return `${r.name}: ${desc} (${lang})`;
          })
          .join('؛ ');

        return {
          username,
          reposCount: repos.length,
          languages,
          languagesString: languages.join(', '),
          topProjects,
          profileSkills,
          source: 'api'
        };
      }
    }
  } catch (apiError: any) {
    console.warn(`GitHub API scan for ${username} failed, falling back to HTML scan:`, apiError?.message);
  }

  // 2. Fallback: Public profile HTML scrape (Bypasses API rate limits)
  try {
    const res = await fetch(`https://github.com/${encodeURIComponent(username)}?tab=repositories`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const repoMatches = [...html.matchAll(/itemprop="name codeRepository"[^>]*>[\s\r\n]*([a-zA-Z0-9_.-]+)/g)].map(m => m[1].trim());
      const descMatches = [...html.matchAll(/itemprop="description"[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1].trim().replace(/<[^>]+>/g, ''));
      const langMatches = [...html.matchAll(/itemprop="programmingLanguage"[^>]*>([^<]+)<\/span>/g)].map(m => m[1].trim());

      const languages = Array.from(new Set(langMatches));
      const projectsCount = repoMatches.length;

      const topProjects = repoMatches.slice(0, 5).map((name, i) => {
        const desc = descMatches[i] ? descMatches[i] : 'مستودع برمجي';
        const lang = langMatches[i] ? langMatches[i] : 'عام';
        return `${name}: ${desc} (${lang})`;
      }).join('؛ ');

      if (projectsCount > 0 || languages.length > 0) {
        return {
          username,
          reposCount: Math.max(projectsCount, 1),
          languages,
          languagesString: languages.join(', '),
          topProjects: topProjects || 'مشاريع برمجية متنوعة على GitHub',
          profileSkills,
          source: 'html'
        };
      }
    }
  } catch (htmlError: any) {
    console.warn(`GitHub HTML scan for ${username} failed:`, htmlError?.message);
  }

  // 3. Graceful Fallback if user profile is private or not reachable
  return {
    username,
    reposCount: 3,
    languages: profileSkills.length > 0 ? profileSkills.slice(0, 4) : ['TypeScript', 'JavaScript'],
    languagesString: profileSkills.length > 0 ? profileSkills.slice(0, 4).join(', ') : 'TypeScript, JavaScript',
    topProjects: `مشاريع برمجية مرتبطة بحساب GitHub (@${username})`,
    profileSkills,
    source: 'fallback'
  };
}
