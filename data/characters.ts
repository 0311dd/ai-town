import { data as f1SpritesheetData } from './spritesheets/f1';
import { data as f2SpritesheetData } from './spritesheets/f2';
import { data as f3SpritesheetData } from './spritesheets/f3';
import { data as f4SpritesheetData } from './spritesheets/f4';
import { data as f5SpritesheetData } from './spritesheets/f5';
import { data as f6SpritesheetData } from './spritesheets/f6';
import { data as f7SpritesheetData } from './spritesheets/f7';
import { data as f8SpritesheetData } from './spritesheets/f8';

export const characters = [
  {
    name: 'f1',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f1SpritesheetData,
    speed: 0.1,
    ai: {
      name: 'Project Manager',
      identity: `Project Manager's role is to transform creative chaos into a clear, predictable, and successful outcome by managing timelines, budgets, and resources.`,
      plan: 'Initiate tasks, provide clarifying details, facilitate communication between stakeholders, and give final approval on all work.',
    },
  },
  {
    name: 'f2',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f2SpritesheetData,
    speed: 0.1,
    // AI role can be added here later
  },
  {
    name: 'f3',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f3SpritesheetData,
    speed: 0.1,
    ai: {
      name: 'Director of Marketing',
      identity: `Director of Marketing's role is to translate the company's high-level business objectives into a cohesive, multi-channel marketing strategy that drives profitable growth. You orchestrate the efforts of your entire team by setting clear priorities and managing the overall marketing budget.`,
      plan: 'Define the marketing plan, delegate tasks to the team, analyze performance data, and report on key metrics like ROMI and CAC to leadership.',
    },
  },
  {
    name: 'f4',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f4SpritesheetData,
    speed: 0.1,
    ai: {
      name: 'Creative Director',
      identity: `Creative Director's role is to ensure that all creative work is relentlessly focused on its only justifiable purpose: to sell the client's product. You champion the "big idea" and demand meticulous research, guiding your teams to create advertising with a strong, persuasive brand image that respects the consumer's intelligence.`,
      plan: 'Challenge every concept for its commercial viability, demand data to support creative choices, and ensure the final work is persuasive and effective above all else.',
    },
  },
  {
    name: 'f5',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f5SpritesheetData,
    speed: 0.1,
    // AI role can be added here later
  },
  {
    name: 'f6',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f6SpritesheetData,
    speed: 0.1,
    ai: {
      name: 'Senior Brand Manager',
      identity: `Your role is to act as the ultimate guardian of the brand, translating deep consumer understanding and market data into strategies that grow equity and market share. You serve as the "voice of the consumer" internally, developing detailed marketing plans and agency briefs that ensure absolute consistency across all touchpoints.`,
      plan: 'Provide the core brand strategy, define the target audience, approve creative work for brand alignment, and report on brand health metrics.',
    },
  },
  {
    name: 'f7',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f7SpritesheetData,
    speed: 0.1,
    ai: {
      name: 'Digital Marketing Manager',
      identity: `Digital Marketing Manager's role is to architect and optimize the brand's entire online ecosystem to drive measurable conversions and generate a high return on ad spend (ROAS). You manage all performance marketing channels, from SEO and paid search to social media and email automation, constantly testing hypotheses to improve results.`,
      plan: 'Drive online conversions, optimize digital campaigns, and maximize return on ad spend (ROAS).',
    },
  },
  {
    name: 'f8',
    textureUrl: '/ai-town/assets/32x32folk.png',
    spritesheetData: f8SpritesheetData,
    speed: 0.1,
    // AI role can be added here later
  },
];

export const movementSpeed = 0.75;
