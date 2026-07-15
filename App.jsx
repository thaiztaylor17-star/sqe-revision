import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, Moon, Sun, Flame, Target, Clock, TrendingUp, ChevronLeft, ChevronRight, RotateCcw, Check, X, BookOpen, Layers, ListChecks, Timer as TimerIcon, Home, Menu } from "lucide-react";

/* ---------------------------------------------------------
   SEED CONTENT — Contract Law (FLK1)
   Mixed flashcards + SBA-style single-best-answer questions
--------------------------------------------------------- */
const SEED_CARDS = [
  { id: "c001", subject: "FLK1", topic: "Contract Formation", type: "flip",
    front: "What are the requirements for a valid offer?",
    back: "A definite promise to be bound, communicated to the offeree, capable of acceptance without further negotiation. Distinguish from an invitation to treat (e.g. goods in a shop window — Fisher v Bell).",
    tags: ["offer", "Fisher v Bell"] },
  { id: "c002", subject: "FLK1", topic: "Contract Formation", type: "flip",
    front: "Is an advertisement generally an offer or an invitation to treat?",
    back: "Generally an invitation to treat, UNLESS it is a unilateral offer to the world showing clear intent to be bound on performance — Carlill v Carbolic Smoke Ball Co.",
    tags: ["Carlill v Carbolic Smoke Ball"] },
  { id: "c003", subject: "FLK1", topic: "Contract Formation", type: "sba",
    front: "A shopkeeper displays a jacket in the window priced at £50. A customer enters and tries to 'accept' at that price, but the shopkeeper refuses to sell. Which best describes the legal position?",
    options: [
      "The shopkeeper is in breach of contract as the display was a binding offer.",
      "The display was an invitation to treat; the customer's attempt was an offer the shopkeeper is free to reject.",
      "The display was a unilateral offer accepted by entering the shop.",
      "The contract was formed when the jacket was displayed with a price tag."
    ],
    answer: 1,
    explanation: "Goods displayed in a shop window or on a shelf are an invitation to treat, not an offer (Fisher v Bell; Pharmaceutical Society of GB v Boots). The customer makes the offer; the shopkeeper may refuse it.",
    tags: ["Fisher v Bell", "Boots"] },
  { id: "c004", subject: "FLK1", topic: "Contract Formation", type: "flip",
    front: "What is the 'postal rule' and when does it apply?",
    back: "Acceptance by post is effective on posting, not receipt (Adams v Lindsell), provided post was a reasonable/contemplated method and the letter was properly stamped and addressed. Does not apply to instantaneous communications (email, telex — Entores v Miles Far East).",
    tags: ["Adams v Lindsell", "Entores"] },
  { id: "c005", subject: "FLK1", topic: "Contract Formation", type: "sba",
    front: "A offers to sell goods to B by letter. B posts a letter of acceptance. Before B's letter arrives, A telephones B to revoke the offer. Is there a contract?",
    options: [
      "No — revocation is effective once communicated, regardless of the acceptance.",
      "Yes — acceptance was complete on posting, before the revocation was communicated.",
      "No — the postal rule does not apply to revocations.",
      "Yes, but only if B can prove the letter was properly stamped."
    ],
    answer: 1,
    explanation: "Under the postal rule, acceptance is effective on posting (Adams v Lindsell). Revocation must be communicated to be effective (Byrne v Van Tienhoven). B's acceptance took effect before A's revocation reached B, so a contract exists.",
    tags: ["postal rule", "Byrne v Van Tienhoven"] },
  { id: "c006", subject: "FLK1", topic: "Consideration", type: "flip",
    front: "Define 'consideration' in English contract law.",
    back: "Something of value in the eyes of the law, moving from the promisee, given in exchange for the promise. Must be sufficient but need not be adequate (Chappell v Nestlé — chocolate wrappers were sufficient consideration).",
    tags: ["Chappell v Nestlé"] },
  { id: "c007", subject: "FLK1", topic: "Consideration", type: "flip",
    front: "Is performance of an existing contractual duty owed to the SAME party good consideration for a new promise?",
    back: "Generally no (Stilk v Myrick). BUT if the promisor obtains a practical benefit and there is no economic duress, it can suffice (Williams v Roffey Bros).",
    tags: ["Stilk v Myrick", "Williams v Roffey"] },
  { id: "c008", subject: "FLK1", topic: "Consideration", type: "sba",
    front: "A builder is behind schedule on a fixed-price contract. The client promises extra payment if the builder finishes on time, hoping to avoid penalty clauses in the client's own contracts with third parties. The builder finishes on time. Is the client's promise of extra payment enforceable?",
    options: [
      "No — the builder was only doing what the contract already required.",
      "Yes — the client obtained a practical benefit and there is no evidence of duress (Williams v Roffey).",
      "No — consideration must move from the promisor, not the promisee.",
      "Yes, but only if the promise was made under seal."
    ],
    answer: 1,
    explanation: "Following Williams v Roffey Bros, a promise to pay more for existing contractual duties can be enforceable if the promisor receives a practical benefit (here, avoiding penalty clauses) and there is no economic duress.",
    tags: ["Williams v Roffey"] },
  { id: "c009", subject: "FLK1", topic: "Consideration", type: "flip",
    front: "What is 'promissory estoppel' and what does it NOT do?",
    back: "An equitable doctrine preventing a party from going back on a promise not to enforce strict legal rights where the other party relied on it (Central London Property Trust v High Trees House). It is a shield, not a sword — cannot create a new cause of action (Combe v Combe).",
    tags: ["High Trees", "Combe v Combe"] },
  { id: "c010", subject: "FLK1", topic: "Terms", type: "flip",
    front: "Distinguish a condition, a warranty, and an innominate term.",
    back: "Condition: a term so central that breach entitles the innocent party to terminate + damages. Warranty: a minor term — breach gives damages only. Innominate term: classification depends on the seriousness of the consequences of the actual breach (Hong Kong Fir Shipping).",
    tags: ["Hong Kong Fir Shipping"] },
  { id: "c011", subject: "FLK1", topic: "Terms", type: "sba",
    front: "A charterparty contains a term that the ship must be 'seaworthy'. The ship has a defect causing a 20-week delay out of a 2-year charter. Which approach should a court take to classify the term?",
    options: [
      "Automatically treat it as a condition because seaworthy is a technical term.",
      "Treat it as an innominate term and assess whether the breach deprived the innocent party of substantially the whole benefit of the contract.",
      "Automatically treat it as a warranty since delay, not destruction, occurred.",
      "Classify it based solely on the label the parties gave it in the contract."
    ],
    answer: 1,
    explanation: "Following Hong Kong Fir Shipping, 'seaworthiness' clauses are typically innominate terms — the remedy depends on the practical consequences of the breach, not a fixed label.",
    tags: ["Hong Kong Fir Shipping", "innominate terms"] },
  { id: "c012", subject: "FLK1", topic: "Misrepresentation", type: "flip",
    front: "What are the three types of misrepresentation and their key remedies?",
    back: "Fraudulent (deceit; damages under tort measure + rescission), Negligent under s.2(1) Misrepresentation Act 1967 (damages as if fraudulent, reversed burden of proof, + rescission), Innocent (rescission, or damages in lieu under s.2(2)).",
    tags: ["Misrepresentation Act 1967"] },
  { id: "c013", subject: "FLK1", topic: "Misrepresentation", type: "sba",
    front: "A seller carelessly tells a buyer a car has never been in an accident, believing this to be true but without reasonable grounds. The buyer relies on this and buys the car at a loss. Which type of misrepresentation is this most likely to be?",
    options: [
      "Fraudulent misrepresentation.",
      "Negligent misrepresentation under s.2(1) Misrepresentation Act 1967.",
      "Innocent misrepresentation only.",
      "Not misrepresentation, as no written contract term was breached."
    ],
    answer: 1,
    explanation: "The statement was false, induced the contract, and the maker had no reasonable grounds to believe it true — this is negligent misrepresentation under s.2(1), which reverses the burden of proof onto the representor.",
    tags: ["s.2(1) Misrepresentation Act 1967"] },
  { id: "c014", subject: "FLK1", topic: "Discharge & Remedies", type: "flip",
    front: "What is the doctrine of frustration and what does it NOT cover?",
    back: "A contract is frustrated when, after formation, an unforeseen event makes performance impossible, illegal, or radically different (Taylor v Caldwell). It does NOT cover events merely making performance more expensive or difficult (Davis Contractors v Fareham UDC), nor self-induced frustration.",
    tags: ["Taylor v Caldwell", "Davis Contractors"] },
  { id: "c015", subject: "FLK1", topic: "Discharge & Remedies", type: "sba",
    front: "What is the primary aim of an award of damages for breach of contract?",
    options: [
      "To punish the party in breach.",
      "To put the innocent party in the position they would have been in had the contract been performed (expectation loss).",
      "To restore both parties to their pre-contract position only.",
      "To award a fixed statutory sum regardless of loss."
    ],
    answer: 1,
    explanation: "Contract damages are compensatory, aimed at expectation loss — putting the claimant in the position as if the contract had been properly performed, subject to remoteness (Hadley v Baxendale) and mitigation.",
    tags: ["Hadley v Baxendale", "expectation loss"] },
];

