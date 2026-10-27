export interface SupportingSectionItem {
  number: string;
  title: string;
  description: string;
}

export interface ProgrammeDetailField {
  label: string;
  value: string;
}

export interface EventHighlightPhoto {
  id: string;
  imageUrl: string;
  objectPosition: string;
  caption: string;
  label: string;
}

export interface EventProgramData {
  id: 'the-edge' | 'brainbench-spark-it';
  route: '/events/the-edge' | '/events/brainbench-spark-it';
  title: string;
  categoryLabel: string;
  frequencyBadge: string;
  frequency: string;
  subtitle: string;
  shortSummary: string;
  ctaButtonLabel: string;
  heroImageUrl: string;
  heroObjectPosition: string;
  secondaryImageUrl: string;
  secondaryObjectPosition: string;
  mainIntroduction: string[];
  supportingSections: SupportingSectionItem[];
  programmeDetails: ProgrammeDetailField[];
  galleryHighlights: EventHighlightPhoto[];
  previousEditionGalleryUrl?: string;
}

export const THE_EDGE_EVENT_DATA: EventProgramData = {
  id: 'the-edge',
  route: '/events/the-edge',
  title: 'The Edge: Beyond the Classroom',
  categoryLabel: 'BI-WEEKLY GUEST-SPEAKER PROGRAMME',
  frequencyBadge: 'EVERY TWO WEEKS',
  frequency: 'Every two weeks',
  subtitle: 'The lessons that take you further.',
  shortSummary:
    'A bi-weekly guest-speaker programme helping students develop the professional skills, confidence and connections that technical lessons alone cannot teach.',
  ctaButtonLabel: 'Explore The Edge',
  heroImageUrl: '/images/figma/1f2b9b58-clean.jpg',
  heroObjectPosition: '50% 42%',
  secondaryImageUrl: '/images/figma/210ae02d-clean.jpg',
  secondaryObjectPosition: '50% 44%',
  mainIntroduction: [
    'Every two weeks, The Edge brings a guest speaker to our students to talk on a subject that shapes success in tech but never appears in a lesson plan. Our speakers are practitioners and professionals who have built real careers, and they share what they have learned from experience, not from a textbook.',
    'The aim is to give students more than technical skill. Each session helps them build a personal brand, speak with confidence, collaborate effectively and network with purpose, widening their perspective and preparing them for the realities of working in technology, so that they step out of the classroom ready for what comes next.',
  ],
  supportingSections: [
    {
      number: '01',
      title: 'Beyond Technical Skills',
      description:
        'Technology careers require more than the ability to write code or use digital tools. The Edge exposes students to the professional skills, mindset and relationships that support long-term career growth.',
    },
    {
      number: '02',
      title: 'Learn From Real Experience',
      description:
        'Every session features a guest speaker with practical professional experience, sharing lessons and insights gained from building a real career rather than relying solely on textbook knowledge.',
    },
    {
      number: '03',
      title: 'Build Your Professional Edge',
      description:
        'Through the programme, students develop their personal brand, communication confidence, collaboration skills and ability to network purposefully.',
    },
    {
      number: '04',
      title: 'Prepare for the Real World',
      description:
        'The Edge helps students widen their perspective, understand workplace expectations and prepare for opportunities beyond the classroom.',
    },
  ],
  programmeDetails: [
    {
      label: 'Frequency',
      value: 'Every two weeks',
    },
    {
      label: 'Format',
      value: 'Guest-speaker sessions',
    },
    {
      label: 'Audience',
      value: 'Brainbench Technology students',
    },
    {
      label: 'Focus',
      value:
        'Professional development, personal branding, communication, collaboration, networking and career readiness',
    },
  ],
  galleryHighlights: [
    {
      id: 'edge-photo-1',
      imageUrl: '/images/figma/1f2b9b58-clean.jpg',
      objectPosition: '50% 42%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Guest-speaker session at Brainbench Technology sharing practical career insights with students.',
    },
    {
      id: 'edge-photo-2',
      imageUrl: '/images/figma/210ae02d-clean.jpg',
      objectPosition: '50% 44%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Practitioner session helping students build confidence, collaboration skills, and professional readiness.',
    },
    {
      id: 'edge-photo-3',
      imageUrl: '/images/figma/f064034f.jpg',
      objectPosition: '50% 30%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Students engaging in discussion and career preparation at Brainbench Technology.',
    },
    {
      id: 'edge-photo-4',
      imageUrl: '/images/figma/4246adb4.jpg',
      objectPosition: '50% 25%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Collaborative learning and professional development at Brainbench Technology.',
    },
    {
      id: 'edge-photo-5',
      imageUrl: '/images/figma/667d731b.jpg',
      objectPosition: '50% 25%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Focused learning environment preparing students for opportunities beyond the classroom.',
    },
    {
      id: 'edge-photo-6',
      imageUrl: '/images/figma/5a6da7cd.jpg',
      objectPosition: '50% 25%',
      label: 'THE EDGE: BEYOND THE CLASSROOM',
      caption:
        'Students building technical and professional capability at Brainbench Technology.',
    },
  ],
};

