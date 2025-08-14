#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.RESUME_API_URL || 'https://api.resume.michaelborck.dev';
const LOCAL_MODE = process.env.LOCAL_MODE === 'true';

// If in local mode, read from local YAML file instead
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ResumeData {
  personal?: any;
  experience?: any[];
  skills?: any;
  education?: any[];
  projects?: any[];
  [key: string]: any;
}

class ResumeServer {
  private server: Server;
  private resumeData: ResumeData | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'resume-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private async fetchResumeData(): Promise<ResumeData> {
    if (this.resumeData) {
      return this.resumeData;
    }

    try {
      if (LOCAL_MODE) {
        // Read from local YAML file
        const yamlPath = path.join(__dirname, '../../data/cv-data.yml');
        const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
        // Note: In production, you'd use a YAML parser here
        // For now, we'll still fetch from API
        const response = await axios.get(`${API_BASE_URL}/export?format=json`);
        this.resumeData = response.data;
      } else {
        const response = await axios.get(`${API_BASE_URL}/export?format=json`);
        this.resumeData = response.data;
      }
      return this.resumeData!;
    } catch (error) {
      console.error('Failed to fetch resume data:', error);
      throw new Error('Failed to fetch resume data');
    }
  }

  private setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'resume://profile',
            mimeType: 'application/json',
            name: 'Professional Profile',
            description: 'Basic profile information including contact details',
          },
          {
            uri: 'resume://experience',
            mimeType: 'application/json',
            name: 'Work Experience',
            description: 'Complete work history and experience',
          },
          {
            uri: 'resume://skills',
            mimeType: 'application/json',
            name: 'Technical Skills',
            description: 'Programming languages, frameworks, and tools',
          },
          {
            uri: 'resume://education',
            mimeType: 'application/json',
            name: 'Education',
            description: 'Educational background and qualifications',
          },
          {
            uri: 'resume://projects',
            mimeType: 'application/json',
            name: 'Projects',
            description: 'Notable projects and achievements',
          },
          {
            uri: 'resume://full',
            mimeType: 'application/json',
            name: 'Complete Resume',
            description: 'Full resume data in JSON format',
          },
        ],
      };
    });

    // Read specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const data = await this.fetchResumeData();

      let content: any;
      switch (uri) {
        case 'resume://profile':
          content = {
            personal: data.personal,
            summary: data.summary,
          };
          break;
        case 'resume://experience':
          content = data.experience;
          break;
        case 'resume://skills':
          content = data.skills;
          break;
        case 'resume://education':
          content = data.education;
          break;
        case 'resume://projects':
          content = data.projects;
          break;
        case 'resume://full':
          content = data;
          break;
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_experience',
            description: 'Search through work experience by keywords or date range',
            inputSchema: {
              type: 'object',
              properties: {
                keywords: {
                  type: 'string',
                  description: 'Keywords to search for in job titles or descriptions',
                },
                organization: {
                  type: 'string',
                  description: 'Filter by organization name',
                },
              },
            },
          },
          {
            name: 'search_skills',
            description: 'Search for specific skills or skill categories',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Skill category (e.g., programming, web, ai_ml)',
                },
                skill: {
                  type: 'string',
                  description: 'Specific skill to search for',
                },
              },
            },
          },
          {
            name: 'get_contact',
            description: 'Get contact information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'summarize_for_role',
            description: 'Get a summary of relevant experience for a specific role',
            inputSchema: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                  description: 'The role to summarize experience for (e.g., "AI Engineer", "Educator")',
                },
              },
              required: ['role'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const data = await this.fetchResumeData();

      switch (name) {
        case 'search_experience': {
          let results = data.experience || [];
          
          if (args.keywords) {
            const keywords = args.keywords.toLowerCase();
            results = results.filter((exp: any) => 
              JSON.stringify(exp).toLowerCase().includes(keywords)
            );
          }
          
          if (args.organization) {
            results = results.filter((exp: any) =>
              exp.organization?.toLowerCase().includes(args.organization.toLowerCase())
            );
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        }

        case 'search_skills': {
          const skills = data.skills || {};
          let results: any = {};

          if (args.category) {
            results = skills[args.category] || {};
          } else if (args.skill) {
            const searchSkill = args.skill.toLowerCase();
            for (const [category, skillList] of Object.entries(skills)) {
              if (Array.isArray(skillList)) {
                const found = skillList.filter((s: string) => 
                  s.toLowerCase().includes(searchSkill)
                );
                if (found.length > 0) {
                  results[category] = found;
                }
              }
            }
          } else {
            results = skills;
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        }

        case 'get_contact': {
          const contact = {
            name: data.personal?.name,
            email: data.personal?.email,
            phone: data.personal?.phone,
            location: data.personal?.location,
            linkedin: data.personal?.linkedin,
            github: data.personal?.github,
            portfolio: data.personal?.portfolio,
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(contact, null, 2),
              },
            ],
          };
        }

        case 'summarize_for_role': {
          const role = args.role.toLowerCase();
          let summary = {
            role: args.role,
            relevant_experience: [],
            relevant_skills: [],
            key_projects: [],
          };

          // Filter relevant experience
          if (data.experience) {
            summary.relevant_experience = data.experience.filter((exp: any) =>
              JSON.stringify(exp).toLowerCase().includes(role.split(' ')[0])
            );
          }

          // Find relevant skills
          if (role.includes('ai') || role.includes('ml')) {
            summary.relevant_skills = data.skills?.ai_ml || [];
          } else if (role.includes('web') || role.includes('frontend')) {
            summary.relevant_skills = data.skills?.web || [];
          } else if (role.includes('educator') || role.includes('teacher')) {
            summary.relevant_skills = data.skills?.educational || [];
          }

          // Find relevant projects
          if (data.projects) {
            summary.key_projects = data.projects.filter((proj: any) =>
              JSON.stringify(proj).toLowerCase().includes(role.split(' ')[0])
            );
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(summary, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Resume MCP server running on stdio');
  }
}

const server = new ResumeServer();
server.run().catch(console.error);