import { Gist } from './Gist';

export interface ApiGistResult {
  value: Gist[];
  remainingPages: number;
  error: string | null;
}
