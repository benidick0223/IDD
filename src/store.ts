import { create } from "zustand";
import { persist } from "zustand/middleware";
import { routes as seed, acceptedIds, type Question, type Route } from "./data";
import { seedQuestions, seedAnswers } from "./community-seed";
type Answer = {
  id: string;
  questionId: string;
  authorId: string;
  text: string;
  timeAgo: string;
  upvotes: number;
  image?: string;
  imageCaption?: string;
  mapUrl?: string;
  replies: { id: string; text: string; authorId: string }[];
};
// Reports needed before a guide or answer is flagged for moderation.
export const REPORT_LIMIT = 3;
type State = {
  isLoggedIn: boolean;
  hasEntered: boolean;
  seenWelcome: boolean;
  profile: { name: string; email: string };
  reports: Record<string, number>;
  reported: string[];
  promotedIds: string[];
  helpfulIds: string[];
  points: number;
  savedRouteIds: string[];
  compareIds: string[];
  upvoted: string[];
  routes: Route[];
  questions: Question[];
  answers: Record<string, Answer>;
  wizard: any;
  toast: string;
  loginOpen: boolean;
  pending: (() => void) | null;
  filter: { sort: string; time: string; modes: string[] };
  notifications: { title: string; read: boolean; to: string }[];
  recent: string[];
  addToast: (s: string) => void;
  requireLogin: (fn?: () => void) => void;
  login: () => void;
  logout: () => void;
  reset: () => void;
  save: (id: string) => void;
  compare: (id: string) => void;
  upvote: (id: string) => void;
  deleteRoute: (id: string) => void;
  report: (id: string) => void;
  promote: (id: string) => void;
  toggleHelpful: (id: string) => void;
  updateProfile: (p: { name: string; email: string }) => void;
  postQuestion: (q: Question) => void;
  postAnswer: (
    qid: string,
    text: string,
    extra?: { image?: string; imageCaption?: string; mapUrl?: string },
  ) => void;
  accept: (qid: string, aid: string) => void;
  setWizard: (v: any) => void;
};
const defaultAnswers: any = {
  a1: {
    id: "a1",
    questionId: "q1",
    authorId: "u-mika",
    text: "Take the MRT-3 from Cubao to North Avenue. SM North is connected by a covered walkway from the station.",
    timeAgo: "1h ago",
    upvotes: 18,
    replies: [],
  },
  a2: {
    id: "a2",
    questionId: "q1",
    authorId: "u-renz",
    text: "MRT-3 is the easiest. Follow the signs for the SM North walkway.",
    timeAgo: "50m ago",
    upvotes: 8,
    replies: [],
  },
  a3: {
    id: "a3",
    questionId: "q1",
    authorId: "u-carlo",
    text: "You can also take a jeepney, but MRT is faster at peak times.",
    timeAgo: "30m ago",
    upvotes: 4,
    replies: [],
  },
  a4: {
    id: "a4",
    questionId: "q2",
    authorId: "u-jasper",
    text: "Yes, there are still jeeps around 7pm, though they can be less frequent.",
    timeAgo: "3h ago",
    upvotes: 5,
    replies: [
      {
        id: "rep1",
        text: "Thanks! I’ll wait by the main road.",
        authorId: "u-liza",
      },
    ],
  },
  a5: {
    id: "a5",
    questionId: "q2",
    authorId: "u-mika",
    text: "Try the main terminal and ask the dispatcher.",
    timeAgo: "2h ago",
    upvotes: 3,
    replies: [],
  },
  a6: {
    id: "a6",
    questionId: "q2",
    authorId: "u-renz",
    text: "Keep a backup ride in mind after 8pm.",
    timeAgo: "1h ago",
    upvotes: 2,
    replies: [],
  },
};
Object.assign(defaultAnswers, {
  a7: {
    id: "a7",
    questionId: "q3",
    authorId: "u-mika",
    text: "The P2P bus is generally a comfortable option. Check the last departure at the terminal and confirm the schedule on the day.",
    timeAgo: "Yesterday",
    upvotes: 14,
    replies: [],
  },
  a8: {
    id: "a8",
    questionId: "q3",
    authorId: "u-renz",
    text: "Ayala to NAIA services can be limited late at night, so keep a backup ride option.",
    timeAgo: "Yesterday",
    upvotes: 7,
    replies: [],
  },
  a9: {
    id: "a9",
    questionId: "q3",
    authorId: "u-carlo",
    text: "I have used it in the evening. Stay in the well-lit terminal area while waiting.",
    timeAgo: "Yesterday",
    upvotes: 4,
    replies: [],
  },
  a17: {
    id: "a17",
    questionId: "q-own",
    authorId: "u-mika",
    text: "MRT-3 from Cubao to Ayala is a good starting point. From there, use the Makati exit and follow signs for your destination.",
    timeAgo: "45m ago",
    upvotes: 2,
    replies: [],
  },
});
Object.assign(defaultAnswers, {
  a10: {
    id: "a10",
    questionId: "q4",
    authorId: "u-renz",
    text: "Yes, there are jeeps from Pasig Palengke to Ortigas. Look for the 'Ortigas' signboard at the terminal beside the market and ask the dispatcher which bay it loads at.",
    timeAgo: "Yesterday",
    upvotes: 6,
    replies: [],
  },
  a11: {
    id: "a11",
    questionId: "q5",
    authorId: "u-mika",
    text: "Easiest is MRT-3 to Ayala, then a BGC-bound jeepney from the BGC bus and jeepney terminal. About ₱42 and 65 minutes in our route guide.",
    timeAgo: "2 days ago",
    upvotes: 24,
    replies: [],
  },
  a12: {
    id: "a12",
    questionId: "q5",
    authorId: "u-jasper",
    text: "Cheapest is jeepney plus bus at around ₱38, but it takes closer to 100 minutes. Only worth it if you are not in a hurry.",
    timeAgo: "2 days ago",
    upvotes: 11,
    replies: [],
  },
  a13: {
    id: "a13",
    questionId: "q5",
    authorId: "u-carlo",
    text: "If you can spend a bit more, MRT-3 plus the BGC bus via Ayala is more sheltered and beginner friendly, around ₱56.",
    timeAgo: "2 days ago",
    upvotes: 7,
    replies: [],
  },
  a14: {
    id: "a14",
    questionId: "q6",
    authorId: "u-renz",
    text: "Meron po. Sa SM North, hanapin ang jeep na may 'UP Campus' o 'Philcoa' signboard. Mga ₱15 ang pamasahe ayon sa guide.",
    timeAgo: "2 days ago",
    upvotes: 9,
    replies: [],
  },
  a15: {
    id: "a15",
    questionId: "q7",
    authorId: "u-mika",
    text: "Stick to well-lit terminals like One Ayala and avoid empty side streets. The train stops running late, so plan your last ride ahead.",
    timeAgo: "3 days ago",
    upvotes: 5,
    replies: [],
  },
  a16: {
    id: "a16",
    questionId: "q8",
    authorId: "u-carlo",
    text: "Meron, pero kakaunti pa ang biyahe ng 6 AM. UV Express leaves when full, kaya agahan mo para hindi ka maiwan.",
    timeAgo: "3 days ago",
    upvotes: 4,
    replies: [],
  },
});
const start = () => ({
  isLoggedIn: false,
  hasEntered: false,
  seenWelcome: false,
  profile: { name: "Alex Santos", email: "alex@email.com" },
  // sample community reports so the moderation threshold can be demonstrated
  reports: { r8: 2, a5: 2 },
  reported: [],
  promotedIds: [],
  helpfulIds: [],
  points: 320,
  savedRouteIds: [],
  compareIds: ["r1", "r2"],
  upvoted: [],
  routes: seed,
  questions: seedQuestions,
  answers: { ...defaultAnswers, ...seedAnswers },
  wizard: {},
  toast: "",
  loginOpen: false,
  pending: null,
  filter: { sort: "Recommended", time: "Any", modes: [] },
  notifications: [
    {
      title: "Your answer got a helpful upvote! +10 points",
      read: false,
      to: "/community",
    },
    {
      title: "Your route 'Cubao to UP Diliman' is pending review",
      read: false,
      to: "/profile",
    },
    {
      title: "Jasper replied to your question",
      read: true,
      to: "/question/q-own",
    },
    { title: "You reached Level 2", read: true, to: "/rewards" },
  ],
  recent: [
    "Cubao to BGC",
    "SM North to Trinoma",
    "Makati to Las Piñas",
    "Ayala to UP Diliman",
  ],
});
export const useApp = create<State>()(
  persist(
    (set, get) => ({
      ...start(),
      addToast: (toast) => {
        set({ toast });
        setTimeout(() => set({ toast: "" }), 2600);
      },
      requireLogin: (fn) => {
        if (get().isLoggedIn) {
          fn?.();
          return;
        }
        set({ loginOpen: true, pending: fn || null });
      },
      login: () => {
        const fn = get().pending;
        set({
          isLoggedIn: true,
          hasEntered: true,
          seenWelcome: true,
          loginOpen: false,
          pending: null,
        });
        get().addToast("Welcome, Alex!");
        setTimeout(() => fn?.(), 0);
      },
      logout: () => set({ isLoggedIn: false, loginOpen: false }),
      reset: () => {
        set({ ...start() });
        get().addToast("Demo data reset");
      },
      save: (id) => {
        if (!get().isLoggedIn) {
          get().requireLogin(() => get().save(id));
          return;
        }
        const wasSaved = get().savedRouteIds.includes(id);
        set((s) => ({
          savedRouteIds: wasSaved
            ? s.savedRouteIds.filter((x) => x !== id)
            : [...s.savedRouteIds, id],
        }));
        get().addToast(wasSaved ? "Route removed from saved" : "Route saved");
      },
      compare: (id) => {
        const wasCompared = get().compareIds.includes(id);
        if (!wasCompared && get().compareIds.length >= 3) {
          get().addToast("Compare up to 3 routes");
          return;
        }
        set((s) => ({
          compareIds: wasCompared
            ? s.compareIds.filter((x) => x !== id)
            : [...s.compareIds, id],
        }));
        get().addToast(
          wasCompared
            ? "Removed from compare"
            : `Added to compare (${get().compareIds.length}/3)`,
        );
      },
      upvote: (id) => {
        if (!get().isLoggedIn) {
          get().requireLogin(() => get().upvote(id));
          return;
        }
        const was = get().upvoted.includes(id);
        const step = was ? -1 : 1;
        set((s) => ({
          upvoted: was ? s.upvoted.filter((x) => x !== id) : [...s.upvoted, id],
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, upvotes: q.upvotes + step } : q,
          ),
          answers: s.answers[id]
            ? {
                ...s.answers,
                [id]: { ...s.answers[id], upvotes: s.answers[id].upvotes + step },
              }
            : s.answers,
        }));
      },
      // One "Helpful" per account: clicking again takes it back.
      toggleHelpful: (id) => {
        if (!get().isLoggedIn) {
          get().requireLogin(() => get().toggleHelpful(id));
          return;
        }
        const was = get().helpfulIds.includes(id);
        set((s) => ({
          helpfulIds: was
            ? s.helpfulIds.filter((x) => x !== id)
            : [...s.helpfulIds, id],
          routes: s.routes.map((r) =>
            r.id === id
              ? { ...r, helpfulCount: Math.max(0, r.helpfulCount + (was ? -1 : 1)) }
              : r,
          ),
        }));
        get().addToast(was ? "Helpful vote removed" : "Thanks for your feedback!");
      },
      deleteRoute: (id) => {
        set((s) => ({
          routes: s.routes.filter((r) => r.id !== id),
          savedRouteIds: s.savedRouteIds.filter((x) => x !== id),
          compareIds: s.compareIds.filter((x) => x !== id),
        }));
        get().addToast("Route deleted");
      },
      report: (id) => {
        if (!get().isLoggedIn) {
          get().requireLogin(() => get().report(id));
          return;
        }
        if (get().reported.includes(id)) {
          get().addToast("You already reported this");
          return;
        }
        set((s) => ({
          reported: [...s.reported, id],
          reports: { ...s.reports, [id]: (s.reports[id] || 0) + 1 },
        }));
        get().addToast(
          (get().reports[id] || 0) >= REPORT_LIMIT
            ? "Thanks. It's now flagged for review"
            : "Thanks for the report. The community will review it",
        );
      },
      promote: (id) => {
        if (!get().isLoggedIn) {
          get().requireLogin(() => get().promote(id));
          return;
        }
        const was = get().promotedIds.includes(id);
        set((s) => ({
          promotedIds: was
            ? s.promotedIds.filter((x) => x !== id)
            : [...s.promotedIds, id],
        }));
        get().addToast(was ? "Guide promotion removed" : "Guide promoted");
      },
      updateProfile: (profile) => {
        set({ profile });
        get().addToast("Profile updated");
      },
      postQuestion: (q) => {
        set((s) => ({ questions: [q, ...s.questions], points: s.points + 5 }));
        get().addToast("Your question has been posted!");
      },
      postAnswer: (qid, text, extra) => {
        const id = "a" + Date.now();
        set((s) => ({
          answers: {
            ...s.answers,
            [id]: {
              id,
              questionId: qid,
              authorId: "u-alex",
              text,
              ...extra,
              timeAgo: "Just now",
              upvotes: 0,
              replies: [],
            },
          },
          questions: s.questions.map((q) =>
            q.id === qid ? { ...q, answerIds: [...q.answerIds, id] } : q,
          ),
          points: s.points + 10,
        }));
        get().addToast(
          "Your answer has been posted! Thanks for helping the community.",
        );
      },
      accept: (qid, aid) => {
        const q = get().questions.find((x) => x.id === qid);
        if (!q) return;
        const current = acceptedIds(q);
        const was = current.includes(aid);
        const next = was ? current.filter((x) => x !== aid) : [...current, aid];
        set((s) => ({
          questions: s.questions.map((x) =>
            x.id === qid
              ? { ...x, acceptedAnswerIds: next, acceptedAnswerId: next[0] }
              : x,
          ),
          points: s.points + (was ? 0 : 10),
        }));
        get().addToast(
          was ? "Answer unmarked" : "+10 points awarded to the answerer",
        );
      },
      setWizard: (wizard) => set({ wizard }),
    }),
    {
      name: "idd-demo",
      version: 1,
      migrate: (persisted: any) => ({ ...persisted, hasEntered: false }),
      // Guests are asked again on a fresh page load; login state still persists.
      partialize: (state) => ({ ...state, hasEntered: false }),
      // Seed routes always come from data.ts so edits there reach returning visitors;
      // only the helpful count and user-submitted routes are kept from storage.
      merge: (persisted: any, current) => {
        const saved: Route[] = persisted?.routes ?? [];
        const savedById = new Map(saved.map((r) => [r.id, r]));
        const seedIds = new Set(seed.map((r) => r.id));
        // Seed questions come from code (so new ones reach returning visitors);
        // a visitor's own questions and any changes to seed ones are kept.
        const savedQs: Question[] = persisted?.questions ?? [];
        const savedQById = new Map(savedQs.map((q) => [q.id, q]));
        const seedQIds = new Set(seedQuestions.map((q) => q.id));
        return {
          ...current,
          ...persisted,
          questions: [
            ...savedQs.filter((q) => !seedQIds.has(q.id)),
            ...seedQuestions.map((q) => savedQById.get(q.id) ?? q),
          ],
          answers: { ...current.answers, ...(persisted?.answers ?? {}) },
          routes: [
            ...saved.filter((r) => !seedIds.has(r.id)),
            ...seed.map((r) => ({
              ...r,
              helpfulCount: savedById.get(r.id)?.helpfulCount ?? r.helpfulCount,
            })),
          ],
        };
      },
    },
  ),
);
