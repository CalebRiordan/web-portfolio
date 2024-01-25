export interface Project {
  name: string;
  description: string;
  dateCompleted: string;
  thumbnailUrl: string;
  githubLink: string;
  demoLink: string;
}

export interface CreateProjectModel {
  name: string;
  description: string;
  dateCompleted: string;
  thumbnail?: File;
  githubLink: string;
  demoLink: string;
}

export const emptyProject: Project = {
  name: '',
  description: '',
  dateCompleted: '',
  thumbnailUrl: '',
  githubLink: '',
  demoLink: '',
};

export interface ApiProject {
  name: string;
  description: string;
  dateCompleted: string;
  thumbnailUrl: string;
  githubUrl: string;
  demoUrl: string;
}
