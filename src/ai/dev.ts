import { config } from 'dotenv';
config();

import '@/ai/flows/image-resolution-precheck.ts';
import '@/ai/flows/summarize-printing-instructions.ts';
import '@/ai/flows/answer-printing-questions.ts';