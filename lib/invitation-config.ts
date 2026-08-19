export interface ScheduleItem {
  time: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InvitationConfig {
  couple: {
    person1: string;
    person2: string;
  };
  event: {
    date: string;
    time: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  ceremony: {
    name: string;
    address: string;
  };
  reception: {
    name: string;
    address: string;
  };
  schedule: ScheduleItem[];
  faq: FaqItem[];
  template: {
    key: string;
    version: number;
  };
  theme: {
    primaryColor: string | null;
  };
  sections: {
    hero: boolean;
    locations: boolean;
    schedule: boolean;
    rsvp: boolean;
    faq: boolean;
  };
}

export const defaultInvitationConfig: InvitationConfig = {
  couple: {
    person1: "",
    person2: "",
  },
  event: {
    date: "",
    time: "",
  },
  hero: {
    title: "Pobieramy się!",
    subtitle: "Będzie nam miło świętować razem z Wami",
  },
  ceremony: {
    name: "",
    address: "",
  },
  reception: {
    name: "",
    address: "",
  },
  schedule: [],
  faq: [],
  template: {
    key: "classic",
    version: 1,
  },
  theme: {
    primaryColor: null,
  },
  sections: {
    hero: true,
    locations: true,
    schedule: true,
    rsvp: true,
    faq: true,
  },
};

export interface EventDraft {
  id: string;
  event_id: string;
  config: InvitationConfig;
  version: number;
  updated_at: string;
}
