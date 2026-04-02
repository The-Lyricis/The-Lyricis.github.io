export interface Messages {
  navigation: {
    home: string;
    about: string;
    services: string;
    skills: string;
    projects: string;
    contact: string;
    resume: string;
  };
  hero: {
    viewProjects: string;
    contact: string;
  };
  about: {
    intro: {
      prefix: string;
      technicalArtist: string;
      connector: string;
      gameDeveloper: string;
      suffix: string;
    };
    summary: string;
    highlights: Record<string, string>;
  };
  manifesto: {
    paragraphs: string[];
    collapse: string;
  };
  services: {
    subtitle: string;
    outputLabel: string;
    capabilities: Record<string, string>;
    pipeline: Record<string, { desc: string; output: string }>;
  };
  experience: {
    descriptions: Record<string, string>;
  };
  projects: {
    categoryLabels: Record<string, string>;
    searchPlaceholder: string;
    shuffleTitle: string;
    emptyState: string;
    clearFilters: string;
    aboutProject: string;
    projectCredits: string;
    technologies: string;
    sourceCode: string;
    liveDemo: string;
    projectPage: string;
  };
  contact: {
    errors: {
      nameRequired: string;
      nameMin: string;
      emailRequired: string;
      emailInvalid: string;
      subjectRequired: string;
      subjectMin: string;
      messageRequired: string;
      messageMin: string;
    };
    toasts: {
      fixErrorsTitle: string;
      fixErrorsDescription: string;
      openedTitle: string;
      openedDescription: string;
    };
    intro: string;
    labels: {
      name: string;
      email: string;
      subject: string;
      message: string;
      emailCard: string;
      location: string;
      availability: string;
    };
    placeholders: {
      name: string;
      email: string;
      subject: string;
      message: string;
    };
    buttons: {
      openDraft: string;
      opening: string;
      draftReady: string;
      failed: string;
    };
    meta: {
      responseTime: string;
      locationValue: string;
      locationAvailability: string;
      availableForNewProjects: string;
      availabilityBody: string;
    };
  };
  footer: {
    email: string;
    linkedin: string;
    copyright: string;
  };
}