export const SPARK_IT_EVENT_DATA: EventProgramData = {
  id: 'brainbench-spark-it',
  route: '/events/brainbench-spark-it',
  title: 'Brainbench Spark It',
  categoryLabel: 'QUARTERLY STUDENT & GRADUATE SHOWCASE',
  frequencyBadge: 'ONCE EVERY QUARTER',
  frequency: 'Once every quarter',
  subtitle: 'Ideas take the stage. Innovation gets challenged.',
  shortSummary:
    'A quarterly showcase where students and graduates present ideas and innovations, receive expert feedback and gain experience defending their work in public.',
  ctaButtonLabel: 'Discover Brainbench Spark It',
  heroImageUrl: '/images/figma/72fcae01.jpg',
  heroObjectPosition: '50% 35%',
  secondaryImageUrl: '/images/figma/2a9182e3.jpg',
  secondaryObjectPosition: '50% 30%',
  mainIntroduction: [
    'Brainbench Spark It is our showcase, held once every quarter. Our newest cohort of students and graduates takes the stage to present the ideas, innovations and solutions they are working on, or hope to work on, before a panel of experts who question them, challenge them and help sharpen their thinking.',
    'The room is open to current students, tech-inclined members of the public, and representatives from other tech academies and hubs. For presenters, it means honest feedback, visibility and the experience of defending an idea in public. For everyone watching, it is a first look at the next generation of builders.',
  ],
  supportingSections: [
    {
      number: '01',
      title: 'Ideas Take the Stage',
      description:
        'Brainbench Spark It gives students and graduates an opportunity to present their ideas, innovations and proposed solutions in front of an audience.',
    },
    {
      number: '02',
      title: 'Expert Feedback That Sharpens Thinking',
      description:
        'A panel of experts questions presenters, challenges their assumptions and helps them refine their ideas through constructive feedback.',
    },
    {
      number: '03',
      title: 'Visibility for Emerging Builders',
      description:
        'Presenters gain exposure, experience speaking publicly about their work, and the opportunity to defend their thinking before an informed audience.',
    },
    {
      number: '04',
      title: 'A Platform for the Tech Community',
      description:
        'Brainbench Spark It welcomes current students, technology enthusiasts, and representatives from other tech academies and innovation hubs, creating an opportunity to discover emerging ideas and connect with future builders.',
    },
  ],
  programmeDetails: [
    {
      label: 'Frequency',
      value: 'Once every quarter',
    },
    {
      label: 'Format',
      value: 'Student and graduate showcase with an expert review panel',
    },
    {
      label: 'Presenters',
      value: 'Students from the newest cohort and graduates',
    },
    {
      label: 'Audience',
      value:
        'Current students, tech-interested members of the public, and representatives of other tech academies and hubs',
    },
    {
      label: 'Focus',
      value:
        'Innovation, idea presentation, constructive critique, public speaking, visibility and community engagement',
    },
  ],
  galleryHighlights: [
    {
      id: 'spark-photo-1',
      imageUrl: '/images/figma/72fcae01.jpg',
      objectPosition: '50% 35%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Live presentation at Brainbench Spark It where presenters share ideas and solutions before the audience.',
    },
    {
      id: 'spark-photo-2',
      imageUrl: '/images/figma/2a9182e3.jpg',
      objectPosition: '50% 30%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Recognition and showcase moment during a quarterly Brainbench Spark It session at Brainbench Technology.',
    },
    {
      id: 'spark-photo-3',
      imageUrl: '/images/figma/ebd8af29.jpg',
      objectPosition: '50% 25%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Students and builders developing ideas and solutions for presentation.',
    },
    {
      id: 'spark-photo-4',
      imageUrl: '/images/figma/6447e921.jpg',
      objectPosition: '50% 25%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Collaborative teamwork and technical preparation at Brainbench Technology.',
    },
    {
      id: 'spark-photo-5',
      imageUrl: '/images/figma/8072bb58.jpg',
      objectPosition: '50% 22%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Interactive demonstration and technical review at Brainbench Technology.',
    },
    {
      id: 'spark-photo-6',
      imageUrl: '/images/figma/8250a39c.jpg',
      objectPosition: '50% 45%',
      label: 'BRAINBENCH SPARK IT SHOWCASE',
      caption:
        'Brainbench Technology community of students, graduates, and builders.',
    },
  ],
  previousEditionGalleryUrl: 'https://photos.app.goo.gl/3SFMhsCuH11XJksu5',
};

export interface UpcomingEventEdition {
  id: string;
  title: string;
  date: string;
  status: 'Upcoming';
  description: string;
  tagline: string;
  flyerImageUrl: string;
  eventRoute: '/events/brainbench-spark-it';
  ctaLabel: string;
  registrationFormUrl: string;
  registrationFormEmbedUrl: string;
  previousEditionGalleryUrl: string;
  previousEditionGalleryLabel: string;
}

export const UPCOMING_SPARK_IT_NOVEMBER_2026: UpcomingEventEdition = {
  id: 'spark-it-november-2026',
  title: 'Brainbench Spark It — November Edition',
  date: 'November 2026',
  status: 'Upcoming',
  description:
    'A quarterly showcase where Brainbench students and graduates present their ideas, innovations, and solutions to an expert panel for challenging and constructive feedback.',
  tagline: 'The Next Generation of Builders.',
  flyerImageUrl: '/assets/aistudio/SPARK_IT_9d1d1986.png',
  eventRoute: '/events/brainbench-spark-it',
  ctaLabel: 'Explore Spark It',
  registrationFormUrl: 'https://forms.gle/h2RuyXGsoTXNP2uv6',
  registrationFormEmbedUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScxsbx67UnhKJrk0a9Op9z3tQetcV4mFHm5NbyNweIZ6azLsg/viewform?embedded=true',
  previousEditionGalleryUrl: 'https://photos.app.goo.gl/3SFMhsCuH11XJksu5',
  previousEditionGalleryLabel: 'Previous Edition Gallery',
};

export const ALL_EVENTS_LIST: EventProgramData[] = [
  THE_EDGE_EVENT_DATA,
  SPARK_IT_EVENT_DATA,
];
