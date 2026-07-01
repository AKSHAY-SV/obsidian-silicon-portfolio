export interface EngineeringMetrics {
  lutCount?: string;
  timingSlack?: string;
  area?: string;
  power?: string;
  frequency?: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface ChallengeSolution {
  problem: string;
  solution: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  size: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'ASIC' | 'FPGA' | 'Computer Arch' | 'Verification';
  tagline: string;
  description: string;
  techStack: string[];
  image: string;
  metrics: EngineeringMetrics;
  specs: TechnicalSpec[];
  challenges: ChallengeSolution[];
  files: ProjectFile[];
  codeSnippet: string;
  waveformUrl?: string;
}

export interface TimelineStage {
  id: string;
  name: string;
  description: string;
  status: 'done' | 'active' | 'pending';
  inputFiles: string[];
  outputFiles: string[];
  toolchains: string[];
  notes: string;
}

export interface CommitLog {
  hash: string;
  message: string;
  branch: string;
  timestamp: string;
}

export interface DownloadAsset {
  id: string;
  name: string;
  category: 'RTL' | 'Netlists' | 'Layouts' | 'Waveforms' | 'Specs' | 'Verification';
  icon: 'cpu' | 'code' | 'file-text' | 'layers' | 'waveform';
  version: string;
  size: string;
  status: 'Verified' | 'Encrypted' | 'Restricted';
  fileType: string;
}

export type NavTab = 
  | 'home' 
  | 'about' 
  | 'projects' 
  | 'downloads' 
  | 'resume' 
  | 'contact';