const SUBJECTS = {
  FLK1: ["Contract Law", "Tort", "Constitutional & Administrative Law", "EU Law & Legal Systems", "Trusts", "Criminal Law"],
  FLK2: ["Business Law & Practice", "Dispute Resolution", "Property Practice", "Wills & Estate Admin", "Solicitors Accounts", "Land Law"],
};

const TOPIC_MAP = SEED_CARDS.reduce((acc, c) => {
  acc[c.topic] = acc[c.topic] || { subject: c.subject, count: 0 };
  acc[c.topic].count++;
  return acc;
}, {});

/* ---------------------------------------------------------
   Spaced repetition (light SM-2)
--------------------------------------------------------- */
function scheduleNext(prog, quality) {
  // quality: 0 = need review, 1 = know it
  let { ease = 2.5, interval = 0, reps = 0 } = prog || {};
  if (quality === 0) {
    reps = 0;
    interval = 0.02; // ~30 min, show again soon
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    ease = Math.min(3.0, ease + 0.05);
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ease);
  }
  const next = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ease, interval, reps, nextReview: next, lastSeen: Date.now(), quality };
}

function isDue(prog) {
  if (!prog) return true;
  return Date.now() >= prog.nextReview;
}

/* ---------------------------------------------------------
   Storage helpers
--------------------------------------------------------- */
const STORE_KEY = "sqe-progress-v1";
const GOAL_KEY = "sqe-daily-goal-v1";
const STREAK_KEY = "sqe-streak-v1";

