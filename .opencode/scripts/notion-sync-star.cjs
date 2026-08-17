#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const NOTION_DATABASE_ID = process.env.NOTION_NOTES_DB_ID || '3f8ee720-5fd7-4fda-b9a0-8b0e60befd1b';
const NOTION_VERSION = '2022-06-28';

function getNotionToken() {
  if (process.env.NOTION_TOKEN) {
    return process.env.NOTION_TOKEN;
  }
  const candidatePaths = [
    path.join(process.env.HOME || '/root', '.opencode', 'opencode.json'),
    path.join(process.env.HOME || '/root', '.config', 'opencode', 'opencode.json')
  ];

  for (const configPath of candidatePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.mcp && config.mcp.notion && config.mcp.notion.environment && config.mcp.notion.environment.NOTION_TOKEN) {
          return config.mcp.notion.environment.NOTION_TOKEN;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

function notionRequest(endpoint, method, payload, token) {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : null;
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      }
    };
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Notion API Error (${res.statusCode}): ${json.message || JSON.stringify(json)}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse Notion response (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function parseMarkdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeLang = 'plain text';
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // close code block
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ type: 'text', text: { content: codeBuffer.join('\n').slice(0, 2000) } }],
            language: codeLang || 'plain text'
          }
        });
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim() || 'plain text';
        if (codeLang.toLowerCase() === 'golang' || codeLang.toLowerCase() === 'go') codeLang = 'go';
        if (codeLang.toLowerCase() === 'js' || codeLang.toLowerCase() === 'javascript') codeLang = 'javascript';
        if (codeLang.toLowerCase() === 'ts' || codeLang.toLowerCase() === 'typescript') codeLang = 'typescript';
        if (codeLang.toLowerCase() === 'sh' || codeLang.toLowerCase() === 'bash') codeLang = 'bash';
        if (codeLang.toLowerCase() === 'json') codeLang = 'json';
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(2).trim().slice(0, 2000) } }]
        }
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(3).trim().slice(0, 2000) } }]
        }
      });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(4).trim().slice(0, 2000) } }]
        }
      });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(2).trim().slice(0, 2000) } }]
        }
      });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(2).trim().slice(0, 2000) } }]
        }
      });
    } else if (/^\d+\.\s/.test(trimmed)) {
      const textContent = trimmed.replace(/^\d+\.\s/, '').trim();
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: textContent.slice(0, 2000) } }]
        }
      });
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: trimmed.slice(0, 2000) } }]
        }
      });
    }
  }

  return blocks;
}

async function syncStarToNotion(data) {
  const token = getNotionToken();
  if (!token) {
    throw new Error('NOTION_TOKEN is not configured in environment or opencode.json');
  }

  const {
    title,
    date = new Date().toISOString().split('T')[0],
    description = '',
    tags = [],
    markdown = '',
    slug,
    workdir = process.cwd()
  } = data;

  if (!title) {
    throw new Error('Title is required');
  }

  // 1. Write local backup to .work-logs
  const safeSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const localDir = path.join(workdir, '.work-logs');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  const localFileName = `${date}-${safeSlug}.md`;
  const localFilePath = path.join(localDir, localFileName);

  const fullMarkdownContent = `# ${title}\n\n**Date:** ${date}\n**Tags:** ${tags.join(', ')}\n**Description:** ${description}\n\n---\n\n${markdown}`;
  fs.writeFileSync(localFilePath, fullMarkdownContent, 'utf8');

  // 2. Prepare Notion Page Properties
  const multiSelectTags = tags.map(tag => ({ name: tag.trim() })).filter(t => t.name.length > 0);

  const pageProperties = {
    Title: {
      title: [{ type: 'text', text: { content: title.slice(0, 2000) } }]
    },
    Date: {
      date: { start: date }
    },
    Description: {
      rich_text: [{ type: 'text', text: { content: description.slice(0, 2000) } }]
    },
    Status: {
      select: { name: 'Completed' }
    }
  };

  if (multiSelectTags.length > 0) {
    pageProperties['Tags 2'] = {
      multi_select: multiSelectTags
    };
  }

  try {
    const spaceName = path.basename(workdir);
    if (spaceName) {
      pageProperties['Space Name'] = {
        rich_text: [{ type: 'text', text: { content: spaceName } }]
      };
    }
  } catch (e) {}

  // 3. Convert Markdown to Notion Blocks
  const allBlocks = parseMarkdownToBlocks(markdown);
  const initialChildren = allBlocks.slice(0, 100);
  const remainingBlocks = allBlocks.slice(100);

  const createPayload = {
    parent: {
      type: 'database_id',
      database_id: NOTION_DATABASE_ID
    },
    icon: {
      type: 'emoji',
      emoji: '🌟'
    },
    properties: pageProperties,
    children: initialChildren
  };

  const createdPage = await notionRequest('/v1/pages', 'POST', createPayload, token);

  // 4. Append remaining blocks if any in chunks of 100
  if (remainingBlocks.length > 0) {
    for (let i = 0; i < remainingBlocks.length; i += 100) {
      const chunk = remainingBlocks.slice(i, i + 100);
      await notionRequest(`/v1/blocks/${createdPage.id}/children`, 'PATCH', { children: chunk }, token);
    }
  }

  return {
    success: true,
    pageId: createdPage.id,
    pageUrl: createdPage.url || `https://notion.so/${createdPage.id.replace(/-/g, '')}`,
    localBackupPath: localFilePath
  };
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--dry-run')) {
    console.log(JSON.stringify({ status: 'ok', message: 'Dry run successful' }));
    process.exit(0);
  }

  let inputData = '';
  if (args.includes('--file')) {
    const fileIndex = args.indexOf('--file') + 1;
    if (fileIndex < args.length) {
      inputData = fs.readFileSync(args[fileIndex], 'utf8');
    }
  } else {
    // Read from stdin
    inputData = await new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
      if (process.stdin.isTTY) {
        resolve('');
      }
    });
  }

  if (!inputData.trim()) {
    console.error(JSON.stringify({ error: 'No input JSON provided. Usage: node notion-sync-star.js --file payload.json or pipe via stdin' }));
    process.exit(1);
  }

  try {
    const payload = JSON.parse(inputData);
    const result = await syncStarToNotion(payload);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, stack: err.stack }));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncStarToNotion, parseMarkdownToBlocks };
