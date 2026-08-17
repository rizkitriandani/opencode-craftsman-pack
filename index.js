/**
 * OpenCode Craftsman Pack Plugin
 * Auto-registers skills, agents, and commands when installed as an OpenCode plugin.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CraftsmanPackPlugin = async ({ client, directory }) => {
  const skillsDir = path.resolve(__dirname, '.opencode/skills');

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    }
  };
};

export default CraftsmanPackPlugin;