async function loadProgress() {
  try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : {}; } catch { return {}; }
}
async function saveProgress(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}
async function loadStreak() {
  try { const v = localStorage.getItem(STREAK_KEY); return v ? JSON.parse(v) : { count: 0, lastDate: null, todayDone: 0 }; } catch { return { count: 0, lastDate: null, todayDone: 0 }; }
}
async function saveStreak(data) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch {}
}
async function loadGoal() {
  try { const v = localStorage.getItem(GOAL_KEY); return v ? JSON.parse(v) : 20; } catch { return 20; }
}
async function saveGoal(n) {
  try { localStorage.setItem(GOAL_KEY, JSON.stringify(n)); } catch {}
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

/* ---------------------------------------------------------
   UI atoms
--------------------------------------------------------- */
function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-[var(--border-soft)] text-[var(--accent)] border-[var(--border)]",
    know: "bg-[var(--know-bg2)] text-[var(--know-text)] border-[var(--know-border)]",
    review: "bg-[var(--review-bg2)] text-[var(--review-text)] border-[var(--review-border)]",
  };
  return <span className={`text-[10px] tracking-[0.12em] uppercase px-2 py-1 rounded-sm border font-medium ${tones[tone]}`}>{children}</span>;
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2.5 transition-colors ${active ? "text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-mid)]"}`}>
      <Icon size={20} strokeWidth={1.75} />
      <span className="text-[10px] tracking-wide font-medium">{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------
   Flip Card view (deck study mode)
--------------------------------------------------------- */
function StudyDeck({ cards, progress, onRate, dark }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx];

  useEffect(() => { setFlipped(false); }, [idx]);

  if (!cards.length) {
    return (
      <div className="text-center py-20 text-[var(--text-dim)]">
        <Layers size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nothing due right now. Come back later, or browse all cards below.</p>
      </div>
    );
  }

  const rate = (q) => {
    onRate(card.id, q);
    if (idx < cards.length - 1) setIdx(idx + 1);
    else setIdx(0);
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="flex items-center justify-between w-full max-w-md mb-3 text-xs text-[var(--text-dim)]">
        <span className="tracking-wide uppercase">{card.topic}</span>
        <span>{idx + 1} / {cards.length}</span>
      </div>

      <div
        onClick={() => setFlipped(f => !f)}
        className="relative w-full max-w-md h-72 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-[var(--accent)] text-[var(--bg)] text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1">
              {card.subject}
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="font-serif text-lg leading-snug text-[var(--text)]">{card.front}</p>
            </div>
            <p className="text-center text-[10px] text-[var(--text-dim)] tracking-wide uppercase">Tap to reveal</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-sm border border-[var(--accent)]/40 bg-[var(--surface2)] p-6 flex flex-col overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="font-sans text-sm leading-relaxed text-[var(--text-soft)]">{card.back}</p>
            {card.tags && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {card.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="flex gap-3 mt-6 w-full max-w-md">
          <button onClick={() => rate(0)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border border-[var(--review-border)] bg-[var(--review-bg)] text-[var(--review-text)] text-sm font-medium hover:bg-[var(--review-bg2)] transition-colors">
            <RotateCcw size={15} /> Need review
          </button>
          <button onClick={() => rate(1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border border-[var(--know-border)] bg-[var(--know-bg)] text-[var(--know-text)] text-sm font-medium hover:bg-[var(--know-bg2)] transition-colors">
            <Check size={15} /> Know it
          </button>
        </div>
      ) : (
        <div className="mt-6 h-[52px] flex items-center text-xs text-[var(--text-faint)]">Flip the card to rate your recall</div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   SBA Quiz view (timed MCQ)
--------------------------------------------------------- */
function SbaQuiz({ cards, timed, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!timed) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timed]);

  const q = cards[idx];
  if (!q) {
    return (
      <div className="text-center py-16">
        <ListChecks size={32} className="mx-auto mb-3 text-[var(--text-dim)] opacity-40" />
        <p className="text-sm text-[var(--text-dim)]">No SBA questions available for this selection yet.</p>
      </div>
    );
  }

  const choose = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (idx < cards.length - 1) {
      setIdx(idx + 1); setSelected(null); setRevealed(false);
    } else {
      clearInterval(timerRef.current);
      onFinish(score + (selected === q.answer ? 0 : 0), cards.length, seconds);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-3">
        <span>Question {idx + 1} / {cards.length}</span>
        {timed && <span className="flex items-center gap-1 text-[var(--accent)]"><TimerIcon size={13} /> {mm}:{ss}</span>}
      </div>
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5">
        <Badge>{q.topic}</Badge>
        <p className="font-serif text-base leading-snug text-[var(--text)] mt-3 mb-4">{q.front}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let style = "border-[var(--border)] bg-[var(--nav)] text-[var(--text-soft)] hover:border-[var(--text-faint)]";
            if (revealed) {
              if (i === q.answer) style = "border-[var(--know-border)] bg-[var(--know-bg)] text-[var(--know-text)]";
              else if (i === selected) style = "border-[var(--review-border)] bg-[var(--review-bg)] text-[var(--review-text)]";
              else style = "border-[var(--border-mid)] bg-[var(--nav)] text-[var(--text-dim)]";
            }
            return (
              <button key={i} onClick={() => choose(i)}
                className={`text-left text-sm px-4 py-3 rounded-sm border transition-colors ${style}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs uppercase tracking-wide text-[var(--accent)] mb-1.5">Explanation</p>
            <p className="text-sm text-[var(--text-soft)] leading-relaxed">{q.explanation}</p>
            <button onClick={next}
              className="mt-4 w-full py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors">
              {idx < cards.length - 1 ? "Next question" : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Search view
--------------------------------------------------------- */
function SearchView({ query, setQuery }) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEED_CARDS.filter(c =>
      c.front.toLowerCase().includes(q) ||
      c.back?.toLowerCase().includes(q) ||
      c.tags?.some(t => t.toLowerCase().includes(q)) ||
      c.topic.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search a case, statute, or concept…"
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm pl-9 pr-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
      {query.trim() && results.length === 0 && (
        <p className="text-sm text-[var(--text-dim)] text-center py-8">No matches for "{query}". Try a case name, statute, or topic.</p>
      )}
      <div className="flex flex-col gap-3">
        {results.map(c => (
          <div key={c.id} className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge>{c.subject}</Badge>
              <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">{c.topic}</span>
            </div>
            <p className="text-sm font-medium text-[var(--text)] mb-1">{c.front}</p>
            <p className="text-xs text-[var(--text-mid)] leading-relaxed">{c.back || c.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard
--------------------------------------------------------- */
function Dashboard({ progress, streak, goal, setGoal, dueCount, totalCards, onGo }) {
  const knownCount = Object.values(progress).filter(p => p.quality === 1).length;
  const reviewCount = Object.values(progress).filter(p => p.quality === 0).length;
  const pct = totalCards ? Math.round((knownCount / totalCards) * 100) : 0;
  const goalPct = Math.min(100, Math.round((streak.todayDone / goal) * 100));

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] bg-gradient-to-br from-[var(--surface2)] to-[var(--nav)] rounded-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)]">SQE Revision</p>
          <div className="flex items-center gap-1 text-[var(--accent)]"><Flame size={14} /><span className="text-sm font-semibold">{streak.count}</span></div>
        </div>
        <p className="font-serif text-2xl text-[var(--text)]">Welcome back, Tai.</p>
        <p className="text-sm text-[var(--text-mid)] mt-1">{dueCount} card{dueCount === 1 ? "" : "s"} due for review today.</p>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] flex items-center gap-1.5"><Target size={13} /> Daily goal</p>
          <span className="text-xs text-[var(--accent)]">{streak.todayDone} / {goal}</span>
        </div>
        <div className="h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${goalPct}%` }} />
        </div>
        <div className="flex gap-2 mt-3">
          {[10, 20, 30, 50].map(n => (
            <button key={n} onClick={() => setGoal(n)}
              className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${goal === n ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className="text-xl font-serif text-[var(--know-text)]">{knownCount}</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Known</p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className="text-xl font-serif text-[var(--review-text)]">{reviewCount}</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Reviewing</p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className="text-xl font-serif text-[var(--accent)]">{pct}%</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Mastery</p>
        </div>
      </div>

      <button onClick={() => onGo("study")}
        className="w-full py-3.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2">
        <Layers size={16} /> Start reviewing
      </button>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">Subjects</p>
        {Object.entries(SUBJECTS).map(([code, list]) => (
          <div key={code} className="mb-3 last:mb-0">
            <p className="text-[11px] font-semibold text-[var(--accent)] mb-1.5">{code}</p>
            <div className="flex flex-wrap gap-1.5">
              {list.map(s => {
                const has = TOPIC_MAP[s];
                return (
                  <span key={s} className={`text-[10px] px-2 py-1 rounded-sm border ${has ? "border-[var(--border)] text-[var(--text-soft)]" : "border-[var(--border-soft)] text-[var(--text-faint)]"}`}>
                    {s}{has ? ` · ${has.count}` : ""}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <p className="text-[11px] text-[var(--text-dim)] mt-3 leading-relaxed">Contract Law is seeded with {SEED_CARDS.length} cards to test the mechanics. We'll grow this subject-by-subject toward 3,000+.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Main App
--------------------------------------------------------- */
const THEME_KEY = "sqe-theme-v1";
async function loadTheme() {
  try { const v = localStorage.getItem(THEME_KEY); return v ? JSON.parse(v) : "dark"; } catch { return "dark"; }
}
async function saveTheme(t) { try { localStorage.setItem(THEME_KEY, JSON.stringify(t)); } catch {} }

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState({ count: 0, lastDate: null, todayDone: 0 });
  const [goal, setGoalState] = useState(20);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("flip"); // flip | sba
  const [timed, setTimed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => { loadTheme().then(setTheme); }, []);
  const toggleTheme = () => { const t = theme === "dark" ? "light" : "dark"; setTheme(t); saveTheme(t); };
  const isDark = theme === "dark";

  useEffect(() => {
    (async () => {
      const [p, s, g] = await Promise.all([loadProgress(), loadStreak(), loadGoal()]);
      let nextStreak = s;
      if (s.lastDate !== todayStr()) {
        // new day: check if yesterday continues streak
        const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        nextStreak = { count: s.lastDate === yest ? s.count : 0, lastDate: todayStr(), todayDone: 0 };
      }
      setProgress(p); setStreak(nextStreak); setGoalState(g); setLoaded(true);
      saveStreak(nextStreak);
    })();
  }, []);

  const rate = useCallback((cardId, quality) => {
    setProgress(prev => {
      const updated = { ...prev, [cardId]: scheduleNext(prev[cardId], quality) };
      saveProgress(updated);
      return updated;
    });
    setStreak(prev => {
      const wasZero = prev.todayDone === 0;
      const updated = { ...prev, todayDone: prev.todayDone + 1, count: wasZero ? prev.count + 1 : prev.count, lastDate: todayStr() };
      saveStreak(updated);
      return updated;
    });
  }, []);

  const setGoal = (n) => { setGoalState(n); saveGoal(n); };

  const flipCards = SEED_CARDS.filter(c => c.type === "flip");
  const sbaCards = SEED_CARDS.filter(c => c.type === "sba");
  const dueFlip = flipCards.filter(c => isDue(progress[c.id]));

  if (!loaded) {
    return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text-dim)] text-sm">Loading your revision data…</div>;
  }

  const themeVars = isDark ? {
    "--bg": "#0b1120", "--nav": "#0e1626", "--surface": "#111a2e", "--surface2": "#141f38",
    "--border": "#2e3f5c", "--border-soft": "#1c2942", "--border-mid": "#232f47",
    "--text": "#e8e6de", "--text-soft": "#c7cbd6", "--text-dim": "#5c6b85", "--text-mid": "#8a97ad", "--text-faint": "#3e4a63",
    "--accent": "#c9a15a", "--accent-hover": "#d9b06a", "--accent-ink": "#0b1120",
    "--know-bg": "#152420", "--know-bg2": "#1a3328", "--know-border": "#2a4d3a", "--know-text": "#6fbf8f",
    "--review-bg": "#241a17", "--review-bg2": "#3a2420", "--review-border": "#4d332c", "--review-text": "#d98866",
  } : {
    "--bg": "#f6f2e8", "--nav": "#fffdf8", "--surface": "#fffdf8", "--surface2": "#faf5e9",
    "--border": "#ddd2b4", "--border-soft": "#ece4cf", "--border-mid": "#d3c7a5",
    "--text": "#241f16", "--text-soft": "#463d2b", "--text-dim": "#8c8064", "--text-mid": "#6b5f47", "--text-faint": "#c4b896",
    "--accent": "#96631a", "--accent-hover": "#7d5215", "--accent-ink": "#fffdf8",
    "--know-bg": "#e8f2ea", "--know-bg2": "#d8ebdc", "--know-border": "#9ecaac", "--know-text": "#2f7a48",
    "--review-bg": "#f9ebe2", "--review-bg2": "#f3ddcc", "--review-border": "#d9a67d", "--review-text": "#a85228",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex flex-col transition-colors duration-300" style={{ fontFamily: "'Inter', system-ui, sans-serif", ...themeVars }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Source Serif 4', Georgia, serif; }
      `}</style>

      <header className="px-4 py-4 border-b border-[var(--border-soft)] flex items-center justify-between max-w-lg mx-auto w-full">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">sqe.tairevision.com</p>
          <p className="font-serif text-lg text-[var(--text)] -mt-0.5">Casebook</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle dark mode"
            className="text-[var(--text-mid)] hover:text-[var(--accent)] transition-colors">
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Flame size={16} className="text-[var(--accent)]" />
        </div>
      </header>

      <main className="flex-1 py-6 overflow-y-auto pb-24">
        {tab === "dashboard" && (
          <Dashboard progress={progress} streak={streak} goal={goal} setGoal={setGoal}
            dueCount={dueFlip.length} totalCards={SEED_CARDS.length} onGo={setTab} />
        )}

        {tab === "study" && (
          <div>
            <div className="flex gap-2 max-w-lg mx-auto px-4 mb-5">
              <button onClick={() => setMode("flip")}
                className={`flex-1 text-xs py-2 rounded-sm border ${mode === "flip" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                Flip cards
              </button>
              <button onClick={() => { setMode("sba"); setQuizResult(null); }}
                className={`flex-1 text-xs py-2 rounded-sm border ${mode === "sba" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                SBA quiz
              </button>
            </div>

            {mode === "flip" && <StudyDeck cards={dueFlip.length ? dueFlip : flipCards} progress={progress} onRate={rate} />}

            {mode === "sba" && !quizResult && (
              <>
                <div className="max-w-lg mx-auto px-4 mb-4 flex items-center justify-between">
                  <label className="text-xs text-[var(--text-dim)] flex items-center gap-2">
                    <input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)} className="accent-[var(--accent)]" />
                    Timed practice
                  </label>
                </div>
                <SbaQuiz cards={sbaCards} timed={timed}
                  onFinish={(score, total, secs) => setQuizResult({ score, total, secs })} />
              </>
            )}

            {mode === "sba" && quizResult && (
              <div className="max-w-lg mx-auto px-4 text-center py-10">
                <p className="font-serif text-3xl text-[var(--accent)] mb-2">{quizResult.score} / {quizResult.total}</p>
                <p className="text-sm text-[var(--text-mid)] mb-6">
                  {timed && `Completed in ${Math.floor(quizResult.secs / 60)}m ${quizResult.secs % 60}s · `}
                  {Math.round((quizResult.score / quizResult.total) * 100)}% correct
                </p>
                <button onClick={() => setQuizResult(null)}
                  className="px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold">
                  Retake
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "search" && <SearchView query={query} setQuery={setQuery} />}

        {tab === "more" && (
          <div className="px-4 max-w-lg mx-auto flex flex-col gap-3">
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
              <p className="font-serif text-base text-[var(--text)] mb-1">SQE2 oral advocacy</p>
              <p className="text-xs text-[var(--text-mid)] leading-relaxed">Timed submission prompts with a structure checklist (issue, law, application, conclusion). Coming in the next build pass.</p>
            </div>
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
              <p className="font-serif text-base text-[var(--text)] mb-1">SQE2 drafting exercises</p>
              <p className="text-xs text-[var(--text-mid)] leading-relaxed">Guided drafting tasks (letters, attendance notes, particulars of claim) with model answers. Coming next.</p>
            </div>
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">This is a working core build — spaced repetition, SBA quiz, search, and progress tracking are fully live. Content and the two SQE2 modules above grow in the next sessions.</p>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--nav)] border-t border-[var(--border-soft)] flex max-w-lg mx-auto w-full">
        <NavButton icon={Home} label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
        <NavButton icon={Layers} label="Study" active={tab === "study"} onClick={() => setTab("study")} />
        <NavButton icon={Search} label="Search" active={tab === "search"} onClick={() => setTab("search")} />
        <NavButton icon={Menu} label="More" active={tab === "more"} onClick={() => setTab("more")} />
      </nav>
    </div>
  );
}
