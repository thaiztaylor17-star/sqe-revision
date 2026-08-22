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

  /* --- Tort (FLK1) --- */
  { id: "c016", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A driver briefly checks a text message and fails to see a pedestrian crossing at a zebra crossing, injuring them. Which element of negligence is most clearly established by these facts alone?",
    options: [
      "Damage.",
      "Breach of duty — the driver fell below the standard of the reasonable competent driver.",
      "Causation in law (remoteness).",
      "Existence of a duty of care under Caparo."
    ],
    answer: 1,
    explanation: "A driver owes an established duty to other road users. Checking a phone instead of watching the road falls below the standard of the reasonable driver (Nettleship v Weston) — this is breach, not the other elements.",
    tags: ["breach of duty", "Nettleship v Weston"] },
  { id: "c017", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "Applying the 'but for' test, a doctor negligently fails to examine a patient who later dies of a condition that was, on the evidence, already untreatable at the time of the visit. Is the doctor liable in negligence for the death?",
    options: [
      "Yes — the failure to examine was clearly negligent.",
      "No — causation is not established because the death would have occurred even 'but for' the negligence (Barnett v Chelsea & Kensington Hospital).",
      "Yes, because the doctor owed a non-delegable duty.",
      "No — no duty of care arises between doctor and patient in these facts."
    ],
    answer: 1,
    explanation: "Barnett established that even where there is a clear breach, a claimant must show the breach caused the harm on the balance of probabilities. If death was inevitable regardless, factual causation fails.",
    tags: ["Barnett", "but for test"] },
  { id: "c018", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A claimant suffers a foreseeable type of injury but in a wholly unforeseeable and bizarre manner. Under the remoteness rules in tort, is the defendant liable?",
    options: [
      "No — the exact manner of injury must be foreseeable.",
      "Yes, provided the type/kind of damage was reasonably foreseeable, even if the precise manner was not (Hughes v Lord Advocate).",
      "Yes, but only if the claimant is a 'thin skull' claimant.",
      "No — unforeseeable manner always breaks the chain of causation."
    ],
    answer: 1,
    explanation: "Under Hughes v Lord Advocate, liability turns on foreseeability of the type of harm, not the exact sequence of events by which it occurs.",
    tags: ["remoteness", "Hughes v Lord Advocate"] },
  { id: "c019", subject: "FLK1", topic: "Occupiers' Liability", type: "sba",
    front: "A trespasser is injured on land after climbing a fence to explore a derelict building the occupier knew local children frequently accessed. Which Act primarily governs the occupier's potential liability?",
    options: [
      "Occupiers' Liability Act 1957.",
      "Occupiers' Liability Act 1984.",
      "The Defective Premises Act 1972.",
      "Ordinary common law negligence only, as no statute applies to trespassers."
    ],
    answer: 1,
    explanation: "The 1957 Act covers lawful visitors; the 1984 Act governs the duty owed to trespassers/non-visitors, particularly where the occupier is aware people may come into the vicinity of a danger.",
    tags: ["Occupiers' Liability Act 1984"] },
  { id: "c020", subject: "FLK1", topic: "Vicarious Liability", type: "sba",
    front: "An employee, contrary to express instructions, takes a detour during a delivery run and negligently injures a pedestrian. Is the employer likely to be vicariously liable?",
    options: [
      "No — the employee disobeyed instructions, so the act was outside the scope of employment.",
      "Yes — a mere detour during an authorised task is usually still within the 'close connection' to employment (Century Insurance-type reasoning).",
      "No — vicarious liability never applies to acts of negligence, only intentional torts.",
      "Yes, but only if the employer expressly authorised the detour in writing."
    ],
    answer: 1,
    explanation: "Prohibitions that merely limit how an authorised task is carried out (an unauthorised route) do not usually take the act outside the course of employment; the 'close connection' test (Lister v Hesley Hall / Mohamud) governs.",
    tags: ["vicarious liability", "close connection test"] },

  /* --- Criminal Law (FLK1) --- */
  { id: "c021", subject: "FLK1", topic: "Actus Reus & Mens Rea", type: "sba",
    front: "D swings a punch intending only to frighten V, not to hurt him, but the punch connects and breaks V's jaw. Which mens rea concept is most relevant to whether D is liable for the resulting injury?",
    options: [
      "Strict liability — intention is irrelevant to any assault-based offence.",
      "Transferred malice does not apply since the intended and actual harm differ in kind.",
      "D may still be liable under the doctrine that foresight of some harm, coupled with the act causing greater harm, can found liability for the offence actually committed (constructive liability principles).",
      "D cannot be liable because he lacked any intention to injure."
    ],
    answer: 2,
    explanation: "For offences against the person, once the basic intent to apply unlawful force is shown, D can be liable for the harm actually caused even if greater than intended, subject to the specific offence's mens rea requirements (cf. R v Mowatt on s.20 OAPA 1861).",
    tags: ["mens rea", "OAPA 1861"] },
  { id: "c022", subject: "FLK1", topic: "Homicide", type: "sba",
    front: "D kills V after V made a single, unfounded, minor insult, and D had time to reflect before acting. D raises loss of control under the Coroners and Justice Act 2009. Is this defence likely to succeed?",
    options: [
      "Yes — any insult can qualify as a triggering event.",
      "No — a trivial insult with no fear of serious violence and evidence of a considered decision to kill are unlikely to meet the qualifying triggers or the loss of self-control requirement.",
      "Yes, because loss of control has no requirement for a 'triggering event'.",
      "No — loss of control was abolished and replaced entirely by diminished responsibility."
    ],
    answer: 1,
    explanation: "Loss of control under ss.54-55 CJA 2009 requires a qualifying trigger (fear of serious violence, or things said/done of an extremely grave character causing justifiable sense of being seriously wronged) and genuine loss of self-control — a trivial insult with deliberation is unlikely to satisfy this.",
    tags: ["loss of control", "Coroners and Justice Act 2009"] },
  { id: "c023", subject: "FLK1", topic: "Defences", type: "sba",
    front: "D, honestly but unreasonably, believes he is under imminent attack and uses force in what he believes is self-defence. Under the current law, how is D's mistaken belief treated?",
    options: [
      "It is irrelevant — only reasonable mistakes can support self-defence.",
      "D is judged on the facts as he honestly believed them to be, even if the belief was unreasonable, though the force used must still be objectively reasonable in those believed circumstances.",
      "An honest but unreasonable mistake automatically defeats the defence.",
      "Self-defence is only available for mistakes induced by voluntary intoxication."
    ],
    answer: 1,
    explanation: "Following R v Williams (Gladstone) and s.76 Criminal Justice and Immigration Act 2008, D is judged on the facts as honestly believed (even if unreasonable, subject to intoxication rules), but the degree of force must be reasonable in those circumstances.",
    tags: ["self-defence", "s.76 CJIA 2008"] },
  { id: "c024", subject: "FLK1", topic: "Theft & Property Offences", type: "sba",
    front: "D takes an umbrella left in a pub by mistake, honestly and reasonably believing it is his own identical umbrella. Is D likely guilty of theft?",
    options: [
      "Yes — the actus reus of appropriation is satisfied regardless of belief.",
      "No — D lacks dishonesty and the necessary intention to permanently deprive, as he honestly believes the property is his own (s.2(1)(a) Theft Act 1968).",
      "Yes, because mistake is never a defence to theft.",
      "No, because umbrellas cannot be 'property' for the purposes of theft."
    ],
    answer: 1,
    explanation: "Under s.2(1)(a) Theft Act 1968, a person is not dishonest if they believe they have a legal right to the property — an honest mistaken belief of ownership negates dishonesty.",
    tags: ["Theft Act 1968", "dishonesty"] },

  /* --- Land Law (FLK1) --- */
  { id: "c025", subject: "FLK1", topic: "Easements", type: "sba",
    front: "A right of way has been used openly, without permission, and without interruption for 22 years over a neighbour's land, but there is no deed granting it. Which doctrine is most likely to assist in establishing a legal easement?",
    options: [
      "Promissory estoppel.",
      "Prescription (long user), e.g. under the doctrine of lost modern grant or the Prescription Act 1832.",
      "Proprietary estoppel only, never prescription.",
      "The right cannot exist without registration, regardless of use."
    ],
    answer: 1,
    explanation: "Long, continuous, open ('as of right') use for 20+ years without permission can give rise to an easement by prescription, even absent an express deed.",
    tags: ["prescription", "easements"] },
  { id: "c026", subject: "FLK1", topic: "Leases", type: "sba",
    front: "A tenancy agreement grants exclusive possession for a rent, but the document says 'this is a licence, not a lease.' A court is asked to characterise the arrangement. What is the correct approach?",
    options: [
      "The label chosen by the parties is conclusive.",
      "The court looks at the substance of the arrangement — exclusive possession for a term at a rent creates a lease regardless of the label used (Street v Mountford).",
      "It is automatically a licence because the word 'licence' was used.",
      "The arrangement is void for uncertainty."
    ],
    answer: 1,
    explanation: "Street v Mountford establishes that substance prevails over form — exclusive possession, for a fixed or periodic term, at a rent, creates a tenancy irrespective of the label the parties use.",
    tags: ["Street v Mountford", "leases vs licences"] },

  /* --- Trusts (FLK1) --- */
  { id: "c027", subject: "FLK1", topic: "Trust Creation", type: "sba",
    front: "A settlor purports to create a trust of shares but never takes the steps required to transfer legal title to the trustee. Applying Milroy v Lord, is the trust likely to be valid?",
    options: [
      "Yes — equity will treat as done that which ought to be done in all cases.",
      "No — equity will not perfect an imperfect gift; the settlor must have done everything necessary to transfer title, absent limited exceptions (e.g. Re Rose, unconscionability under Pennington v Waine).",
      "Yes, because intention alone is sufficient to constitute any trust.",
      "No, because shares can never be held on trust."
    ],
    answer: 1,
    explanation: "Milroy v Lord requires the settlor to have done everything necessary to transfer the property, with narrow exceptions where the donor has done all in their power (Re Rose) or it would be unconscionable to resile (Pennington v Waine).",
    tags: ["Milroy v Lord", "constitution of trusts"] },
  { id: "c028", subject: "FLK1", topic: "Resulting & Constructive Trusts", type: "sba",
    front: "Two unmarried partners buy a home in one partner's sole name, but both contributed to the purchase price with a shared understanding they would own it jointly. Which mechanism is most likely to give the non-legal-owner a beneficial interest?",
    options: [
      "A common intention constructive trust, based on the shared understanding and detrimental reliance (Stack v Dowden; Jones v Kernott).",
      "An express trust, since no formalities are required for land.",
      "A resulting trust based purely on the legal title.",
      "No interest can arise without both names on the register."
    ],
    answer: 0,
    explanation: "Where legal title is in one name but there is a common intention (express or inferred) that both should have a beneficial share, and detrimental reliance, a common intention constructive trust can arise (Stack v Dowden; Jones v Kernott).",
    tags: ["constructive trust", "Stack v Dowden"] },

  /* --- Business Law & Practice (FLK2) --- */
  { id: "c029", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "A director enters into a contract on behalf of the company that primarily benefits a business he personally owns, without disclosing the conflict to the board. Which core statutory duty has he most clearly breached?",
    options: [
      "The duty to exercise reasonable care, skill and diligence only (s.174 CA 2006).",
      "The duty to avoid conflicts of interest (s.175 CA 2006) and/or to declare interest in a proposed transaction (s.177 CA 2006).",
      "The duty to act within powers (s.171 CA 2006) exclusively.",
      "No statutory duty applies to private, unlisted companies."
    ],
    answer: 1,
    explanation: "Ss.175 and 177 Companies Act 2006 require directors to avoid conflicts of interest and disclose the nature and extent of any interest in a proposed transaction to the board.",
    tags: ["Companies Act 2006", "directors' duties"] },
  { id: "c030", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "A private limited company wants to allot new shares. Assuming no articles or resolutions currently authorise this, what does the board generally need before allotting shares under the Companies Act 2006?",
    options: [
      "Nothing — directors always have unrestricted authority to allot shares.",
      "Authority to allot, typically via the articles or an ordinary resolution of the shareholders (s.551 CA 2006).",
      "A special resolution of the shareholders only, in every case.",
      "Court approval in all circumstances."
    ],
    answer: 1,
    explanation: "Under s.551 CA 2006, directors need authority to allot shares, usually granted by the articles or an ordinary resolution, unless it is a private company with only one class of shares (s.550).",
    tags: ["s.551 CA 2006", "allotment of shares"] },

  /* --- Dispute Resolution (FLK2) --- */
  { id: "c031", subject: "FLK2", topic: "Civil Procedure & Limitation", type: "sba",
    front: "A claimant wants to bring a simple breach of written contract claim. The breach occurred just under 6 years ago. Under the Limitation Act 1980, is the claim likely to be time-barred?",
    options: [
      "Yes — the limitation period for simple contract claims is 3 years.",
      "No — the standard limitation period for a claim founded on simple contract is 6 years from the date the cause of action accrued.",
      "Yes — all contract claims must be brought within 1 year.",
      "No — there is no limitation period for written contracts."
    ],
    answer: 1,
    explanation: "S.5 Limitation Act 1980 sets a 6-year limitation period for actions founded on simple contract, running from the date the cause of action accrued (usually the date of breach).",
    tags: ["Limitation Act 1980", "s.5"] },
  { id: "c032", subject: "FLK2", topic: "Civil Procedure & Limitation", type: "sba",
    front: "A claim is allocated to the small claims track. Which of the following is generally true about costs recovery for the winning party?",
    options: [
      "The winner recovers full standard-basis legal costs from the loser.",
      "Recoverable costs are generally very limited (e.g. court fees, limited expenses), with legal representative costs not usually recoverable.",
      "Costs always follow the event in full on the small claims track.",
      "No costs of any kind, including court fees, are recoverable."
    ],
    answer: 1,
    explanation: "The small claims track has restricted costs rules (CPR Part 27) — successful parties generally cannot recover their legal costs, only limited fixed items like court fees and certain expenses.",
    tags: ["small claims track", "CPR Part 27"] },

  /* --- Property Practice (FLK2) --- */
  { id: "c033", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "In a residential conveyancing transaction, at what stage does the contract typically become binding on both parties?",
    options: [
      "On completion.",
      "On exchange of contracts.",
      "On submission of the draft contract by the seller's solicitor.",
      "On the buyer's mortgage offer being issued."
    ],
    answer: 1,
    explanation: "Exchange of contracts is the point at which the transaction becomes legally binding on both parties; completion is when legal title actually transfers and money changes hands.",
    tags: ["exchange of contracts", "completion"] },
  { id: "c034", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "A buyer's solicitor conducts pre-contract searches and finds a local land charge affecting the property that was not disclosed by the seller. What is the most appropriate immediate step?",
    options: [
      "Proceed to exchange without raising it, since caveat emptor applies to all matters.",
      "Raise a written enquiry with the seller's solicitor to clarify the nature and effect of the charge before advising the client on exchange.",
      "Automatically rescind the transaction without further enquiry.",
      "Ignore it, as local land charges never affect residential property."
    ],
    answer: 1,
    explanation: "The buyer's solicitor should raise enquiries about undisclosed matters revealed by searches before advising the client whether/how to proceed — caveat emptor is mitigated by disclosure obligations and standard conveyancing practice.",
    tags: ["local land charges", "pre-contract enquiries"] },

  /* --- Wills & Estate Administration (FLK2) --- */
  { id: "c035", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A testator dies leaving a will that fails to appoint an executor. Who is generally entitled to apply to administer the estate?",
    options: [
      "No one — the estate automatically passes to the Crown.",
      "A person entitled under the will (e.g. a residuary beneficiary) may apply for letters of administration with the will annexed.",
      "Only a solicitor can apply in these circumstances.",
      "The deceased's next of kin under intestacy rules exclusively, ignoring the will."
    ],
    answer: 1,
    explanation: "Where a valid will exists but no executor is appointed (or none can/will act), a person with an interest under the will — commonly a residuary beneficiary — can apply for a grant of letters of administration with the will annexed.",
    tags: ["letters of administration", "grant of representation"] },
  { id: "c036", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A person dies intestate, survived by a spouse and two adult children, leaving an estate worth more than the statutory legacy. Under the intestacy rules, how is the estate broadly distributed?",
    options: [
      "The spouse takes everything; children take nothing.",
      "The spouse takes personal chattels, the statutory legacy, and half the remaining estate absolutely; the children share the other half.",
      "The estate is divided equally three ways with no priority for the spouse.",
      "The children take everything; the spouse takes nothing."
    ],
    answer: 1,
    explanation: "Under the intestacy rules (as amended), where there is a spouse and children, the spouse receives personal chattels, a statutory legacy, and half of the remaining estate outright; the other half is shared among the children.",
    tags: ["intestacy rules", "statutory legacy"] },

  /* --- Solicitors Accounts (FLK2) --- */
  { id: "c037", subject: "FLK2", topic: "Solicitors Accounts", type: "sba",
    front: "A solicitor receives £5,000 from a client purely to cover future disbursements and costs not yet billed. Under the SRA Accounts Rules, into which account must this money be paid?",
    options: [
      "The firm's business (office) account, since it will eventually become costs.",
      "The client account, as it is client money until formally billed or otherwise appropriately transferred.",
      "Either account, at the solicitor's discretion.",
      "It may be retained in cash by the fee earner pending use."
    ],
    answer: 1,
    explanation: "Money held on behalf of a client, including advance funds for costs/disbursements not yet incurred or billed, is client money and must be held in a client account under the SRA Accounts Rules.",
    tags: ["SRA Accounts Rules", "client money"] },

  /* --- Constitutional & Administrative Law (FLK1) --- */
  { id: "c038", subject: "FLK1", topic: "Judicial Review", type: "sba",
    front: "A public body makes a decision that is technically within its legal powers but is so unreasonable that no reasonable authority could have made it. Which ground of judicial review is most directly engaged?",
    options: [
      "Illegality.",
      "Irrationality (Wednesbury unreasonableness).",
      "Procedural impropriety.",
      "Proportionality under EU law exclusively."
    ],
    answer: 1,
    explanation: "Irrationality/Wednesbury unreasonableness applies where a decision is so unreasonable that no reasonable decision-maker could have reached it (Associated Provincial Picture Houses v Wednesbury Corp).",
    tags: ["Wednesbury unreasonableness", "judicial review"] },
  { id: "c039", subject: "FLK1", topic: "Judicial Review", type: "sba",
    front: "A claimant wishes to bring a claim for judicial review. Within what general time limit must the claim form usually be filed?",
    options: [
      "Within 3 years of the decision.",
      "Promptly, and in any event generally not later than 3 months after the grounds to make the claim first arose.",
      "There is no time limit for judicial review claims.",
      "Within 6 years, matching standard limitation periods."
    ],
    answer: 1,
    explanation: "CPR 54.5 requires a claim for judicial review to be filed promptly, and in any event within 3 months of the grounds first arising, subject to specific statutory variations.",
    tags: ["CPR 54.5", "judicial review time limits"] },

  /* --- EU Law & Legal Systems (FLK1) --- */
  { id: "c040", subject: "FLK1", topic: "Sources of Law", type: "sba",
    front: "In the doctrine of precedent, a first-instance High Court decision on a novel point is later considered by the Court of Appeal in an unrelated case. What is the status of the High Court decision for the Court of Appeal?",
    options: [
      "Binding on the Court of Appeal in all circumstances.",
      "Persuasive only — the Court of Appeal is not bound by first-instance decisions.",
      "Binding only if made by a High Court judge sitting with two others.",
      "Irrelevant and inadmissible as authority."
    ],
    answer: 1,
    explanation: "Under the doctrine of precedent, decisions of lower or equal courts are persuasive, not binding, on higher courts. The Court of Appeal is bound by its own prior decisions and the Supreme Court, not by first-instance rulings.",
    tags: ["doctrine of precedent", "court hierarchy"] },

  /* --- Contract Law (FLK1) — deeper coverage --- */
  { id: "c041", subject: "FLK1", topic: "Contract Formation", type: "sba",
    front: "A supplier sends a 'letter of intent' to a customer stating it 'anticipates' entering a formal contract once terms are finalised. The customer starts performance in reliance on it. Is a binding contract likely to exist at this stage?",
    options: [
      "Yes — a letter of intent is always a binding offer.",
      "Not necessarily — a letter of intent expressing future intention, without the essential terms agreed and clear intent to be immediately bound, is unlikely to be contractually binding, though a separate claim (e.g. quantum meruit) may arise for work done.",
      "Yes, because performance always converts intention into acceptance.",
      "No contract or remedy can ever arise from a letter of intent."
    ],
    answer: 1,
    explanation: "Letters of intent are usually not binding contracts as they lack the necessary certainty and intention to create immediate legal relations, though restitutionary remedies (e.g. quantum meruit) may compensate work done in anticipation (British Steel Corp v Cleveland Bridge).",
    tags: ["letters of intent", "quantum meruit"] },
  { id: "c042", subject: "FLK1", topic: "Terms", type: "sba",
    front: "A written contract contains an exclusion clause limiting liability, printed on the reverse of a document referred to on the front but never specifically drawn to the other party's attention. Is the clause likely to be incorporated?",
    options: [
      "Yes — incorporation by signature applies regardless of what was highlighted.",
      "It depends — if unsigned, reasonable notice must be given, and unusual or onerous clauses require particularly clear notice (Interfoto Picture Library v Stiletto).",
      "No — exclusion clauses can never be incorporated by reference to another document.",
      "Yes, automatically, because it was referenced on the front of the document."
    ],
    answer: 1,
    explanation: "Where a clause is unsigned, it must be reasonably brought to the other party's attention; particularly onerous or unusual clauses require a higher degree of notice (Interfoto; Parker v South Eastern Railway).",
    tags: ["incorporation of terms", "Interfoto"] },
  { id: "c043", subject: "FLK1", topic: "Terms", type: "sba",
    front: "A business-to-business contract contains a clause excluding liability for negligence causing property damage. Under UCTA 1977, when will such a clause be effective?",
    options: [
      "Never — negligence liability can never be excluded.",
      "Only if it satisfies the requirement of reasonableness under s.11 UCTA 1977.",
      "Automatically, since UCTA does not apply to B2B contracts.",
      "Only if agreed orally as well as in writing."
    ],
    answer: 1,
    explanation: "Under s.2(2) UCTA 1977, exclusion of liability for negligence causing loss other than death/personal injury is subject to the reasonableness test in s.11.",
    tags: ["UCTA 1977", "reasonableness test"] },
  { id: "c044", subject: "FLK1", topic: "Discharge & Remedies", type: "sba",
    front: "A buyer suffers an unusual, highly profitable sub-contract loss because goods arrived a day late — a loss the seller had no knowledge of and could not reasonably have contemplated. Can the buyer recover this specific loss?",
    options: [
      "Yes — all losses flowing from breach are automatically recoverable.",
      "No — only loss that arises naturally, or was within the reasonable contemplation of both parties at the time of contracting, is recoverable (Hadley v Baxendale).",
      "Yes, provided the buyer mitigated their loss.",
      "No, because damages can never be awarded for late delivery."
    ],
    answer: 1,
    explanation: "Hadley v Baxendale limits recoverable damages to loss arising naturally from the breach, or loss reasonably in the contemplation of both parties at contract formation as a probable result of breach — unusual, unknown losses fall outside this.",
    tags: ["Hadley v Baxendale", "remoteness of damage"] },

  /* --- Tort (FLK1) — deeper coverage --- */
  { id: "c045", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A local authority is alleged to owe a duty of care in a novel category of case with no close analogous precedent. Applying Caparo v Dickman, which factors will a court weigh in deciding whether a duty exists?",
    options: [
      "Only whether damage was foreseeable.",
      "Foreseeability of harm, proximity between the parties, and whether it is fair, just and reasonable to impose a duty.",
      "Only whether the defendant is a public body.",
      "Only whether the claimant suffered financial loss."
    ],
    answer: 1,
    explanation: "For novel duty situations, Caparo v Dickman requires foreseeability, proximity, and that imposing a duty be fair, just and reasonable — all three elements are assessed incrementally by analogy with existing categories.",
    tags: ["Caparo v Dickman", "duty of care"] },
  { id: "c046", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A claimant is already predisposed to a serious psychiatric condition. A minor negligent act triggers a severe reaction far beyond what would affect an ordinary person. Applying the 'thin skull' rule, is the defendant liable for the full extent of harm?",
    options: [
      "No — liability is capped at what an ordinary person would suffer.",
      "Yes — provided the type of harm (e.g. psychiatric/physical injury) was foreseeable, the defendant takes the claimant as they find them and is liable for the full extent (Smith v Leech Brain & Co).",
      "No — pre-existing conditions always break the chain of causation.",
      "Yes, but only if the claimant disclosed the condition beforehand."
    ],
    answer: 1,
    explanation: "The thin skull rule means a defendant is liable for the full extent of injury even if unusually severe due to the claimant's pre-existing vulnerability, provided the type of harm was foreseeable (Smith v Leech Brain).",
    tags: ["thin skull rule", "Smith v Leech Brain"] },
  { id: "c047", subject: "FLK1", topic: "Defences to Negligence", type: "sba",
    front: "A claimant voluntarily and knowingly accepts a clearly explained risk of injury before participating in an activity, and is then injured by that very risk materialising through no additional fault of the defendant. Which defence is most relevant?",
    options: [
      "Contributory negligence, reducing damages proportionately.",
      "Volenti non fit injuria (consent), which can operate as a complete defence.",
      "Ex turpi causa, barring the claim due to illegality.",
      "Res ipsa loquitur, reversing the burden of proof."
    ],
    answer: 1,
    explanation: "Volenti non fit injuria is a complete defence where the claimant has freely and knowingly consented to the specific risk that materialised, distinct from contributory negligence which only reduces damages.",
    tags: ["volenti non fit injuria", "consent defence"] },
  { id: "c048", subject: "FLK1", topic: "Product Liability", type: "sba",
    front: "A consumer is injured by a defective product and wants to bring a claim without needing to prove the manufacturer was negligent. Which piece of legislation most directly enables this?",
    options: [
      "The Sale of Goods Act 1979, against the manufacturer directly.",
      "The Consumer Protection Act 1987, which imposes strict liability on producers for defective products.",
      "The Occupiers' Liability Act 1957.",
      "The Unfair Contract Terms Act 1977."
    ],
    answer: 1,
    explanation: "The Consumer Protection Act 1987 implements strict (no-fault) liability for producers of defective products causing damage, removing the need to prove negligence.",
    tags: ["Consumer Protection Act 1987", "strict liability"] },

  /* --- Criminal Law (FLK1) — deeper coverage --- */
  { id: "c049", subject: "FLK1", topic: "Inchoate Offences", type: "sba",
    front: "D agrees with E to commit a burglary next week, but they are arrested before taking any further steps. Can D be liable for an inchoate offence?",
    options: [
      "No — mere agreement without an overt act is never sufficient.",
      "Yes — conspiracy is complete upon agreement between two or more people to pursue a course of conduct that would necessarily involve the commission of an offence (s.1 Criminal Law Act 1977).",
      "No — conspiracy requires the substantive offence to actually be attempted.",
      "Yes, but only if a third party also joins the agreement."
    ],
    answer: 1,
    explanation: "Under s.1 Criminal Law Act 1977, statutory conspiracy is complete on agreement between two or more people to commit an offence — no further act toward the substantive offence is required.",
    tags: ["conspiracy", "Criminal Law Act 1977"] },
  { id: "c050", subject: "FLK1", topic: "Inchoate Offences", type: "sba",
    front: "D, intending to kill V, fires a gun at V but misses entirely because V had already left the scene. Is D guilty of attempted murder?",
    options: [
      "No — since it was factually impossible to kill someone no longer present, D cannot be liable.",
      "Yes — D did an act more than merely preparatory with the intention to kill; impossibility due to the victim's absence does not prevent liability for attempt (Criminal Attempts Act 1981; R v Shivpuri principles).",
      "No — attempt requires the victim to be present and at risk.",
      "Yes, but only as a lesser offence of assault."
    ],
    answer: 1,
    explanation: "Under the Criminal Attempts Act 1981, an act more than merely preparatory, done with the requisite intent, can found liability for attempt even where completion was factually impossible in the circumstances.",
    tags: ["Criminal Attempts Act 1981", "impossibility"] },
  { id: "c051", subject: "FLK1", topic: "Defences", type: "sba",
    front: "D commits an offence while suffering an abnormality of mental functioning arising from a recognised medical condition, which substantially impairs D's ability to form a rational judgment, and provides an explanation for D's conduct in a murder charge. Which partial defence is most relevant?",
    options: [
      "Insanity, resulting in a full acquittal.",
      "Diminished responsibility under s.2 Homicide Act 1957 (as amended), reducing murder to manslaughter.",
      "Automatism, resulting in a full acquittal.",
      "Self-defence, resulting in a full acquittal."
    ],
    answer: 1,
    explanation: "Diminished responsibility under s.2 Homicide Act 1957 (as amended by the Coroners and Justice Act 2009) is a partial defence specific to murder, reducing the conviction to voluntary manslaughter.",
    tags: ["diminished responsibility", "Homicide Act 1957"] },
  { id: "c052", subject: "FLK1", topic: "Theft & Property Offences", type: "sba",
    front: "D enters a shop during opening hours intending only to browse, but on impulse decides to conceal an item and leave without paying. At what point, if at all, does D commit burglary under s.9(1)(b) Theft Act 1968?",
    options: [
      "D commits burglary the moment they enter the shop, since entry as a member of the public is irrelevant.",
      "D is unlikely to commit s.9(1)(b) burglary here, as entry was authorised/as a member of the public with no intent to steal at the point of entry — this is more likely simple theft; burglary requires the relevant intent/act to occur in relation to entering as a trespasser.",
      "D commits burglary only if they use force to leave the shop.",
      "D cannot be liable for any offence because the decision was impulsive."
    ],
    answer: 1,
    explanation: "Burglary under s.9(1)(b) requires D to be a trespasser and, having entered as such, to steal or attempt to steal (or inflict/attempt GBH). Entering a shop during trading hours as a member of the public is authorised entry, not trespass, so this is more likely simple theft rather than burglary.",
    tags: ["burglary", "s.9 Theft Act 1968", "trespass"] },

  /* --- Land Law (FLK1) — deeper coverage --- */
  { id: "c053", subject: "FLK1", topic: "Mortgages", type: "sba",
    front: "A lender wants to enforce security over a residential mortgage after the borrower defaults. Which remedy allows the lender to take physical control of the property to sell it?",
    options: [
      "Foreclosure only.",
      "Possession, typically as a precursor to a power of sale.",
      "Appointment of a receiver only, never possession.",
      "Rescission of the mortgage deed."
    ],
    answer: 1,
    explanation: "Taking possession (often via a court order for residential property) is a common step allowing a mortgagee to then exercise the power of sale to realise the security.",
    tags: ["mortgagee remedies", "possession"] },
  { id: "c054", subject: "FLK1", topic: "Co-ownership", type: "sba",
    front: "Two people hold registered title to a property as legal joint tenants. One serves a written notice on the other clearly indicating an intention to sever the joint tenancy in equity. What is the effect?",
    options: [
      "Nothing changes until both parties agree in writing.",
      "The equitable joint tenancy is severed, converting the beneficial interest into a tenancy in common, even though the legal title remains joint (s.36(2) Law of Property Act 1925).",
      "The legal joint tenancy is automatically severed too.",
      "Severance can only occur through a court order."
    ],
    answer: 1,
    explanation: "Under s.36(2) LPA 1925, written notice by one joint tenant to the other(s) is sufficient to sever the equitable joint tenancy into a tenancy in common; the legal estate remains held as joint tenants (which cannot be severed).",
    tags: ["severance", "s.36(2) LPA 1925"] },
  { id: "c055", subject: "FLK1", topic: "Registered Land", type: "sba",
    front: "A person is in actual occupation of registered land and has an unregistered proprietary interest in it. A purchaser buys the land without knowing of the interest. Is the interest likely to bind the purchaser?",
    options: [
      "No — unregistered interests never bind a purchaser.",
      "Potentially yes — an interest belonging to a person in actual occupation can override a registered disposition under Schedule 3, paragraph 2 of the Land Registration Act 2002, subject to exceptions (e.g. non-disclosure on reasonable enquiry).",
      "No, because only registered charges can bind purchasers.",
      "Yes, but only if it was protected by a notice on the register."
    ],
    answer: 1,
    explanation: "Sch 3, para 2 LRA 2002 protects interests of persons in actual occupation as overriding interests, capable of binding a purchaser even without registration, subject to specified exceptions.",
    tags: ["overriding interests", "LRA 2002 Sch 3"] },

  /* --- Trusts (FLK1) — deeper coverage --- */
  { id: "c056", subject: "FLK1", topic: "Trustees' Duties", type: "sba",
    front: "A trustee invests trust funds in a manner that generates a personal profit for the trustee, without express authorisation in the trust deed or fully informed beneficiary consent. Is the trustee likely liable to account?",
    options: [
      "No — trustees are entitled to keep incidental profits from managing trust property.",
      "Yes — the strict no-profit rule generally requires a trustee to account for unauthorised profits made from the trust position, regardless of good faith (Keech v Sandford; Boardman v Phipps).",
      "No, provided the investment was objectively a good decision.",
      "Yes, but only if the trustee acted dishonestly."
    ],
    answer: 1,
    explanation: "The strict fiduciary no-profit/no-conflict rules (Keech v Sandford; Boardman v Phipps) require trustees to account for unauthorised profits connected to their position, even absent bad faith.",
    tags: ["no-profit rule", "Boardman v Phipps"] },
  { id: "c057", subject: "FLK1", topic: "Trust Creation", type: "sba",
    front: "A will leaves property 'to my trustees to hold for such of my employees as they see fit'. Is this trust likely to be valid for certainty of objects?",
    options: [
      "No — discretionary trusts always fail for uncertainty.",
      "Potentially yes — under the 'is or is not' test (McPhail v Doulton), a discretionary trust is valid if it can be said with certainty whether any given individual is or is not a member of the class.",
      "No, because 'employees' is inherently too vague as a class.",
      "Yes, automatically, regardless of how the class is defined."
    ],
    answer: 1,
    explanation: "McPhail v Doulton established that discretionary trusts need only satisfy the 'is or is not' test for certainty of objects, rather than requiring a complete list of beneficiaries.",
    tags: ["certainty of objects", "McPhail v Doulton"] },

  /* --- Business Law & Practice (FLK2) — deeper coverage --- */
  { id: "c058", subject: "FLK2", topic: "Partnerships & LLPs", type: "sba",
    front: "Two individuals run a business together, sharing profits, without any formal written agreement or registration. What is the most likely default legal status of their business?",
    options: [
      "A limited company by default.",
      "A general partnership under the Partnership Act 1890, since carrying on business in common with a view of profit is the statutory test.",
      "An LLP by default, as no registration is required.",
      "A sole tradership, since no formal agreement exists."
    ],
    answer: 1,
    explanation: "Under s.1 Partnership Act 1890, a partnership arises automatically where two or more persons carry on business in common with a view of profit — no formal agreement or registration is required.",
    tags: ["Partnership Act 1890", "s.1"] },
  { id: "c059", subject: "FLK2", topic: "Insolvency", type: "sba",
    front: "A company is unable to pay its debts as they fall due. A creditor wants to force the company into compulsory liquidation. Which statutory presumption is commonly relied upon to evidence insolvency?",
    options: [
      "Failure to respond to a statutory demand for a debt exceeding the prescribed minimum within 21 days (s.123 Insolvency Act 1986).",
      "Simply the creditor's belief that the company is insolvent, without more.",
      "The company's failure to file accounts on time.",
      "A single missed payment of any amount, however small."
    ],
    answer: 0,
    explanation: "S.123 Insolvency Act 1986 sets out several tests for inability to pay debts, including failure to satisfy a statutory demand (for a qualifying debt exceeding the prescribed minimum) within 21 days.",
    tags: ["Insolvency Act 1986", "s.123", "statutory demand"] },

  /* --- Dispute Resolution (FLK2) — deeper coverage --- */
  { id: "c060", subject: "FLK2", topic: "Pre-Action & Track Allocation", type: "sba",
    front: "A claim for £15,000 in damages for a straightforward breach of contract, with no particular complexity, is issued. Which track is it most likely to be allocated to?",
    options: [
      "Small claims track.",
      "Fast track.",
      "Multi-track, since it exceeds the small claims limit.",
      "It cannot be allocated to any track without a case management conference first."
    ],
    answer: 1,
    explanation: "The fast track generally covers claims between £10,000 and £25,000 that are not overly complex and can be tried within one day, under CPR Part 26/28.",
    tags: ["track allocation", "fast track"] },
  { id: "c061", subject: "FLK2", topic: "Remedies & Enforcement", type: "sba",
    front: "A judgment debtor fails to pay a County Court judgment. The judgment creditor wants to find out what assets the debtor has before choosing an enforcement method. Which procedure is designed for this?",
    options: [
      "A freezing injunction.",
      "An order to obtain information from a judgment debtor (oral examination under CPR Part 71).",
      "A charging order, without any prior enquiry.",
      "A statutory demand under the Insolvency Act 1986."
    ],
    answer: 1,
    explanation: "CPR Part 71 allows a judgment creditor to obtain an order requiring the judgment debtor to attend court and provide information about their means/assets, informing the choice of enforcement method.",
    tags: ["CPR Part 71", "enforcement of judgments"] },

  /* --- Property Practice (FLK2) — deeper coverage --- */
  { id: "c062", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "A buyer's solicitor is reviewing the results of a Local Authority search (LLC1 and CON29) on a residential purchase. Which of the following is this search primarily designed to reveal?",
    options: [
      "The seller's personal financial standing.",
      "Local land charges and planning/highways information affecting the property, such as planning permissions, road schemes, and enforcement notices.",
      "The existence of any competing offers on the property.",
      "The buyer's own credit history."
    ],
    answer: 1,
    explanation: "The Local Authority search (LLC1 for local land charges, CON29 for additional enquiries) reveals matters like planning history, building regulations, road proposals, and enforcement notices affecting the property.",
    tags: ["LLC1", "CON29", "local searches"] },
  { id: "c063", subject: "FLK2", topic: "Landlord & Tenant (Commercial)", type: "sba",
    front: "A commercial tenant's lease is due to expire. The tenant wants statutory protection to remain in occupation and request a new lease. Which legislation is most relevant?",
    options: [
      "The Landlord and Tenant Act 1954, Part II (security of tenure for business tenancies).",
      "The Housing Act 1988.",
      "The Rent Act 1977.",
      "The Law of Property Act 1925 exclusively."
    ],
    answer: 0,
    explanation: "Part II of the Landlord and Tenant Act 1954 gives qualifying business tenants a statutory right to security of tenure and to apply for a new tenancy, subject to specified landlord grounds of opposition.",
    tags: ["Landlord and Tenant Act 1954", "security of tenure"] },

  /* --- Wills & Estate Administration (FLK2) — deeper coverage --- */
  { id: "c064", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A will is validly executed but the testator later marries. What is the general effect of the subsequent marriage on the earlier will under the Wills Act 1837 (as amended)?",
    options: [
      "No effect — the will remains fully valid.",
      "The will is generally revoked automatically by the subsequent marriage, subject to limited exceptions (e.g. a will made in contemplation of that marriage).",
      "Only the gifts to the new spouse are added automatically; the rest is unaffected.",
      "The will must be re-executed within 6 months or it lapses regardless of marriage."
    ],
    answer: 1,
    explanation: "S.18 Wills Act 1837 provides that marriage generally revokes an earlier will automatically, unless the will was made in contemplation of that specific marriage and expressed not to be revoked by it.",
    tags: ["s.18 Wills Act 1837", "revocation by marriage"] },
  { id: "c065", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A will appears to have been signed by the testator but only one witness was present at the time of signing, rather than the required two. Is the will likely to be validly executed under s.9 Wills Act 1837?",
    options: [
      "Yes — one witness is sufficient if the testator confirms the signature is genuine.",
      "No — s.9 Wills Act 1837 requires the will to be signed in the presence of two witnesses present at the same time, who then also sign in the testator's presence.",
      "Yes, provided the will is later notarised.",
      "No, because wills can never be validly witnessed by fewer than three people."
    ],
    answer: 1,
    explanation: "S.9 Wills Act 1837 requires the testator's signature to be made or acknowledged in the presence of two witnesses present at the same time, who must then also attest and sign in the testator's presence.",
    tags: ["s.9 Wills Act 1837", "execution of wills"] },

  /* --- Solicitors Accounts (FLK2) — deeper coverage --- */
  { id: "c066", subject: "FLK2", topic: "Solicitors Accounts", type: "sba",
    front: "A firm holds £2,000 of client money that is no longer needed for the matter and there is no reason to retain it. Under the SRA Accounts Rules, what should generally happen?",
    options: [
      "The firm may retain it indefinitely as working capital.",
      "The firm must return it to the client promptly, as client money should not be retained without proper reason.",
      "The firm should transfer it to the office account automatically after 6 months.",
      "The firm should donate it to charity if the client cannot be reached within a week."
    ],
    answer: 1,
    explanation: "Under the SRA Accounts Rules, client money must be returned promptly to the client (or other entitled person) as soon as there is no longer a proper reason to hold it.",
    tags: ["SRA Accounts Rules", "return of client money"] },
  { id: "c067", subject: "FLK2", topic: "Solicitors Accounts", type: "sba",
    front: "A solicitor issues a bill for costs to a client for whom the firm is holding funds in the client account. What must generally happen before the firm can transfer the relevant sum from client account to office account?",
    options: [
      "Nothing further — funds can be moved at any time regardless of billing.",
      "A bill of costs (or other written notification of costs) must have been delivered to the client, and only the amount covered by the bill may be transferred.",
      "The client must first provide new funds separately for the office account.",
      "The firm must wait 30 days after billing regardless of client agreement."
    ],
    answer: 1,
    explanation: "Under the SRA Accounts Rules, money can only move from client to office account once a bill (or other written notification of costs) has been delivered, and only up to the amount properly billed.",
    tags: ["SRA Accounts Rules", "billing and transfers"] },

  /* --- Contract Law (FLK1) — batch 3 --- */
  { id: "c068", subject: "FLK1", topic: "Misrepresentation", type: "sba",
    front: "A seller innocently states a fact about a car's mileage that turns out to be false, honestly believing it to be true with no negligence. The buyer relies on it and contracts to buy. Which remedy is most likely available?",
    options: [
      "Damages under s.2(1) Misrepresentation Act 1967 only, never rescission.",
      "Rescission of the contract, and possibly damages in lieu under s.2(2) Misrepresentation Act 1967 at the court's discretion, even though the misrepresentation was wholly innocent.",
      "No remedy at all, since the statement was made honestly.",
      "Only specific performance is available."
    ],
    answer: 1,
    explanation: "Even innocent misrepresentation entitles the representee to rescind the contract; the court has discretion under s.2(2) Misrepresentation Act 1967 to award damages in lieu of rescission.",
    tags: ["Misrepresentation Act 1967", "rescission"] },
  { id: "c069", subject: "FLK1", topic: "Misrepresentation", type: "sba",
    front: "A party makes a false statement of fact negligently (without reasonable grounds to believe it true) which induces the other party to contract. Under s.2(1) Misrepresentation Act 1967, who bears the burden of proving reasonable grounds existed?",
    options: [
      "The representee (claimant) must prove the representor lacked reasonable grounds.",
      "The representor (defendant) bears the burden of proving they had reasonable grounds to believe the statement was true.",
      "Neither party bears any burden; the court decides on the balance of probabilities as a matter of general fairness.",
      "The burden shifts to a third party if one was involved in the negotiation."
    ],
    answer: 1,
    explanation: "S.2(1) Misrepresentation Act 1967 reverses the normal burden of proof: once a false statement inducing the contract is shown, the maker must prove they had reasonable grounds to believe it true.",
    tags: ["s.2(1) Misrepresentation Act 1967", "burden of proof"] },
  { id: "c070", subject: "FLK1", topic: "Vitiating Factors", type: "sba",
    front: "A bank obtains a guarantee from a wife over the family home for her husband's business debts, without ensuring she received independent advice, in circumstances where the bank was put on inquiry as to possible undue influence. What is the likely consequence for the bank's security?",
    options: [
      "The guarantee remains fully enforceable regardless of the circumstances.",
      "The bank may be unable to enforce the guarantee against the wife if it failed to take reasonable steps (e.g. ensuring independent legal advice) once put on inquiry (Royal Bank of Scotland v Etridge (No 2)).",
      "The guarantee is automatically void from the outset with no fault-based analysis.",
      "The husband alone becomes liable for the full debt regardless of the guarantee."
    ],
    answer: 1,
    explanation: "Etridge (No 2) sets out the steps a bank must take once put on inquiry of possible undue influence in surety cases, including ensuring the surety receives independent advice — failure can render the security unenforceable against the surety.",
    tags: ["undue influence", "Etridge (No 2)"] },

  /* --- Tort (FLK1) — batch 3 --- */
  { id: "c071", subject: "FLK1", topic: "Nuisance", type: "sba",
    front: "A factory emits noise and smells that substantially and unreasonably interfere with a neighbour's use and enjoyment of their land over a sustained period. Which tort is most directly engaged?",
    options: [
      "Trespass to land.",
      "Private nuisance.",
      "Negligence exclusively — nuisance no longer exists as a separate tort.",
      "Defamation."
    ],
    answer: 1,
    explanation: "Private nuisance protects against substantial and unreasonable interference with the use and enjoyment of land, distinct from trespass (which requires direct physical interference).",
    tags: ["private nuisance"] },
  { id: "c072", subject: "FLK1", topic: "Defamation", type: "sba",
    front: "A newspaper publishes a false statement about an individual which is likely to cause serious harm to their reputation. Under the Defamation Act 2013, what must the claimant additionally show for the statement to be actionable?",
    options: [
      "Nothing further — falsity alone is sufficient.",
      "That the statement has caused, or is likely to cause, serious harm to their reputation (s.1 Defamation Act 2013).",
      "That the statement was made with malice in every case.",
      "That the newspaper had no defence of truth available."
    ],
    answer: 1,
    explanation: "S.1 Defamation Act 2013 introduced a 'serious harm' threshold — a statement is not defamatory unless its publication has caused or is likely to cause serious harm to the claimant's reputation.",
    tags: ["Defamation Act 2013", "serious harm"] },
  { id: "c073", subject: "FLK1", topic: "Negligence — Economic Loss", type: "sba",
    front: "A surveyor negligently over-values a property in a report relied upon by a lender who suffers financial loss when the borrower defaults. Is a duty of care likely to be owed for this pure economic loss?",
    options: [
      "No — pure economic loss is never recoverable in the tort of negligence.",
      "Potentially yes — where there is a special relationship involving an assumption of responsibility and reasonable reliance, a duty can arise for negligent misstatement causing pure economic loss (Hedley Byrne v Heller).",
      "No — economic loss claims can only be brought in contract.",
      "Yes, automatically, regardless of any relationship between the parties."
    ],
    answer: 1,
    explanation: "Hedley Byrne v Heller established that a duty of care can arise for negligent misstatements causing pure economic loss where there is a special relationship involving assumption of responsibility and reasonable reliance.",
    tags: ["Hedley Byrne v Heller", "pure economic loss"] },

  /* --- Criminal Law (FLK1) — batch 3 --- */
  { id: "c074", subject: "FLK1", topic: "Non-Fatal Offences", type: "sba",
    front: "D throws a glass at a wall in anger; a shard ricochets and cuts V's face, requiring stitches. D did not intend to hit V but was reckless as to whether someone might be hurt. Which offence is most likely made out?",
    options: [
      "Common assault only, since there was no direct intention to injure V.",
      "An offence under s.20 OAPA 1861 (or s.47, depending on severity of injury) — D acted recklessly as to whether some harm would result, which can satisfy the mens rea for these offences (R v Cunningham; R v Savage).",
      "No offence at all, as recklessness can never found liability for non-fatal offences.",
      "Murder, since D acted with an unlawful intent."
    ],
    answer: 1,
    explanation: "Offences under ss.20/47 OAPA 1861 can be satisfied by subjective recklessness as to some harm resulting (R v Cunningham; R v Savage), even without intent to injure the specific victim.",
    tags: ["s.20 OAPA 1861", "recklessness", "R v Cunningham"] },
  { id: "c075", subject: "FLK1", topic: "Criminal Damage", type: "sba",
    front: "D sets fire to their own property intending to damage it, but the fire spreads and destroys a neighbour's property that D never intended or foresaw would be at risk. Could D still be liable for aggravated arson endangering life?",
    options: [
      "No — D can never be liable for consequences they did not foresee.",
      "Potentially yes for basic criminal damage/arson to the neighbour's property under an objective recklessness standard (R v G established a subjective test, so D's own foresight — even if only of some risk — would need to be assessed).",
      "No, because it was D's own property that was set alight initially.",
      "Yes, automatically, regardless of any assessment of foresight."
    ],
    answer: 1,
    explanation: "Following R v G (2003), recklessness for criminal damage is subjective — D must have foreseen a risk of damage to property belonging to another and unreasonably taken that risk; the facts require assessing D's actual foresight.",
    tags: ["Criminal Damage Act 1971", "R v G", "subjective recklessness"] },

  /* --- Land Law (FLK1) — batch 3 --- */
  { id: "c076", subject: "FLK1", topic: "Freehold Covenants", type: "sba",
    front: "A restrictive covenant not to build on land was validly entered into decades ago. The original covenantee has since sold the benefiting land to a new owner. Can the new owner enforce the covenant against the current owner of the burdened land in equity?",
    options: [
      "No — the benefit of a covenant can never pass to a successor.",
      "Potentially yes, if the benefit has passed by annexation, assignment, or a building scheme, and the burden runs in equity under the rule in Tulk v Moxhay.",
      "No, because restrictive covenants automatically expire after 12 years.",
      "Yes, but only if the covenant was registered as a legal easement."
    ],
    answer: 1,
    explanation: "Tulk v Moxhay allows the burden of a restrictive covenant to run in equity against successors, and the benefit can pass via annexation, express assignment, or a building scheme, subject to the usual requirements.",
    tags: ["Tulk v Moxhay", "restrictive covenants"] },

  /* --- Trusts (FLK1) — batch 3 --- */
  { id: "c077", subject: "FLK1", topic: "Breach of Trust & Tracing", type: "sba",
    front: "A trustee wrongfully mixes trust money with their own funds in a personal bank account, then makes withdrawals and payments over time. The beneficiary wants to trace the trust money into remaining/traceable assets. Which equitable tracing rule is most relevant to identifying what belongs to the trust in a mixed fund?",
    options: [
      "The 'first in, first out' rule from Clayton's Case, or the beneficiary may instead choose the rule most favourable to them (Re Hallett's Estate; Re Oatway).",
      "Tracing is impossible once trust money is mixed with the trustee's own funds.",
      "The trustee automatically forfeits all funds in the account regardless of source.",
      "Only common law tracing applies to mixed funds, never equitable tracing."
    ],
    answer: 0,
    explanation: "Where a trustee mixes trust money with their own, equitable tracing rules (e.g. Re Hallett's Estate, Re Oatway) generally favour the beneficiary, allowing them to claim traceable proceeds or a charge over the mixed fund; Clayton's Case (FIFO) may apply in some banking contexts but is often displaced.",
    tags: ["tracing", "Re Hallett's Estate", "Clayton's Case"] },

  /* --- Constitutional & Administrative Law (FLK1) — batch 2 --- */
  { id: "c078", subject: "FLK1", topic: "Human Rights Act 1998", type: "sba",
    front: "A UK court is interpreting a statute that appears to conflict with a Convention right under the ECHR. What does s.3 Human Rights Act 1998 require the court to do, where possible?",
    options: [
      "Strike down the statute as invalid.",
      "Read and give effect to the legislation, so far as it is possible to do so, in a way which is compatible with Convention rights.",
      "Ignore the Convention right entirely, since Parliament is sovereign.",
      "Refer the matter automatically to the European Court of Human Rights."
    ],
    answer: 1,
    explanation: "S.3 HRA 1998 requires courts to interpret legislation compatibly with Convention rights so far as possible; if not possible, a higher court may instead issue a declaration of incompatibility under s.4 (which does not invalidate the statute).",
    tags: ["Human Rights Act 1998", "s.3", "s.4"] },
  { id: "c079", subject: "FLK1", topic: "Parliamentary Sovereignty", type: "sba",
    front: "Under the traditional Diceyan concept of parliamentary sovereignty, which of the following best describes the position of an Act of Parliament?",
    options: [
      "Acts of Parliament can be struck down by domestic courts if unconstitutional.",
      "Parliament can make or unmake any law, and no person or body (including the courts) may override or set aside an Act of Parliament.",
      "Only the House of Lords, not the House of Commons, holds sovereign law-making power.",
      "Acts of Parliament automatically expire after 10 years unless renewed."
    ],
    answer: 1,
    explanation: "Dicey's classic formulation of parliamentary sovereignty holds that Parliament has unlimited legislative competence and its Acts cannot be overridden or invalidated by any other body, including the courts.",
    tags: ["parliamentary sovereignty", "Dicey"] },

  /* --- Business Law & Practice (FLK2) — batch 3 --- */
  { id: "c080", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "Shareholders wish to remove a director before the end of their term. Which statutory provision generally allows this by ordinary resolution, subject to procedural requirements?",
    options: [
      "S.168 Companies Act 2006, which allows removal by ordinary resolution with special notice.",
      "Directors can never be removed before their term ends.",
      "Only the board of directors, not the shareholders, can remove a director.",
      "Removal always requires a special resolution (75%)."
    ],
    answer: 0,
    explanation: "S.168 CA 2006 allows a company to remove a director by ordinary resolution before the expiration of their period of office, subject to special notice requirements and the director's right to make representations.",
    tags: ["s.168 CA 2006", "removal of directors"] },
  { id: "c081", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "A company wants to pay a dividend to shareholders. Which key requirement must generally be satisfied under the Companies Act 2006 before doing so?",
    options: [
      "The company must have sufficient distributable profits, assessed by reference to relevant accounts (ss.830-831 CA 2006).",
      "No financial requirement applies — dividends can be paid regardless of profit.",
      "Only cash reserves matter; profit is irrelevant.",
      "Dividends may only be paid from share capital."
    ],
    answer: 0,
    explanation: "Ss.830-831 CA 2006 require a company to have sufficient distributable profits (accumulated realised profits less accumulated realised losses) before lawfully paying a dividend.",
    tags: ["ss.830-831 CA 2006", "distributable profits"] },

  /* --- Dispute Resolution (FLK2) — batch 3 --- */
  { id: "c082", subject: "FLK2", topic: "Evidence & Trial", type: "sba",
    front: "In civil proceedings, what is the standard of proof a claimant must generally satisfy to succeed on a disputed factual issue?",
    options: [
      "Beyond reasonable doubt.",
      "The balance of probabilities — that the fact is more likely than not to be true.",
      "Clear and convincing evidence, a heightened civil standard.",
      "No standard of proof applies in civil cases."
    ],
    answer: 1,
    explanation: "The civil standard of proof is the balance of probabilities, i.e. that a fact is more likely than not to be true — a lower threshold than the criminal standard of beyond reasonable doubt.",
    tags: ["standard of proof", "balance of probabilities"] },
  { id: "c083", subject: "FLK2", topic: "Alternative Dispute Resolution", type: "sba",
    front: "A party unreasonably refuses to engage in ADR (e.g. mediation) suggested by the other side during litigation, and ultimately wins at trial. What is a likely consequence the court may impose?",
    options: [
      "None — refusal to engage in ADR has no costs consequences.",
      "The court may depart from the usual costs order and penalise the successful party (e.g. reduced costs recovery) for unreasonable refusal to engage in ADR.",
      "The claim is automatically struck out.",
      "The refusing party is held in contempt of court."
    ],
    answer: 1,
    explanation: "Courts can and do penalise parties in costs for unreasonably refusing to engage in ADR, even where that party ultimately succeeds at trial (Halsey v Milton Keynes General NHS Trust and subsequent case law).",
    tags: ["ADR", "costs sanctions", "Halsey v Milton Keynes"] },

  /* --- Property Practice (FLK2) — batch 3 --- */
  { id: "c084", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "On completion of a residential purchase, which of the following is a standard step the buyer's solicitor must attend to promptly afterward?",
    options: [
      "Nothing further is required once completion monies are sent.",
      "Paying any Stamp Duty Land Tax (or equivalent) due and applying to register the buyer's title at the Land Registry within the priority period.",
      "Re-negotiating the purchase price with the seller.",
      "Cancelling the buyer's mortgage offer."
    ],
    answer: 1,
    explanation: "Post-completion, the buyer's solicitor must pay any SDLT/LTT due and submit the application to register the buyer's title (and any mortgage) at the Land Registry, generally within the priority period conferred by the pre-completion search.",
    tags: ["post-completion", "SDLT", "Land Registry"] },
  { id: "c085", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "A buyer's solicitor carries out a pre-completion search (OS1) against registered land. What is the primary purpose of this search?",
    options: [
      "To check for local authority planning matters.",
      "To reveal any adverse entries made on the register since the date of the official copies, and to confer a priority period protecting the buyer's application to register.",
      "To confirm the seller's identity for AML purposes only.",
      "To verify the property's council tax band."
    ],
    answer: 1,
    explanation: "An OS1 search reveals any changes to the register since the official copies were obtained and gives the applicant a priority period during which their subsequent registration application takes priority over most later entries.",
    tags: ["OS1 search", "priority period"] },

  /* --- Wills & Estate Administration (FLK2) — batch 3 --- */
  { id: "c086", subject: "FLK2", topic: "Inheritance Tax", type: "sba",
    front: "An individual dies leaving their entire estate to their surviving spouse. What is the general Inheritance Tax treatment of this gift?",
    options: [
      "It is taxed at the full rate of 40% above the nil rate band.",
      "It is generally fully exempt under the spouse exemption, regardless of value (assuming both are UK-domiciled).",
      "Only the first £325,000 is exempt; the rest is taxed normally.",
      "IHT is charged at a reduced rate of 20% on transfers to a spouse."
    ],
    answer: 1,
    explanation: "Transfers between UK-domiciled spouses/civil partners are generally fully exempt from Inheritance Tax, regardless of the value transferred, under the spouse exemption.",
    tags: ["Inheritance Tax", "spouse exemption"] },
  { id: "c087", subject: "FLK2", topic: "Inheritance Tax", type: "sba",
    front: "A person makes a gift to an individual seven years and one day before their death. What is the general IHT treatment of this potentially exempt transfer (PET)?",
    options: [
      "It remains fully chargeable to IHT regardless of the time elapsed.",
      "It falls outside the estate for IHT purposes, as it survives the full 7-year period required for a PET to become exempt.",
      "It is taxed at a flat rate of 40% no matter when death occurs.",
      "PETs are always chargeable if made to an individual rather than a trust."
    ],
    answer: 1,
    explanation: "A potentially exempt transfer becomes fully exempt from IHT if the donor survives seven years from the date of the gift; surviving just over 7 years takes it outside the charge.",
    tags: ["potentially exempt transfer", "7-year rule"] },

  /* --- Solicitors Accounts & Ethics (FLK2) — batch 3 --- */
  { id: "c088", subject: "FLK2", topic: "Professional Conduct", type: "sba",
    front: "A solicitor is asked by a long-standing client to act in a matter where the solicitor's own personal financial interests conflict with the client's interests. Under the SRA Principles/Code of Conduct, what is the solicitor's general obligation?",
    options: [
      "To proceed as normal since the client trusts the solicitor.",
      "To not act where there is an own-interest conflict, as this cannot typically be managed by informed consent in the way client conflicts sometimes can.",
      "To act, but simply disclose the conflict to the client afterward.",
      "To delegate the matter entirely to a trainee to avoid the conflict."
    ],
    answer: 1,
    explanation: "The SRA Codes of Conduct prohibit acting where there is an own-interest conflict, or a significant risk of one — unlike some client conflicts, this generally cannot be cured by consent.",
    tags: ["SRA Code of Conduct", "own-interest conflict"] },
  { id: "c089", subject: "FLK2", topic: "Professional Conduct", type: "sba",
    front: "A solicitor suspects, in the course of acting, that a transaction may involve money laundering. What is the solicitor's primary obligation under the Proceeds of Crime Act 2002?",
    options: [
      "To confront the client directly and demand an explanation.",
      "To make a Suspicious Activity Report (SAR) to the National Crime Agency and refrain from tipping off the client.",
      "To continue acting normally, since suspicion alone is not enough to act on.",
      "To terminate the retainer immediately without any report."
    ],
    answer: 1,
    explanation: "POCA 2002 requires regulated persons who know or suspect money laundering to submit a Suspicious Activity Report to the NCA, and prohibits 'tipping off' the client about the report.",
    tags: ["POCA 2002", "Suspicious Activity Report", "tipping off"] },

  /* --- Additional cross-subject SBAs --- */
  { id: "c090", subject: "FLK1", topic: "Contract Formation", type: "sba",
    front: "An offer states 'this offer is open for 7 days'. On day 3, the offeror sells the item to someone else and informs the original offeree the following day. Can the original offeree still accept the offer on day 5?",
    options: [
      "Yes — the offer remains open for the full 7 days regardless of any sale.",
      "No — the offer is effectively revoked once the offeree receives reliable information that the offeror has dealt with the subject matter inconsistently with the offer (Dickinson v Dodds).",
      "Yes, provided the offeree did not know about the sale.",
      "No, because offers can never be revoked once a time limit is stated."
    ],
    answer: 1,
    explanation: "Dickinson v Dodds established that an offer can be impliedly revoked where the offeree learns, through a reliable source, that the offeror has acted inconsistently with the offer (e.g. sold the subject matter) — even before any formal notice of revocation.",
    tags: ["revocation of offer", "Dickinson v Dodds"] },
  { id: "c091", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A rescuer is injured while attempting to save someone endangered by the defendant's negligence. Can the rescuer generally claim against the original wrongdoer?",
    options: [
      "No — a rescuer is always treated as a novus actus interveniens, breaking the chain of causation.",
      "Yes — the law recognises rescuers as foreseeable claimants, and voluntary intervention to rescue does not usually break the chain of causation (Haynes v Harwood).",
      "No — rescuers can only claim against the person they rescued, never the original wrongdoer.",
      "Yes, but only if the rescuer is a professional emergency responder."
    ],
    answer: 1,
    explanation: "Haynes v Harwood and related authorities establish that rescuers are foreseeable claimants and their intervention to assist does not usually break the chain of causation from the defendant's original negligence.",
    tags: ["rescuer cases", "Haynes v Harwood", "novus actus interveniens"] },

  /* --- Contract Law (FLK1) — batch 4 --- */
  { id: "c092", subject: "FLK1", topic: "Consideration", type: "sba",
    front: "A debtor owes £1,000. The creditor agrees to accept £700 in full settlement, and the debtor pays £700 as agreed. Later the creditor sues for the remaining £300. Applying the rule in Pinnel's Case, is the creditor likely to succeed?",
    options: [
      "No — payment of a lesser sum can never satisfy a larger debt without something extra (e.g. earlier payment, different location, or additional consideration), so the creditor can still claim the balance, subject to equitable exceptions like promissory estoppel.",
      "Yes — the agreement to accept less is always binding once performed.",
      "No — because part payment always automatically discharges the whole debt.",
      "Yes, but only if the debtor was declared bankrupt first."
    ],
    answer: 0,
    explanation: "Pinnel's Case (and Foakes v Beer) hold that part payment of a debt is not good consideration for a promise to forgo the balance, absent some additional benefit — though promissory estoppel may prevent going back on the promise in some circumstances.",
    tags: ["Pinnel's Case", "Foakes v Beer", "part payment"] },
  { id: "c093", subject: "FLK1", topic: "Consideration", type: "sba",
    front: "A contractor already contractually bound to complete works for a client is promised extra money to finish on time, and does so, but performs no more than originally required except the client derives a practical benefit from avoiding a penalty clause with a third party. Is the extra promise likely to be enforceable, per Williams v Roffey?",
    options: [
      "No — performing an existing contractual duty can never amount to consideration.",
      "Yes — a practical benefit to the promisor (e.g. avoiding a penalty, securing timely performance) can amount to good consideration for a promise of extra payment (Williams v Roffey Bros), absent economic duress or fraud.",
      "No, because only fresh, additional physical work can count as consideration.",
      "Yes, but only if the original contract is first rescinded and a new one formed."
    ],
    answer: 1,
    explanation: "Williams v Roffey Bros established that performing an existing contractual duty can constitute consideration for a new promise if it confers a practical benefit on the promisor, provided there is no duress or fraud.",
    tags: ["Williams v Roffey Bros", "practical benefit"] },

  /* --- Tort (FLK1) — batch 4 --- */
  { id: "c094", subject: "FLK1", topic: "Employers' Liability", type: "sba",
    front: "An employee is injured due to a lack of proper safety equipment provided by the employer. Which duty is most directly relevant, distinct from vicarious liability?",
    options: [
      "The employer's non-delegable, personal common law duty to provide a safe system of work, including proper equipment (Wilsons & Clyde Coal v English).",
      "Only statutory strict liability under the Consumer Protection Act 1987 applies.",
      "The employer owes no personal duty; only vicarious liability for co-workers applies.",
      "Occupiers' liability exclusively governs workplace injuries."
    ],
    answer: 0,
    explanation: "Employers owe a personal, non-delegable duty at common law to provide competent staff, safe equipment, a safe system of work, and a safe place of work (Wilsons & Clyde Coal Co v English).",
    tags: ["employers' liability", "safe system of work"] },
  { id: "c095", subject: "FLK1", topic: "Contributory Negligence", type: "sba",
    front: "A cyclist injured by a negligent driver was not wearing a helmet, which increased the severity of head injuries suffered. What is the likely effect on damages under the Law Reform (Contributory Negligence) Act 1945?",
    options: [
      "No effect — contributory negligence only applies to causes of the accident itself, never to failure to mitigate injury severity.",
      "Damages may be reduced to the extent the claimant's own fault (e.g. failing to wear protective equipment) contributed to the extent of the injury, even if not to the accident itself.",
      "The claim is barred entirely, as contributory negligence is a complete defence.",
      "Damages are automatically halved regardless of the specific facts."
    ],
    answer: 1,
    explanation: "Contributory negligence can apply where the claimant's own fault contributed to the extent/severity of injury (not just causing the accident), and damages are reduced 'to such extent as the court thinks just and equitable' under the 1945 Act.",
    tags: ["Law Reform (Contributory Negligence) Act 1945"] },

  /* --- Criminal Law (FLK1) — batch 4 --- */
  { id: "c096", subject: "FLK1", topic: "Fraud", type: "sba",
    front: "D dishonestly makes a false representation about a product's quality to induce V to purchase it, intending to make a gain. Under the Fraud Act 2006, must V actually have been deceived and suffered loss for D to be guilty of fraud by false representation?",
    options: [
      "Yes — actual deception and loss are essential elements of the offence.",
      "No — fraud by false representation under s.2 Fraud Act 2006 is complete once D dishonestly makes the false representation with intent to gain/cause loss, regardless of whether anyone was actually deceived or loss occurred.",
      "Yes, but only loss needs to be shown, not deception.",
      "No offence exists under the Fraud Act 2006 for representations about product quality."
    ],
    answer: 1,
    explanation: "Fraud by false representation (s.2 Fraud Act 2006) is a conduct crime — it is complete on the dishonest false representation made with the requisite intent, without needing proof that anyone was actually deceived or suffered loss.",
    tags: ["Fraud Act 2006", "s.2", "false representation"] },
  { id: "c097", subject: "FLK1", topic: "Robbery", type: "sba",
    front: "D snatches a bag from V's shoulder, using only the force necessary to pull it free, causing no injury. Is D likely guilty of robbery under s.8 Theft Act 1968?",
    options: [
      "No — robbery requires injury to the victim.",
      "Potentially yes — robbery requires theft plus the use or threat of force on any person immediately before or at the time of the theft, in order to steal; even modest force used to overcome resistance (e.g. wrenching a bag free) can suffice (R v Clouden-type reasoning), though very minimal contact might not.",
      "No — robbery can only be committed with a weapon.",
      "Yes, but only if D also caused actual bodily harm."
    ],
    answer: 1,
    explanation: "S.8 Theft Act 1968 requires force (or threat of force) used on a person to steal; the force need not cause injury — pulling/wrenching an item from someone's grip has been held capable of satisfying this element.",
    tags: ["s.8 Theft Act 1968", "robbery"] },

  /* --- Land Law (FLK1) — batch 4 --- */
  { id: "c098", subject: "FLK1", topic: "Adverse Possession", type: "sba",
    front: "A squatter has been in factual possession of registered land, with the requisite intention to possess, for 12 years without the registered proprietor's consent. Under the Land Registration Act 2002, does the squatter automatically acquire title?",
    options: [
      "Yes — 12 years' adverse possession automatically extinguishes the registered proprietor's title.",
      "No — under the LRA 2002 regime, the squatter must apply to be registered as proprietor after 10 years, triggering a notice procedure that gives the paper owner an opportunity to object and evict, unlike the old unregistered land rules.",
      "No — adverse possession has been entirely abolished for registered land.",
      "Yes, but only after 30 years for registered land."
    ],
    answer: 1,
    explanation: "For registered land under the LRA 2002, a squatter can apply to be registered after 10 years' adverse possession, but the registered proprietor is notified and can object, generally defeating the claim unless specific exceptions apply — a significant change from the old 12-year 'automatic' unregistered land rule.",
    tags: ["adverse possession", "LRA 2002"] },

  /* --- Trusts (FLK1) — batch 4 --- */
  { id: "c099", subject: "FLK1", topic: "Charitable Trusts", type: "sba",
    front: "A trust is set up 'for the relief of poverty among former employees of a specific company'. Is this likely to qualify as a valid charitable trust despite the narrow class of beneficiaries?",
    options: [
      "No — charitable trusts always require the public benefit test to apply in the same way as for all other charitable purposes, with no exceptions.",
      "Yes — poverty trusts have historically been treated as an exception to the strict public benefit requirement, allowing a personal nexus/narrow class (Dingle v Turner).",
      "No — trusts limited to employees of a company can never be charitable.",
      "Yes, but only if it is also registered as a private family trust."
    ],
    answer: 1,
    explanation: "Dingle v Turner established that poverty trusts benefit from a relaxed public benefit requirement, permitting trusts for the poor among a defined class (e.g. employees) to still qualify as charitable.",
    tags: ["charitable trusts", "Dingle v Turner", "poverty exception"] },

  /* --- Business Law & Practice (FLK2) — batch 4 --- */
  { id: "c100", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "A private company wishes to alter its articles of association. What level of shareholder approval is generally required under the Companies Act 2006?",
    options: [
      "An ordinary resolution (over 50%).",
      "A special resolution (75% majority) under s.21 CA 2006.",
      "Unanimous written consent of all shareholders in every case.",
      "No shareholder approval is needed; the board can amend articles unilaterally."
    ],
    answer: 1,
    explanation: "S.21 CA 2006 requires a special resolution (75% majority) of shareholders to alter a company's articles of association.",
    tags: ["s.21 CA 2006", "special resolution", "articles of association"] },
  { id: "c101", subject: "FLK2", topic: "Share Capital & Financing", type: "sba",
    front: "A company wishes to create a floating charge over its fluctuating stock and receivables as security for a loan. What is a key characteristic that distinguishes a floating charge from a fixed charge?",
    options: [
      "A floating charge attaches to specific identified assets immediately upon creation, just like a fixed charge.",
      "A floating charge hovers over a class of changing assets, allowing the company to deal with them in the ordinary course of business until crystallisation.",
      "Floating charges cannot be registered at Companies House.",
      "Floating charges rank automatically above fixed charges in a liquidation."
    ],
    answer: 1,
    explanation: "A floating charge covers a fluctuating class of assets (e.g. stock, receivables), leaving the company free to deal with them in the ordinary course of business until an event of crystallisation fixes the charge onto specific assets.",
    tags: ["floating charge", "company security"] },

  /* --- Dispute Resolution (FLK2) — batch 4 --- */
  { id: "c102", subject: "FLK2", topic: "Interim Applications", type: "sba",
    front: "A claimant fears the defendant will dissipate assets before judgment, defeating any eventual award. Which interim remedy is specifically designed to prevent this?",
    options: [
      "A search order.",
      "A freezing injunction (Mareva injunction).",
      "Summary judgment.",
      "An interim payment order."
    ],
    answer: 1,
    explanation: "A freezing injunction (historically 'Mareva injunction') restrains a defendant from dissipating or dealing with assets in a way that would frustrate a future judgment.",
    tags: ["freezing injunction", "interim remedies"] },
  { id: "c103", subject: "FLK2", topic: "Interim Applications", type: "sba",
    front: "A defendant has no real prospect of successfully defending a claim and there is no other compelling reason for trial. Which application might the claimant make to dispose of the case early?",
    options: [
      "An application to strike out the defence only.",
      "An application for summary judgment under CPR Part 24.",
      "An application for security for costs.",
      "An application for a stay of proceedings."
    ],
    answer: 1,
    explanation: "CPR Part 24 allows a party to apply for summary judgment where the other side has no real prospect of success on the claim/defence and there is no other compelling reason for the case to go to trial.",
    tags: ["CPR Part 24", "summary judgment"] },

  /* --- Property Practice (FLK2) — batch 4 --- */
  { id: "c104", subject: "FLK2", topic: "Leasehold Enfranchisement & Residential", type: "sba",
    front: "A long leaseholder of a flat wants to extend their lease term and remove/reduce ground rent. Which general statutory route is most relevant?",
    options: [
      "The Landlord and Tenant Act 1954, Part II.",
      "Statutory lease extension rights under leasehold enfranchisement legislation (e.g. Leasehold Reform, Housing and Urban Development Act 1993, as amended).",
      "The Rent Act 1977.",
      "There is no statutory right to extend a residential lease."
    ],
    answer: 1,
    explanation: "Qualifying long leaseholders of flats have a statutory right to a lease extension under leasehold enfranchisement legislation, historically the 1993 Act (as amended by more recent reforms).",
    tags: ["leasehold enfranchisement", "lease extension"] },
  { id: "c105", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "In a conveyancing transaction, the buyer's solicitor is conducting Anti-Money Laundering (AML) checks. What is a core requirement under the Money Laundering Regulations?",
    options: [
      "Verifying the identity of the client and, where relevant, the source of funds for the transaction.",
      "Checking only the seller's identity, never the buyer's.",
      "AML checks are optional in residential conveyancing.",
      "Verifying identity is only required for cash transactions over £1 million."
    ],
    answer: 0,
    explanation: "Under the Money Laundering Regulations, solicitors must carry out customer due diligence, including verifying client identity and, in higher-risk cases, considering the source of funds/wealth.",
    tags: ["Money Laundering Regulations", "AML", "customer due diligence"] },

  /* --- Wills & Estate Administration (FLK2) — batch 4 --- */
  { id: "c106", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A beneficiary under a will is also one of only two attesting witnesses to that will. What is the general effect on the gift to that beneficiary under s.15 Wills Act 1837?",
    options: [
      "No effect — witnesses can also be beneficiaries without any consequence.",
      "The gift to that witness-beneficiary is generally void, although the will itself remains validly executed if there are sufficient other witnesses.",
      "The entire will becomes invalid.",
      "The witness must return double the value of the gift to the estate."
    ],
    answer: 1,
    explanation: "S.15 Wills Act 1837 provides that a gift to an attesting witness (or their spouse) is void, though the will remains valid provided it is otherwise properly executed (e.g. with a sufficient number of other independent witnesses).",
    tags: ["s.15 Wills Act 1837", "beneficiary witnessing"] },
  { id: "c107", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A person dies intestate with no surviving spouse, children, parents, or siblings, but is survived by a grandparent. Under the statutory order of intestate succession, who is next entitled?",
    options: [
      "The estate passes to the Crown (bona vacantia) automatically, skipping grandparents.",
      "Grandparents are entitled to inherit under the statutory order, ranking after siblings but before uncles/aunts.",
      "Grandparents can never inherit under intestacy rules.",
      "The estate is divided equally between the state and any charity of the deceased's choosing."
    ],
    answer: 1,
    explanation: "The statutory order of intestate succession includes grandparents as a category (after spouse, issue, parents, and siblings), before more remote relatives like aunts/uncles, with bona vacantia only applying if no qualifying relative exists.",
    tags: ["intestacy", "statutory order of succession"] },

  /* --- Solicitors Accounts & Ethics (FLK2) — batch 4 --- */
  { id: "c108", subject: "FLK2", topic: "Professional Conduct", type: "sba",
    front: "A solicitor discovers that a colleague at the firm has been dishonestly overbilling clients. What is the solicitor's general obligation under the SRA Principles?",
    options: [
      "To say nothing, as internal firm matters are confidential from the regulator.",
      "To report the matter as required, given the SRA Principles' overriding duties around integrity, upholding the rule of law, and public trust, which can require reporting serious misconduct.",
      "To resolve it privately with the colleague and never escalate it.",
      "To wait until a client formally complains before taking any action."
    ],
    answer: 1,
    explanation: "The SRA Principles require solicitors to act with integrity and uphold public trust in the profession; serious misconduct such as dishonest overbilling generally triggers reporting obligations to the firm and/or the SRA.",
    tags: ["SRA Principles", "reporting misconduct"] },
  { id: "c109", subject: "FLK2", topic: "Professional Conduct", type: "sba",
    front: "A solicitor is instructed by two clients on the same matter (e.g. a joint purchase) and a conflict of interest later emerges between them. What is the SRA's general position on continuing to act for both?",
    options: [
      "The solicitor may always continue to act for both, provided fees are split evenly.",
      "The solicitor must generally cease acting for both (or at least one) once a client conflict, or significant risk of one, arises, subject to narrow exceptions where clients share a substantially common interest and give informed consent.",
      "The solicitor may continue acting for whichever client pays first.",
      "Conflicts between joint clients are never possible under the Code of Conduct."
    ],
    answer: 1,
    explanation: "Under the SRA Code, solicitors must not act where there is a client conflict (or significant risk of one) unless a limited exception applies (e.g. substantially common interest or competing for the same objective) with informed consent — otherwise they must cease acting for one or both.",
    tags: ["SRA Code of Conduct", "client conflicts"] },

  /* --- Cross-subject batch 4 additions --- */
  { id: "c110", subject: "FLK1", topic: "Terms", type: "sba",
    front: "A contract for the sale of goods by a business to a consumer includes a term excluding the implied term as to satisfactory quality under the Consumer Rights Act 2015. Is this exclusion likely to be effective?",
    options: [
      "Yes, provided it is reasonable under UCTA 1977.",
      "No — under the Consumer Rights Act 2015, the trader cannot exclude or restrict the statutory implied term as to satisfactory quality in a consumer contract.",
      "Yes, if the consumer signs a separate waiver.",
      "No, but only where the goods are second-hand."
    ],
    answer: 1,
    explanation: "The Consumer Rights Act 2015 prevents traders from excluding or limiting the core consumer protections, including the implied term of satisfactory quality, in consumer contracts.",
    tags: ["Consumer Rights Act 2015", "satisfactory quality"] },
  { id: "c111", subject: "FLK1", topic: "Negligence", type: "sba",
    front: "A claimant's injury is aggravated by negligent medical treatment received after the original tort. Is the original tortfeasor generally liable for the aggravated harm caused by that subsequent negligent treatment?",
    options: [
      "No — negligent medical treatment always breaks the chain of causation entirely.",
      "Usually yes — ordinary negligent medical treatment of an injury caused by the defendant does not usually break the chain of causation unless it is exceptionally poor, so the original tortfeasor typically remains liable for the aggravated harm (subject to potential contribution from the medical provider).",
      "No, because only the treating clinician can ever be liable for treatment-related harm.",
      "Yes, but only if the claimant consented to the treatment in writing."
    ],
    answer: 1,
    explanation: "Ordinary negligent medical treatment of an injury caused by the original tort generally does not break the chain of causation (Webb v Barclays Bank; Rahman v Arearose) — only egregiously poor treatment is likely to constitute a novus actus interveniens.",
    tags: ["chain of causation", "medical negligence intervening act"] },
  { id: "c112", subject: "FLK1", topic: "Homicide", type: "sba",
    front: "D unlawfully and deliberately assaults V with a minor push, not intending or foreseeing any serious harm, but V unexpectedly falls, hits their head, and dies. Which offence is most likely to apply?",
    options: [
      "Murder, since any unlawful act causing death is murder.",
      "Unlawful act (constructive) manslaughter — D committed an unlawful and dangerous act which a reasonable person would recognise carries a risk of some harm, and it caused death, even without intent to kill or cause GBH.",
      "No offence, since D never intended to cause any harm at all.",
      "Only common assault, as death was entirely unforeseeable."
    ],
    answer: 1,
    explanation: "Unlawful act manslaughter requires an intentional unlawful act, dangerous in the sense that a sober, reasonable person would recognise a risk of some harm, which causes death — full foresight of death or serious injury is not required (R v Church).",
    tags: ["unlawful act manslaughter", "R v Church"] },
  { id: "c113", subject: "FLK1", topic: "Trust Creation", type: "sba",
    front: "A settlor's declaration of trust over identified shares fails to specify precisely which of several identical, un-segregated shares in a larger holding are held on trust. Applying Hunter v Moss principles, is the trust likely to fail for uncertainty of subject matter?",
    options: [
      "Yes — trusts of intangible property always fail without segregation.",
      "Not necessarily — for fungible, intangible property like shares of the same class, a trust of a stated number out of a larger identical holding can be valid without physical segregation (Hunter v Moss), unlike trusts of tangible unascertained goods.",
      "Yes, because shares can never be the subject of a valid trust.",
      "No, because certainty of subject matter is never required for shares."
    ],
    answer: 1,
    explanation: "Hunter v Moss held that a trust of a specified number of identical, fungible intangible assets (like shares of the same class) can be valid without segregation, distinguishing it from cases involving tangible unascertained goods (e.g. Re London Wine Co).",
    tags: ["Hunter v Moss", "certainty of subject matter"] },

  /* --- Contract Law (FLK1) — batch 5 --- */
  { id: "c114", subject: "FLK1", topic: "Privity of Contract", type: "sba",
    front: "A contract between a builder and homeowner expressly states that the homeowner's neighbour may enforce a specific term for their benefit. Can the neighbour, a third party, enforce this term?",
    options: [
      "No — only parties to a contract can ever enforce its terms.",
      "Yes — under the Contracts (Rights of Third Parties) Act 1999, a third party may enforce a term if the contract expressly provides they may, or if the term purports to confer a benefit on them (subject to contrary intention).",
      "No, because third party rights were abolished by the 1999 Act.",
      "Yes, but only if the neighbour paid consideration for the term."
    ],
    answer: 1,
    explanation: "The Contracts (Rights of Third Parties) Act 1999 allows a third party to enforce a contractual term where the contract expressly says so, or where the term purports to confer a benefit on them, displacing strict privity in these circumstances.",
    tags: ["Contracts (Rights of Third Parties) Act 1999", "privity"] },
  { id: "c115", subject: "FLK1", topic: "Frustration", type: "sba",
    front: "A contract for the hire of a hall for an event becomes impossible to perform because the hall burns down before the event, through no fault of either party. What is the likely legal effect?",
    options: [
      "The contract remains binding and the hirer must still pay in full.",
      "The contract is discharged by frustration, and the Law Reform (Frustrated Contracts) Act 1943 governs the recovery of sums paid/payable and expenses.",
      "The contract is automatically void from the outset (void ab initio).",
      "Only the party who caused the fire can rely on frustration."
    ],
    answer: 1,
    explanation: "Destruction of the subject matter essential to performance (as in Taylor v Caldwell) frustrates the contract; the Law Reform (Frustrated Contracts) Act 1943 then governs recovery of pre-paid sums and expenses.",
    tags: ["frustration", "Taylor v Caldwell", "Law Reform (Frustrated Contracts) Act 1943"] },

  /* --- Tort (FLK1) — batch 5 --- */
  { id: "c116", subject: "FLK1", topic: "Psychiatric Injury", type: "sba",
    front: "A mother witnesses her child being seriously injured in a road accident caused by the defendant's negligence and suffers a recognised psychiatric illness as a result, despite not being physically injured herself. As a 'secondary victim', what must she generally establish (per Alcock v Chief Constable of South Yorkshire)?",
    options: [
      "Nothing beyond mere presence at the scene at any time.",
      "A close tie of love and affection with the primary victim, physical and temporal proximity to the event (or its immediate aftermath), and that the psychiatric injury was caused by direct perception of the event through her own unaided senses.",
      "That she suffered physical injury herself as well.",
      "That she is a professional rescuer, since only rescuers can claim as secondary victims."
    ],
    answer: 1,
    explanation: "Alcock sets out the key control mechanisms for secondary victim claims: a close relationship of love and affection, proximity in time and space to the event or its immediate aftermath, and direct perception (not merely being told about it).",
    tags: ["Alcock v Chief Constable of South Yorkshire", "secondary victims"] },
  { id: "c117", subject: "FLK1", topic: "Damages", type: "sba",
    front: "In assessing tort damages for personal injury, which of the following best describes 'general damages'?",
    options: [
      "Damages for precisely calculable financial losses such as lost wages to date and medical bills already incurred.",
      "Damages for non-pecuniary and future losses that cannot be precisely calculated, such as pain, suffering, loss of amenity, and future loss of earnings.",
      "Damages that are always fixed by statute regardless of the individual case.",
      "Damages recoverable only in cases of gross negligence."
    ],
    answer: 1,
    explanation: "General damages cover losses that are not capable of precise arithmetical calculation, such as pain, suffering, loss of amenity, and future financial losses — as opposed to special damages, which are precisely quantifiable losses up to trial.",
    tags: ["general damages", "special damages"] },

  /* --- Criminal Law (FLK1) — batch 5 --- */
  { id: "c118", subject: "FLK1", topic: "Intoxication", type: "sba",
    front: "D voluntarily consumes a large amount of alcohol and, while intoxicated, commits an assault (a basic intent offence), later claiming they were too drunk to form the necessary intent. Is voluntary intoxication likely to be a defence here?",
    options: [
      "Yes — voluntary intoxication is always a full defence to any criminal charge.",
      "No — voluntary intoxication is generally not a defence to basic intent offences (DPP v Majewski), though it may be relevant to specific intent offences.",
      "Yes, but only if the intoxicating substance was alcohol rather than drugs.",
      "No defence exists for any offence once a person is voluntarily intoxicated, including specific intent crimes."
    ],
    answer: 1,
    explanation: "DPP v Majewski established that voluntary intoxication cannot found a defence to basic intent offences (like most assaults), though it may negate the specific intent required for offences like murder or s.18 GBH with intent.",
    tags: ["DPP v Majewski", "voluntary intoxication", "basic vs specific intent"] },
  { id: "c119", subject: "FLK1", topic: "Sexual Offences", type: "sba",
    front: "Under the Sexual Offences Act 2003, for the offence of rape, what must the prosecution prove regarding the defendant's belief in the complainant's consent?",
    options: [
      "That the defendant knew for certain the complainant did not consent.",
      "That the defendant did not reasonably believe the complainant was consenting, assessed with reference to whether they took reasonable steps to ascertain consent in the circumstances (s.1(2) SOA 2003).",
      "Belief in consent is entirely irrelevant to liability for rape.",
      "That the complainant expressly stated non-consent verbally in every case."
    ],
    answer: 1,
    explanation: "S.1(2) Sexual Offences Act 2003 requires the prosecution to show D did not reasonably believe the complainant consented, with reasonableness assessed by reference to all the circumstances, including steps taken to ascertain consent.",
    tags: ["Sexual Offences Act 2003", "s.1", "reasonable belief"] },

  /* --- Land Law (FLK1) — batch 5 --- */
  { id: "c120", subject: "FLK1", topic: "Proprietary Estoppel", type: "sba",
    front: "A farmer repeatedly assures his nephew that the family farm will be his one day if he continues to work on it unpaid. The nephew relies on this for decades, forgoing other career opportunities. The farmer later reneges. Which doctrine might assist the nephew?",
    options: [
      "Resulting trust, since he contributed labour, not money.",
      "Proprietary estoppel — a clear assurance, reasonable reliance, and resulting detriment can found an equitable claim to a remedy, potentially including the promised interest (Thorner v Major).",
      "Adverse possession, since he has occupied the land.",
      "No remedy exists, since the assurances were informal and non-contractual."
    ],
    answer: 1,
    explanation: "Proprietary estoppel requires a clear assurance, reasonable reliance by the claimant, and resulting detriment; where established, the court has discretion to satisfy the equity, which can include transferring the promised interest (Thorner v Major).",
    tags: ["proprietary estoppel", "Thorner v Major"] },

  /* --- Business Law & Practice (FLK2) — batch 5 --- */
  { id: "c121", subject: "FLK2", topic: "Company Formation & Directors' Duties", type: "sba",
    front: "A sole director and shareholder of a small private company wants to enter into a substantial property transaction with the company itself. Under the Companies Act 2006, what is generally required?",
    options: [
      "Nothing — sole directors can transact freely with their own company without restriction.",
      "Prior approval of the members by resolution is generally required for substantial property transactions between the company and a director (s.190 CA 2006), subject to limited exceptions.",
      "The transaction is automatically void regardless of any approval.",
      "Only auditor sign-off is required, never shareholder approval."
    ],
    answer: 1,
    explanation: "S.190 CA 2006 requires member approval for substantial property transactions between a company and its director (or connected person), subject to exceptions such as wholly-owned subsidiary transactions.",
    tags: ["s.190 CA 2006", "substantial property transactions"] },
  { id: "c122", subject: "FLK2", topic: "Corporate Governance", type: "sba",
    front: "A company's articles require board decisions to be taken by majority vote at a properly convened meeting. One director purports to bind the company alone, without board approval, in a matter requiring board authority. Is the company likely bound to a third party dealing in good faith?",
    options: [
      "No — the third party can never rely on apparent authority.",
      "Potentially yes — under s.40 CA 2006, in favour of a person dealing with a company in good faith, the power of the board (or those authorised by it) to bind the company is deemed free of any limitation in the company's constitution.",
      "No, because internal governance restrictions always bind third parties regardless of good faith.",
      "Yes, but only if the third party personally inspected the company's articles beforehand."
    ],
    answer: 1,
    explanation: "S.40 CA 2006 protects third parties dealing with a company in good faith by deeming the board's power to bind the company free from constitutional limitations, even where internal governance requirements were not followed.",
    tags: ["s.40 CA 2006", "third party protection"] },

  /* --- Dispute Resolution (FLK2) — batch 5 --- */
  { id: "c123", subject: "FLK2", topic: "Disclosure", type: "sba",
    front: "During standard disclosure in litigation, a party identifies a document that damages their own case. What is their general obligation regarding this document?",
    options: [
      "They may withhold it since it damages their own case.",
      "They must disclose its existence (subject to any valid privilege claim) as standard disclosure requires disclosure of documents adverse to a party's own case, not just supportive ones.",
      "They only need disclose documents that support their case.",
      "Disclosure obligations only apply to documents the other side already knows about."
    ],
    answer: 1,
    explanation: "CPR Part 31 standard disclosure requires disclosure of documents on which a party relies, and documents which adversely affect their own or another party's case, or support another party's case — not merely favourable documents.",
    tags: ["CPR Part 31", "standard disclosure"] },
  { id: "c124", subject: "FLK2", topic: "Privilege", type: "sba",
    front: "A solicitor prepares a written attendance note recording legal advice given to a client during the course of the retainer. Is this document likely protected from disclosure to the opposing party?",
    options: [
      "No — all documents created by a solicitor must be disclosed.",
      "Yes — it is likely protected by legal advice privilege, provided it records confidential communications between solicitor and client for the purpose of giving/receiving legal advice.",
      "No, because privilege only protects documents created for litigation, never advice generally.",
      "Yes, but only if the client expressly marks it 'privileged' at the time."
    ],
    answer: 1,
    explanation: "Legal advice privilege protects confidential communications between a solicitor and client made for the purpose of giving or seeking legal advice, regardless of whether litigation is in contemplation.",
    tags: ["legal advice privilege", "litigation privilege"] },

  /* --- Property Practice (FLK2) — batch 5 --- */
  { id: "c125", subject: "FLK2", topic: "Conveyancing", type: "sba",
    front: "A residential property is sold with the benefit of a new-build guarantee/warranty (e.g. NHBC-style). What is the primary purpose of this from the buyer's solicitor's perspective?",
    options: [
      "To provide the buyer with protection against certain structural defects for a defined period after completion.",
      "To replace the need for a survey entirely.",
      "To guarantee the property's market value will increase.",
      "To exempt the buyer from paying Stamp Duty Land Tax."
    ],
    answer: 0,
    explanation: "New-build warranties (e.g. NHBC) provide the buyer (and successors) with protection against specified structural defects for a set period, which the buyer's solicitor should check is in place and properly assigned/available.",
    tags: ["new-build warranty", "NHBC"] },
  { id: "c126", subject: "FLK2", topic: "Landlord & Tenant (Commercial)", type: "sba",
    front: "A commercial lease contains a clause requiring the tenant to keep the premises 'in good and substantial repair', even though the premises were already in disrepair at the start of the lease. What is the likely effect of this type of covenant?",
    options: [
      "The tenant is only required to maintain the condition present at the start of the lease, however poor.",
      "A 'keep in repair' covenant, on its ordinary wording, can require the tenant to put the premises into repair (i.e. a higher standard than merely 'as found'), not just maintain the existing condition.",
      "Repairing covenants are never enforceable in commercial leases.",
      "The tenant's obligation is capped at the value of the property itself."
    ],
    answer: 1,
    explanation: "Courts have held that a covenant to 'keep in repair' can, on ordinary wording, oblige a tenant to first put premises into repair, not merely to maintain them 'as found', absent express limiting wording.",
    tags: ["repairing covenants", "commercial leases"] },

  /* --- Wills & Estate Administration (FLK2) — batch 5 --- */
  { id: "c127", subject: "FLK2", topic: "Wills & Intestacy", type: "sba",
    front: "A testator has capacity, but a disappointed relative later challenges the will alleging the testator did not 'know and approve' its contents, because it was drafted by a beneficiary who was closely involved in its preparation. What is the general effect of such suspicious circumstances?",
    options: [
      "The will is automatically invalid whenever a beneficiary is involved in drafting.",
      "Suspicious circumstances surrounding preparation by an involved beneficiary can shift an evidential burden onto the propounder of the will to affirmatively prove knowledge and approval (a heightened scrutiny, per the principle in Barry v Butlin).",
      "Such circumstances are irrelevant provided the will is validly executed under s.9 Wills Act 1837.",
      "The relative automatically inherits under intestacy instead."
    ],
    answer: 1,
    explanation: "Where a beneficiary is involved in preparing a will, suspicious circumstances can require those propounding the will to affirmatively prove the testator knew and approved of its contents (Barry v Butlin and related authority), rather than relying on the usual presumption.",
    tags: ["knowledge and approval", "Barry v Butlin", "suspicious circumstances"] },
  { id: "c128", subject: "FLK2", topic: "Estate Administration", type: "sba",
    front: "Personal representatives are administering an estate and want protection against later, unknown claims (e.g. from creditors or beneficiaries they were unaware of) before distributing the estate. Which statutory notice procedure is most relevant?",
    options: [
      "A s.27 Trustee Act 1925 notice, published in the London Gazette and a local newspaper, inviting claims within a specified period (not less than 2 months).",
      "There is no way for personal representatives to protect themselves against unknown claims.",
      "Personal representatives must personally guarantee all estate debts regardless of notice.",
      "A simple private letter to known family members is legally sufficient protection."
    ],
    answer: 0,
    explanation: "S.27 Trustee Act 1925 allows personal representatives (and trustees) to advertise for claims (Gazette and appropriate newspaper) and, after the notice period expires, distribute the estate without personal liability for claims they didn't know about.",
    tags: ["s.27 Trustee Act 1925", "statutory notices"] },

  /* --- Solicitors Accounts & Ethics (FLK2) — batch 5 --- */
  { id: "c129", subject: "FLK2", topic: "Solicitors Accounts", type: "sba",
    front: "A firm's client account inadvertently receives a mixed payment that includes both client money and money belonging to the firm (e.g. an unbilled disbursement paid directly by a third party). What must the firm generally do with the non-client portion?",
    options: [
      "Leave all the money in the client account indefinitely.",
      "Transfer the firm's own portion out of the client account promptly, as mixed receipts should not remain in client account longer than necessary once identified.",
      "Transfer the entire mixed sum to the office account immediately, regardless of the client money element.",
      "Return the whole payment to the payer without further action."
    ],
    answer: 1,
    explanation: "Under the SRA Accounts Rules, where a receipt includes both client money and the firm's own money, the firm's own money must be identified and transferred out of the client account promptly, not left mixed in client account.",
    tags: ["SRA Accounts Rules", "mixed receipts"] },
  { id: "c130", subject: "FLK2", topic: "Costs & Funding", type: "sba",
    front: "A client enters a Conditional Fee Agreement ('no win, no fee') with their solicitor for a personal injury claim. What is a 'success fee' in this context?",
    options: [
      "A fee the client must pay regardless of the outcome.",
      "An uplift on the solicitor's normal fees, payable if the case succeeds, to compensate for the risk of no payment if it fails, subject to statutory caps in some proceedings (e.g. personal injury).",
      "A fee paid by the losing opponent directly to the client's solicitor in full, in every case.",
      "A fixed government subsidy paid to solicitors who win cases."
    ],
    answer: 1,
    explanation: "Under a CFA, a success fee is a percentage uplift on normal fees, payable only if the case is won, compensating the solicitor for the risk of acting on a no-win-no-fee basis; caps apply in certain proceedings (e.g. personal injury under LASPO reforms).",
    tags: ["Conditional Fee Agreement", "success fee"] },

  /* --- Batch 6: filling out thinly covered topics (1 SBA -> 2 per topic) --- */
  { id: "c131", subject: "FLK1", topic: "Vitiating Factors", type: "sba",
    front: "A contractor threatens to breach an existing supply contract unless the buyer agrees to pay a higher price, with no reasonable commercial justification for the threat. The buyer, having no realistic alternative supplier in time, agrees. Is the buyer likely able to avoid the price variation for economic duress?",
    options: [
      "No — a threat to breach a contract can never amount to duress.",
      "Yes — illegitimate pressure (a threat to breach with no reasonable commercial justification) leaving the buyer no practical choice but to submit can amount to economic duress, entitling the buyer to avoid the variation.",
      "No — only threats of physical violence can found duress.",
      "Yes, but only if the buyer paid under protest in writing at the time.",
    ],
    answer: 1,
    explanation: "Economic duress requires illegitimate pressure that is a significant cause of the claimant entering the agreement, leaving them no practical choice but to submit; a threat to breach with no reasonable commercial justification, causing a lack of practical alternative, can satisfy this test.",
    tags: ["economic duress","vitiating factors"] },
  { id: "c132", subject: "FLK1", topic: "Privity of Contract", type: "sba",
    front: "A contract for building works between a developer and a contractor states that a named future purchaser of the property 'may enforce clause 12 (warranty of workmanship) as if a party to this contract'. The purchaser later discovers defective work. Can the purchaser sue the contractor for breach of clause 12?",
    options: [
      "No — a person who is not a party to a contract can never sue on it.",
      "Yes — under the Contracts (Rights of Third Parties) Act 1999, a third party may enforce a term where the contract expressly provides that they may.",
      "No, unless the purchaser also provided consideration for clause 12.",
      "Yes, but only if the purchaser is named as a party on the signature page.",
    ],
    answer: 1,
    explanation: "S.1(1)(a) Contracts (Rights of Third Parties) Act 1999 allows a third party to enforce a term where the contract expressly provides that they may, displacing the common law privity rule in these circumstances.",
    tags: ["Contracts (Rights of Third Parties) Act 1999","privity"] },
  { id: "c133", subject: "FLK1", topic: "Frustration", type: "sba",
    front: "A company contracts to charter a ship for a specific voyage. Before the voyage begins, war breaks out and the ship is requisitioned by the government for an indefinite period likely to extend well beyond the contract's commercial purpose. Is the charterparty likely to be frustrated?",
    options: [
      "No — government requisition is always treated as a temporary inconvenience, not frustration.",
      "Potentially yes — where a supervening event (such as requisition for an indefinite period) makes performance radically different from what was undertaken, the contract may be discharged by frustration.",
      "No — frustration can never apply to contracts affected by war.",
      "Yes, automatically, regardless of how long the requisition lasts.",
    ],
    answer: 1,
    explanation: "A contract is frustrated where a supervening, unforeseen event renders performance radically different from what was agreed (Taylor v Caldwell principles); a lengthy, indefinite requisition frustrating the commercial purpose of a voyage charter can meet this test, though a short delay may not.",
    tags: ["frustration","radically different"] },
  { id: "c134", subject: "FLK1", topic: "Occupiers' Liability", type: "sba",
    front: "An occupier hires a reputable, appropriately qualified electrician to rewire a shop. The electrician's work is negligently defective and a lawful visitor is later injured by a faulty socket. The occupier had no reason to suspect the work was substandard. Is the occupier likely liable under the Occupiers' Liability Act 1957?",
    options: [
      "Yes — an occupier is automatically liable for all defects on the premises, however caused.",
      "Potentially not — under s.2(4)(b) OLA 1957, an occupier is not liable for danger due to the faulty work of an independent contractor if it was reasonable to entrust the work to them and the occupier took reasonable steps to check the work and the contractor's competence.",
      "Yes, because occupiers can never rely on independent contractors to discharge their duty.",
      "No, because electricians are never treated as independent contractors for these purposes.",
    ],
    answer: 1,
    explanation: "S.2(4)(b) OLA 1957 allows an occupier to escape liability for a contractor's faulty work if it was reasonable to entrust the work to the contractor and the occupier took reasonable steps to satisfy themselves the work was properly done and the contractor competent.",
    tags: ["Occupiers' Liability Act 1957","s.2(4)(b)","independent contractors"] },
  { id: "c135", subject: "FLK1", topic: "Vicarious Liability", type: "sba",
    front: "A hospital engages a doctor, on a contract for services, to carry out occasional independent medical assessments, with the doctor exercising full clinical independence and working for multiple other organisations. The doctor negligently injures a patient during an assessment. Is the hospital likely to be vicariously liable?",
    options: [
      "Yes — vicarious liability automatically extends to anyone performing work for an organisation.",
      "Potentially not — vicarious liability requires a relationship akin to employment, and a doctor who is a genuinely independent contractor, exercising independent judgment and working for multiple organisations, is unlikely to satisfy this test.",
      "Yes, because hospitals are strictly liable for all clinical negligence occurring on their premises.",
      "No, because vicarious liability can never apply to medical professionals.",
    ],
    answer: 1,
    explanation: "Following Barclays Bank v Various Claimants, vicarious liability requires a relationship akin to employment; a genuinely independent contractor exercising their own clinical judgment and working for multiple bodies is unlikely to meet this threshold.",
    tags: ["vicarious liability","akin to employment","Barclays Bank v Various Claimants"] },
  { id: "c136", subject: "FLK1", topic: "Defences to Negligence", type: "sba",
    front: "A claimant is injured while participating in an amateur boxing match after signing a form acknowledging and accepting the inherent risks of boxing, including injury from a legal punch. The claimant is later injured by a legitimate punch thrown within the rules. Which defence is the defendant most likely to rely on?",
    options: [
      "Contributory negligence, reducing damages proportionately.",
      "Volenti non fit injuria, as a complete defence based on the claimant's free and informed consent to the specific risk that materialised.",
      "Ex turpi causa, since boxing is an illegal activity.",
      "Res ipsa loquitur, reversing the burden of proof onto the claimant.",
    ],
    answer: 1,
    explanation: "Where a claimant freely and knowingly consents to a specific risk inherent in a lawful activity, and that very risk (rather than a rule breach) causes the injury, volenti non fit injuria can operate as a complete defence.",
    tags: ["volenti non fit injuria","consent defence"] },
  { id: "c137", subject: "FLK1", topic: "Product Liability", type: "sba",
    front: "A manufacturer supplies a batch of medical devices. At the time of manufacture, the defect causing later injuries could not have been detected by any manufacturer using the best available scientific and technical knowledge in the industry. Which defence under the Consumer Protection Act 1987 is most relevant?",
    options: [
      "The contributory negligence defence.",
      "The development risks defence under s.4(1)(e) CPA 1987.",
      "The volenti defence.",
      "There is no defence available under the CPA 1987 for defective medical devices.",
    ],
    answer: 1,
    explanation: "S.4(1)(e) CPA 1987 provides a defence where the state of scientific and technical knowledge at the relevant time was not such that a producer of similar products might have been expected to discover the defect.",
    tags: ["Consumer Protection Act 1987","development risks defence"] },
  { id: "c138", subject: "FLK1", topic: "Nuisance", type: "sba",
    front: "A factory's operations are objectively reasonable for its industrial locality, run at ordinary hours, and comply with all relevant regulatory permits, but still cause some noise disturbance to a neighbouring resident. Applying the tort of private nuisance, is the factory likely liable?",
    options: [
      "Yes — any interference with a neighbour's enjoyment of land is automatically actionable.",
      "Not necessarily — liability in private nuisance turns on whether the use was reasonable considering all circumstances, including locality, duration and regulatory compliance; a reasonable use in an industrial area is less likely to be actionable.",
      "Yes, because private nuisance is a strict liability tort regardless of reasonableness.",
      "No, because private nuisance has been entirely replaced by statutory noise regulation.",
    ],
    answer: 1,
    explanation: "Private nuisance liability depends on whether the defendant's use of land was reasonable, weighing factors such as locality, duration, and the character of the neighbourhood — reasonable industrial use in an appropriate locality is less likely to be actionable, though not automatically immune.",
    tags: ["private nuisance","reasonable user"] },
  { id: "c139", subject: "FLK1", topic: "Defamation", type: "sba",
    front: "A local blog publishes a false statement about a small business, but the post is seen by only a handful of people and there is no evidence it caused, or is likely to cause, any real damage to the business's reputation or finances. Under the Defamation Act 2013, is the statement likely to be actionable?",
    options: [
      "Yes — any false statement about a person or business is automatically defamatory.",
      "Not necessarily — s.1 Defamation Act 2013 requires the statement to have caused, or be likely to cause, serious harm (for a body trading for profit, serious financial loss) to reputation, which minimal, undamaging publication may not satisfy.",
      "Yes, because defamation claims do not require proof of any harm.",
      "No, because online statements can never be defamatory.",
    ],
    answer: 1,
    explanation: "S.1 Defamation Act 2013 introduced a serious harm threshold; for a body trading for profit this specifically requires serious financial loss. Minimal publication with no real damage is unlikely to meet this threshold.",
    tags: ["Defamation Act 2013","serious harm"] },
  { id: "c140", subject: "FLK1", topic: "Negligence — Economic Loss", type: "sba",
    front: "An accountant negligently prepares a company's financial statements, knowing they will be relied upon by a specific, identified prospective investor to decide whether to invest. The investor relies on the statements and suffers pure financial loss. Is a duty of care likely to be owed for this economic loss?",
    options: [
      "No — pure economic loss can never be recovered in the tort of negligence.",
      "Potentially yes — where there is a special relationship involving an assumption of responsibility and known, reasonable reliance by an identified party, a duty for negligent misstatement causing pure economic loss can arise (Hedley Byrne v Heller).",
      "No — accountants can only ever be liable to their own client under contract.",
      "Yes, automatically, regardless of whether the accountant knew of the investor or the purpose of the reliance.",
    ],
    answer: 1,
    explanation: "Hedley Byrne v Heller established that a duty for negligent misstatement causing pure economic loss can arise where there is an assumption of responsibility and reasonable reliance, particularly where the maker knows the statement will be relied on by a specific person for a specific purpose.",
    tags: ["Hedley Byrne v Heller","pure economic loss","assumption of responsibility"] },
  { id: "c141", subject: "FLK1", topic: "Employers' Liability", type: "sba",
    front: "An employer is aware that one employee has repeatedly subjected a colleague to serious bullying, but takes no steps to investigate or intervene, and the colleague eventually suffers a psychiatric injury as a result. Which aspect of the employer's duty is most directly engaged?",
    options: [
      "The duty to provide safe equipment only.",
      "The duty to provide competent staff and take reasonable care in supervising employees, particularly where there is a known risk of harmful conduct.",
      "Vicarious liability exclusively, with no personal duty owed by the employer.",
      "The Occupiers' Liability Act 1957, since the injury occurred at work.",
    ],
    answer: 1,
    explanation: "The employer's personal, non-delegable duty includes taking reasonable care in the selection and supervision of staff; failing to act on known bullying can breach this duty independently of any vicarious liability claim against the bullying employee.",
    tags: ["employers' liability","competent staff","safe system of work"] },
  { id: "c142", subject: "FLK1", topic: "Contributory Negligence", type: "sba",
    front: "A pedestrian crosses a road away from a nearby designated crossing, without looking, and is struck by a speeding, inattentive driver. Both the pedestrian's carelessness and the driver's excessive speed contributed to the accident. Under the Law Reform (Contributory Negligence) Act 1945, what is the likely outcome?",
    options: [
      "The pedestrian's claim is barred entirely because they were also at fault.",
      "The pedestrian's damages will be reduced to the extent the court considers just and equitable, reflecting their share of responsibility, but the claim is not automatically barred.",
      "The driver bears no liability at all because the pedestrian crossed away from a designated crossing.",
      "Damages are automatically split exactly 50/50 in every case of mutual fault.",
    ],
    answer: 1,
    explanation: "Under the 1945 Act, contributory negligence operates to apportion damages according to the claimant's share of responsibility, rather than barring the claim entirely; the exact percentage reduction depends on the facts, not a fixed rule.",
    tags: ["Law Reform (Contributory Negligence) Act 1945","apportionment"] },
  { id: "c143", subject: "FLK1", topic: "Psychiatric Injury", type: "sba",
    front: "An employee witnesses a serious workplace accident involving a close friend and colleague, and suffers a recognised psychiatric illness as a result, despite being in no physical danger themselves. As a potential secondary victim, which additional element (beyond the general Alcock control mechanisms) is most likely to be scrutinised regarding the claimant's relationship with the primary victim?",
    options: [
      "Whether the claimant and primary victim were married.",
      "Whether the claimant can establish a close tie of love and affection with the primary victim — a close friendship may qualify if proved, but is not presumed in the way spousal or parent-child relationships are.",
      "Whether the claimant is a blood relative of the primary victim in every case.",
      "Whether the claimant suffered any physical injury themselves.",
    ],
    answer: 1,
    explanation: "Alcock requires secondary victims to show a close tie of love and affection with the primary victim; certain relationships (e.g. spouse, parent-child) are presumed to qualify, but others, including close friendships, must be proved on the evidence rather than presumed.",
    tags: ["Alcock v Chief Constable of South Yorkshire","secondary victims","close tie of love and affection"] },
  { id: "c144", subject: "FLK1", topic: "Damages", type: "sba",
    front: "A claimant successfully sues for personal injury. Part of the claim covers lost wages and medical bills already incurred and precisely documented up to the date of trial. Which category of damages does this most accurately describe?",
    options: [
      "General damages.",
      "Special damages — pecuniary losses that are capable of precise calculation up to the date of trial.",
      "Aggravated damages.",
      "Damages in lieu of an injunction.",
    ],
    answer: 1,
    explanation: "Special damages cover quantifiable, already-incurred pecuniary losses (e.g. lost earnings and medical expenses to date), distinct from general damages, which cover non-pecuniary and future losses not capable of precise calculation.",
    tags: ["special damages","general damages"] },
  { id: "c145", subject: "FLK1", topic: "Actus Reus & Mens Rea", type: "sba",
    front: "D, driving carefully, accidentally and without any fault drives onto a pedestrian's foot. D then realises what has happened but deliberately refuses to move the car for several minutes, despite the pedestrian's pleas, causing further injury. At what point, if at all, does D's conduct become criminal?",
    options: [
      "D is never liable, since the initial act of driving onto the foot was accidental.",
      "D can become liable once D realises the car is on the pedestrian's foot and deliberately fails to move it — the continuing act is treated as coinciding with the later-formed mens rea (Fagan v Metropolitan Police Commissioner).",
      "D is liable from the very first moment the car touched the pedestrian's foot, regardless of fault.",
      "D can only be liable if the pedestrian suffered a broken bone.",
    ],
    answer: 1,
    explanation: "Following Fagan v Metropolitan Police Commissioner, an initially innocent act can become criminal where it is treated as a continuing act, and D forms the necessary mens rea while that act continues — here, D's deliberate refusal to move once aware of the danger.",
    tags: ["Fagan v Metropolitan Police Commissioner","continuing act","coincidence of actus reus and mens rea"] },
  { id: "c146", subject: "FLK1", topic: "Non-Fatal Offences", type: "sba",
    front: "D punches V once, causing a black eye that heals without lasting effect but is more than merely transient or trifling. Which offence is D most likely to have committed, assuming the necessary mens rea is present?",
    options: [
      "Common assault only, since there was no lasting injury.",
      "Assault occasioning actual bodily harm under s.47 OAPA 1861, since the injury is more than transient or trifling but not serious enough for a s.20 charge.",
      "Grievous bodily harm under s.18 OAPA 1861.",
      "No offence, since the injury healed completely.",
    ],
    answer: 1,
    explanation: "Actual bodily harm under s.47 OAPA 1861 covers injury that is more than merely transient or trifling but need not be permanent or serious — a black eye typically falls within this category, distinguishing it from the more serious s.20/s.18 offences.",
    tags: ["s.47 OAPA 1861","actual bodily harm"] },
  { id: "c147", subject: "FLK1", topic: "Criminal Damage", type: "sba",
    front: "D, honestly believing (mistakenly but genuinely) that the property belongs to them, damages it. Under the Criminal Damage Act 1971, is D likely to have a defence?",
    options: [
      "No — mistake is never a defence to criminal damage.",
      "Yes — under s.5(2)(a) Criminal Damage Act 1971, a person has a lawful excuse if they honestly believed the person entitled to consent would have consented, or, as here, that the property was their own, even if the belief is unreasonable.",
      "No, because only a reasonable mistake can found a defence.",
      "Yes, but only if the mistake was induced by a third party's fraud.",
    ],
    answer: 1,
    explanation: "S.5(2)(a) CDA 1971 provides a lawful excuse where D honestly believes they have a right to damage the property (e.g. believing it is their own), even if that belief is objectively unreasonable, provided it is genuinely held.",
    tags: ["Criminal Damage Act 1971","s.5(2)(a)","lawful excuse"] },
  { id: "c148", subject: "FLK1", topic: "Fraud", type: "sba",
    front: "D dishonestly fails to disclose information they are under a legal duty to disclose to an insurer when applying for a policy, intending to make a gain by securing lower premiums. Which form of fraud under the Fraud Act 2006 does this most closely resemble?",
    options: [
      "Fraud by false representation under s.2.",
      "Fraud by failing to disclose information under s.3, which applies where D dishonestly fails to disclose information they are under a legal duty to disclose, intending to make a gain or cause loss.",
      "Fraud by abuse of position under s.4.",
      "Obtaining services dishonestly under s.11.",
    ],
    answer: 1,
    explanation: "S.3 Fraud Act 2006 covers dishonest failure to disclose information that D is under a legal duty to disclose, done with intent to make a gain for themselves or another, or cause loss to another or expose another to risk of loss.",
    tags: ["Fraud Act 2006","s.3","failing to disclose"] },
  { id: "c149", subject: "FLK1", topic: "Robbery", type: "sba",
    front: "D threatens V with violence in order to force V to hand over a bag, but V, unafraid, refuses and nothing is taken. Is D likely guilty of robbery under s.8 Theft Act 1968?",
    options: [
      "No — robbery requires the theft to be completed; if nothing is taken, at most an attempt can be charged.",
      "Yes — robbery is complete the moment a threat of force is made, regardless of whether the theft succeeds.",
      "No — robbery can never be attempted.",
      "Yes, but only if V suffered actual injury.",
    ],
    answer: 0,
    explanation: "Robbery under s.8 Theft Act 1968 requires a completed theft accompanied by force or threat of force used in order to steal; where no theft occurs because the property is not taken, D may instead be liable for attempted robbery rather than the completed offence.",
    tags: ["s.8 Theft Act 1968","robbery","attempt"] },
  { id: "c150", subject: "FLK1", topic: "Intoxication", type: "sba",
    front: "D, voluntarily intoxicated, forms the specific intent required for a s.18 OAPA 1861 offence (wounding with intent to cause grievous bodily harm) despite their intoxication. Can D still be convicted of the full offence?",
    options: [
      "No — voluntary intoxication always negates specific intent, regardless of whether D actually formed it.",
      "Yes — if the evidence shows D in fact formed the specific intent required, despite being intoxicated, D can be convicted of the specific intent offence; intoxication is only relevant where it prevents the intent being formed.",
      "No — specific intent offences can never be committed by an intoxicated defendant.",
      "Yes, but only if D was involuntarily intoxicated.",
    ],
    answer: 1,
    explanation: "Voluntary intoxication is only a relevant factor where it actually prevents the defendant from forming the required specific intent; if the evidence shows the intent was in fact formed despite intoxication, the defendant can be convicted of the specific intent offence.",
    tags: ["voluntary intoxication","basic vs specific intent","DPP v Majewski"] },
  { id: "c151", subject: "FLK1", topic: "Sexual Offences", type: "sba",
    front: "D and V, both adults, engage in sexual activity. V later says they did not want to and felt they had no real choice because D was their direct manager and had implied V's job was at risk if V refused. Which concept is most relevant to assessing whether V consented under the Sexual Offences Act 2003?",
    options: [
      "Consent is irrelevant once any sexual activity has occurred between adults.",
      "Freedom and capacity to choose — s.74 SOA 2003 defines consent as agreeing by choice, with the freedom and capacity to make that choice; pressure undermining genuine freedom to choose can negate consent even without physical force.",
      "Only physical force or express verbal refusal can ever negate consent.",
      "D's own belief about V's job security is irrelevant to the question of V's consent.",
    ],
    answer: 1,
    explanation: "S.74 SOA 2003 defines consent as agreeing by choice, having the freedom and capacity to make that choice; abuse of a position of authority or implied threats can undermine genuine freedom to choose, potentially negating consent even without physical force.",
    tags: ["Sexual Offences Act 2003","s.74","consent"] },
  { id: "c152", subject: "FLK1", topic: "Easements", type: "sba",
    front: "A landowner grants a neighbour a right to park a car in a specific space on the landowner's land. The right is so extensive that it effectively excludes the landowner from using that space at all. Is this right likely to be capable of existing as an easement?",
    options: [
      "Yes — any right over another's land can be an easement provided it is in writing.",
      "Potentially not — a right that amounts to effective exclusive possession of the servient land may go beyond what an easement can grant, as an easement must not deprive the servient owner of any reasonable use of their own land.",
      "Yes, automatically, because parking rights are always treated as easements.",
      "No, because easements can never relate to parking.",
    ],
    answer: 1,
    explanation: "While parking rights can in principle be easements, a right so extensive that it excludes the servient owner from reasonable use of their own land (amounting to exclusive possession) may fall outside what the law recognises as capable of being an easement.",
    tags: ["easements","exclusive possession","Re Ellenborough Park"] },
  { id: "c153", subject: "FLK1", topic: "Leases", type: "sba",
    front: "A landlord grants a tenant occupation of a flat for a fixed 12-month term at a monthly rent, with the tenant given exclusive possession, but the written document is headed 'Licence Agreement' throughout. How will a court most likely characterise the arrangement?",
    options: [
      "As a licence, because that is the label the parties chose.",
      "As a lease, since exclusive possession for a term at a rent creates a tenancy regardless of the label used, applying the substance-over-form approach in Street v Mountford.",
      "As neither a lease nor a licence, since the label is inconsistent with the substance.",
      "As a licence, because licences can also grant exclusive possession for a fixed term.",
    ],
    answer: 1,
    explanation: "Street v Mountford establishes that the substance of the arrangement — exclusive possession, for a term, at a rent — determines whether it is a lease, irrespective of the label chosen by the parties.",
    tags: ["Street v Mountford","leases vs licences"] },
  { id: "c154", subject: "FLK1", topic: "Mortgages", type: "sba",
    front: "A residential mortgage deed contains a clause preventing the borrower from redeeming (paying off) the mortgage for the first 40 years of a 25-year mortgage term, effectively making early redemption impossible for the life of the loan. Is this clause likely to be enforceable?",
    options: [
      "Yes — parties are always free to agree any postponement of the right to redeem.",
      "Potentially not — equity does not permit terms that amount to a 'clog on the equity of redemption', particularly where the postponement is unreasonable and effectively negates the right to redeem within the term of the loan.",
      "Yes, because postponement clauses are only reviewable in commercial mortgages.",
      "No, because all postponement clauses are automatically void regardless of reasonableness.",
    ],
    answer: 1,
    explanation: "Equity protects the mortgagor's underlying equity of redemption against unreasonable contractual terms that unduly restrict or postpone it — a clause postponing redemption beyond the practical life of the loan can be struck down as an unreasonable clog on the equity of redemption.",
    tags: ["equity of redemption","clog on the equity of redemption"] },
  { id: "c155", subject: "FLK1", topic: "Co-ownership", type: "sba",
    front: "Three siblings hold registered title to a property as legal and equitable joint tenants. One sibling dies. Who becomes entitled to the deceased sibling's interest in the equitable ownership of the property?",
    options: [
      "The deceased sibling's estate, to be distributed under their will or intestacy.",
      "The surviving two siblings, automatically and equally, by the right of survivorship (jus accrescendi), regardless of any will.",
      "Whichever surviving sibling the deceased named in their will.",
      "The property must be sold immediately and the proceeds divided equally among all beneficiaries under intestacy.",
    ],
    answer: 1,
    explanation: "On the death of a joint tenant, their interest passes automatically to the surviving joint tenant(s) by the right of survivorship, regardless of any provision in their will — this is a key feature distinguishing joint tenancy from tenancy in common.",
    tags: ["right of survivorship","joint tenancy"] },
  { id: "c156", subject: "FLK1", topic: "Registered Land", type: "sba",
    front: "A buyer completes the purchase of registered land and promptly applies to register their title, all within the priority period conferred by a valid pre-completion search. During that priority period, an unrelated third party attempts to register a competing interest against the same title. What is the effect of the buyer's priority period?",
    options: [
      "The buyer's registration application takes priority over the later competing entry made during that period.",
      "The competing entry always takes priority, regardless of timing.",
      "Priority periods have no legal effect on the order of registration.",
      "The buyer must restart the entire purchase process if any other entry is made during the priority period.",
    ],
    answer: 0,
    explanation: "A priority period (conferred by an official search, such as an OS1 search) protects an applicant's registration application, giving it priority over most entries made on the register during that period, even if those entries are lodged first in time.",
    tags: ["priority period","OS1 search"] },
  { id: "c157", subject: "FLK1", topic: "Freehold Covenants", type: "sba",
    front: "A restrictive covenant benefiting neighbouring land was created decades ago. The current owner of the burdened land wants it discharged, arguing changes in the character of the neighbourhood mean the covenant is now obsolete and serves no practical purpose. Which body has jurisdiction to discharge or modify the covenant?",
    options: [
      "The Land Registry, automatically, on written request.",
      "The Upper Tribunal (Lands Chamber), under s.84 Law of Property Act 1925, on specified statutory grounds including obsoleteness.",
      "The local county court, with no need to show any statutory ground.",
      "No body has jurisdiction to discharge a validly created restrictive covenant.",
    ],
    answer: 1,
    explanation: "S.84 Law of Property Act 1925 gives the Upper Tribunal (Lands Chamber) jurisdiction to discharge or modify restrictive covenants that have become obsolete, or that impede reasonable use of the land, among other specified grounds.",
    tags: ["s.84 Law of Property Act 1925","discharge of covenants"] },
  { id: "c158", subject: "FLK1", topic: "Adverse Possession", type: "sba",
    front: "A squatter applies to the Land Registry to be registered as proprietor of registered land after 10 years' adverse possession. The registered proprietor is notified and objects within the statutory period. What is the general effect of that objection under the LRA 2002 regime?",
    options: [
      "The objection is irrelevant; the squatter is registered automatically regardless.",
      "The application will normally be rejected unless the squatter falls within one of the limited statutory exceptions (e.g. boundary disputes, reasonable belief in ownership, or an independent entitlement), giving the registered proprietor a further period to take action to recover possession.",
      "The squatter is immediately evicted with no further process.",
      "The registered proprietor must pay the squatter compensation to retain title.",
    ],
    answer: 1,
    explanation: "Under the LRA 2002, a timely objection by the registered proprietor generally defeats the squatter's application unless a limited statutory exception applies, after which the proprietor has a further period to act before the squatter can reapply.",
    tags: ["adverse possession","LRA 2002"] },
  { id: "c159", subject: "FLK1", topic: "Proprietary Estoppel", type: "sba",
    front: "A neighbour repeatedly assures another that they may build a garage that will encroach slightly onto the neighbour's land, and stands by without objection while significant money is spent constructing it in reliance on that assurance. The neighbour then seeks to enforce their strict legal title to have the garage removed. Which doctrine might prevent this?",
    options: [
      "Resulting trust, because money was spent on the land.",
      "Proprietary estoppel — a clear assurance, reasonable reliance, and resulting detriment can generate an equity that the court can satisfy in a way that reflects the minimum equity to do justice.",
      "Adverse possession, since the garage has physically encroached onto the land.",
      "No doctrine assists, since there was no written agreement.",
    ],
    answer: 1,
    explanation: "Proprietary estoppel can arise from a clear assurance, reasonable reliance, and detriment, generating an equity in the claimant's favour; the court has discretion to satisfy that equity in a way that reflects the minimum necessary to do justice in the circumstances.",
    tags: ["proprietary estoppel","minimum equity to do justice"] },
  { id: "c160", subject: "FLK1", topic: "Resulting & Constructive Trusts", type: "sba",
    front: "A couple buy a home in joint names, with an express written declaration of trust stating they hold the beneficial interest as tenants in common in unequal, specified shares. One party later argues the true common intention, based on subsequent conduct, was for equal shares. Will the court generally depart from the express declaration?",
    options: [
      "Yes — courts always prioritise informal common intention over any written declaration.",
      "No, generally — an express declaration of trust is usually conclusive as to the parties' beneficial shares, and will only be displaced in limited circumstances such as fraud, mistake, or subsequent variation by agreement.",
      "Yes, automatically, whenever the parties later disagree about their shares.",
      "No — express declarations can never be varied even by later agreement between the parties.",
    ],
    answer: 1,
    explanation: "Where parties execute an express declaration of trust setting out their beneficial shares, this is generally conclusive and displaces any need to infer common intention from conduct, save in limited circumstances such as fraud, mistake, or a later variation agreed between the parties.",
    tags: ["express declaration of trust","Stack v Dowden"] },
  { id: "c161", subject: "FLK1", topic: "Trustees' Duties", type: "sba",
    front: "A trustee, using knowledge and connections gained solely through their position as trustee, secures a lucrative personal investment opportunity that the trust itself could not have taken up. The trustee acted honestly and disclosed nothing to the beneficiaries. Is the trustee likely liable to account for the profit?",
    options: [
      "No — since the trust could not have taken the opportunity, the trustee is free to keep the profit.",
      "Yes — the strict no-profit rule generally requires a trustee to account for profits made using their position, even where obtained honestly and even where the trust itself could not have exploited the opportunity (Boardman v Phipps).",
      "No, provided the trustee acted honestly and in good faith throughout.",
      "Yes, but only if the beneficiaries can prove the trustee acted dishonestly.",
    ],
    answer: 1,
    explanation: "Boardman v Phipps confirms that a trustee (or fiduciary) who profits from opportunities or information obtained through their position must account for that profit, regardless of good faith and regardless of whether the trust itself could have taken the opportunity.",
    tags: ["Boardman v Phipps","no-profit rule"] },
  { id: "c162", subject: "FLK1", topic: "Breach of Trust & Tracing", type: "sba",
    front: "A trustee misappropriates trust funds and uses them, along with the trustee's own money, to purchase a single asset that has since increased significantly in value. The beneficiary wants to claim the asset itself rather than just their original contribution. Which remedy is most relevant?",
    options: [
      "The beneficiary is limited to a personal claim against the trustee for the original sum only, with no interest in the asset itself.",
      "The beneficiary can trace into the mixed asset and claim a proportionate share of it (or a lien over it for the amount contributed), allowing them to benefit from any increase in value.",
      "The beneficiary automatically loses all rights once trust money is mixed with the trustee's own funds.",
      "The beneficiary can only recover from the trustee personally if the trustee is insolvent.",
    ],
    answer: 1,
    explanation: "Equitable tracing allows a beneficiary to trace trust money into a mixed asset and claim either a proportionate share of the asset or a lien over it, enabling the beneficiary to share in any increase in value rather than being limited to a personal claim.",
    tags: ["tracing","proportionate share"] },
  { id: "c163", subject: "FLK1", topic: "Charitable Trusts", type: "sba",
    front: "A trust is established 'to advance the education of members of the public in the sciences'. Applying the requirements for a valid charitable trust, which additional element must be satisfied beyond falling within a recognised charitable purpose?",
    options: [
      "The trust must benefit only a single named individual.",
      "The trust must satisfy the public benefit requirement — that it benefits the public or a sufficiently important section of the public, rather than a narrow class connected by a personal nexus.",
      "The trust must be created by will rather than during the settlor's lifetime.",
      "The trust must have a fixed, unchangeable list of beneficiaries.",
    ],
    answer: 1,
    explanation: "In addition to falling within a recognised charitable purpose (such as advancement of education), a trust must satisfy the public benefit requirement, generally meaning it benefits the public at large or a sufficiently important section of it, not a narrow class defined by a personal connection.",
    tags: ["charitable trusts","public benefit"] },
  { id: "c164", subject: "FLK1", topic: "Human Rights Act 1998", type: "sba",
    front: "A local authority, exercising a statutory power, makes a decision that interferes with an individual's Article 8 (private and family life) rights under the ECHR. Under s.6 Human Rights Act 1998, what is the general legal consequence if the interference cannot be justified?",
    options: [
      "Nothing — s.6 only applies to central government, not local authorities.",
      "It is unlawful for the local authority, as a public authority, to act in a way incompatible with a Convention right, unless required to do so by primary legislation that cannot be interpreted compatibly.",
      "The local authority is automatically criminally liable.",
      "The decision is only reviewable by the European Court of Human Rights, not domestic courts.",
    ],
    answer: 1,
    explanation: "S.6 HRA 1998 makes it unlawful for a public authority (which includes local authorities) to act incompatibly with a Convention right, unless primary legislation compels that incompatible act and cannot be read compatibly under s.3.",
    tags: ["s.6 HRA 1998","public authority"] },
  { id: "c165", subject: "FLK1", topic: "Parliamentary Sovereignty", type: "sba",
    front: "An Act of Parliament is passed that appears to conflict with an earlier Act on the same subject, without expressly repealing it. Applying the traditional doctrine of implied repeal, what is the effect on the earlier Act?",
    options: [
      "The earlier Act remains fully in force, since only express repeal is recognised under UK constitutional law.",
      "The later Act impliedly repeals the earlier Act to the extent of the inconsistency, since Parliament cannot bind its successors and the most recent expression of Parliament's will prevails.",
      "Both Acts are automatically struck down as mutually inconsistent.",
      "The courts must refer the conflict to Parliament for clarification before either Act can be applied.",
    ],
    answer: 1,
    explanation: "Under the traditional doctrine of implied repeal, where a later Act conflicts with an earlier one, the later Act prevails to the extent of the inconsistency, reflecting the principle that Parliament cannot bind its successors — subject to the modern exception for 'constitutional statutes'.",
    tags: ["implied repeal","parliamentary sovereignty"] },
  { id: "c166", subject: "FLK1", topic: "Sources of Law", type: "sba",
    front: "A County Court judge is deciding a case and identifies a directly relevant, on-point decision of the Court of Appeal that has not been overruled. What is the status of that Court of Appeal decision for the County Court?",
    options: [
      "Merely persuasive, since the County Court may depart from higher court decisions if it disagrees.",
      "Binding — under the doctrine of precedent, lower courts are bound by the decisions of higher courts in the court hierarchy, including the Court of Appeal.",
      "Irrelevant, since only Supreme Court decisions bind other courts.",
      "Binding only if the Court of Appeal decision was itself unanimous.",
    ],
    answer: 1,
    explanation: "Under the doctrine of precedent, courts are bound by decisions of courts higher in the hierarchy; a County Court, sitting below the Court of Appeal, must follow a directly relevant, unoverruled Court of Appeal decision.",
    tags: ["doctrine of precedent","court hierarchy"] },
  { id: "c167", subject: "FLK2", topic: "Corporate Governance", type: "sba",
    front: "A private company's articles of association are silent on a particular procedural matter concerning board meetings. Which default source will generally apply to fill the gap?",
    options: [
      "The Model Articles prescribed under the Companies Act 2006, to the extent not excluded or modified by the company's own articles.",
      "No default rules exist; the company must immediately amend its articles before any board meeting can validly proceed.",
      "The articles of the largest company in the same industry.",
      "Case law from company law disputes in other jurisdictions, applied automatically.",
    ],
    answer: 0,
    explanation: "Where a company's own articles are silent on a matter, the Model Articles prescribed under the Companies Act 2006 generally apply by default to the extent they have not been excluded or modified, providing a standard governance framework.",
    tags: ["Model Articles","Companies Act 2006"] },
  { id: "c168", subject: "FLK2", topic: "Share Capital & Financing", type: "sba",
    front: "A private limited company wishes to reduce its share capital, for example to return surplus capital to shareholders. Which general routes are available under the Companies Act 2006?",
    options: [
      "A reduction of capital is never permitted for private companies.",
      "A special resolution supported by a solvency statement from the directors (the 'solvency statement' route), or a special resolution confirmed by the court.",
      "An ordinary resolution alone, with no further formality required.",
      "Unanimous informal shareholder consent without any resolution.",
    ],
    answer: 1,
    explanation: "Under the Companies Act 2006, a private company can reduce its share capital via a special resolution supported by a directors' solvency statement, or, as with public companies, by a special resolution confirmed by the court.",
    tags: ["reduction of capital","solvency statement"] },
  { id: "c169", subject: "FLK2", topic: "Partnerships & LLPs", type: "sba",
    front: "A partner in an ordinary partnership enters into a contract with a supplier who reasonably believes, based on past dealings, that the partner has authority to bind the firm to such contracts, even though the partnership had internally withdrawn that partner's authority without informing the supplier. Is the firm likely bound?",
    options: [
      "No — internal withdrawal of authority always protects the firm from liability.",
      "Potentially yes — under s.5 Partnership Act 1890, a partner's acts in the usual course of the firm's business bind the firm unless the third party knew the partner lacked authority or did not know/believe them to be a partner.",
      "No, because partnerships can never be bound by apparent authority.",
      "Yes, but only if the contract is in writing and signed by all partners.",
    ],
    answer: 1,
    explanation: "S.5 Partnership Act 1890 provides that a partner's acts in the usual course of the firm's business bind the firm and co-partners, unless the third party knew the partner had no actual authority in that instance, protecting third parties acting on apparent authority.",
    tags: ["s.5 Partnership Act 1890","apparent authority"] },
  { id: "c170", subject: "FLK2", topic: "Insolvency", type: "sba",
    front: "A company's directors continue trading, incurring further debts, at a point when they knew or ought to have concluded there was no reasonable prospect of avoiding insolvent liquidation, and failed to take steps to minimise loss to creditors. Which liability might the directors face?",
    options: [
      "No personal liability, since a company's separate legal personality always shields directors from company debts.",
      "Potential personal liability for wrongful trading, requiring the directors to contribute to the company's assets, under the Insolvency Act 1986.",
      "Automatic criminal imprisonment with no civil liability route available.",
      "Liability only if the company was already in liquidation at the time the debts were incurred.",
    ],
    answer: 1,
    explanation: "Wrongful trading provisions in the Insolvency Act 1986 can make directors personally liable to contribute to the company's assets where they continued trading after they knew or ought to have concluded that insolvent liquidation was unavoidable, without taking steps to minimise creditor loss.",
    tags: ["wrongful trading","Insolvency Act 1986"] },
  { id: "c171", subject: "FLK2", topic: "Pre-Action & Track Allocation", type: "sba",
    front: "A prospective claimant fails to comply with the relevant pre-action protocol before issuing proceedings, without good reason. The claimant later succeeds at trial. What is a likely consequence the court may impose regarding costs?",
    options: [
      "None — pre-action protocol compliance has no bearing on costs once a party succeeds at trial.",
      "The court may impose a costs sanction on the claimant despite their success, reflecting the unreasonable failure to comply with the pre-action protocol.",
      "The claim must be automatically struck out regardless of its merits.",
      "The claimant is barred from ever bringing the claim again.",
    ],
    answer: 1,
    explanation: "Courts can and do impose costs sanctions for unreasonable failure to comply with pre-action protocols, even where the non-compliant party is ultimately successful at trial, reflecting the emphasis on early, cooperative case management.",
    tags: ["Pre-Action Protocols","costs sanctions"] },
  { id: "c172", subject: "FLK2", topic: "Remedies & Enforcement", type: "sba",
    front: "A judgment creditor wants to obtain payment directly from a debtor's bank account, which holds funds owed by the bank to the judgment debtor. Which enforcement mechanism is specifically designed to freeze and then obtain payment of that debt?",
    options: [
      "A charging order over land.",
      "A third party debt order.",
      "A writ of control against goods.",
      "An attachment of earnings order.",
    ],
    answer: 1,
    explanation: "A third party debt order allows a judgment creditor to obtain payment directly from a third party (such as a bank) who owes money to the judgment debtor, by first freezing and then ordering payment of that debt to the creditor.",
    tags: ["third party debt order","enforcement of judgments"] },
  { id: "c173", subject: "FLK2", topic: "Evidence & Trial", type: "sba",
    front: "In civil proceedings, a witness statement contains a statement made to the witness by someone who is not called to give evidence, which the party seeks to rely on for the truth of its contents. Is this evidence likely to be admissible?",
    options: [
      "No — hearsay evidence is completely inadmissible in civil proceedings, as in criminal proceedings.",
      "Yes, generally — hearsay evidence is admissible in civil proceedings under the Civil Evidence Act 1995, subject to notice requirements, though the court will consider what weight to give it.",
      "Yes, but only if the maker of the original statement has since died.",
      "No, unless both parties consent in writing before trial.",
    ],
    answer: 1,
    explanation: "Unlike the position in criminal proceedings, hearsay evidence is generally admissible in civil trials under the Civil Evidence Act 1995, subject to procedural notice requirements; the court then assesses what weight, if any, to attach to it.",
    tags: ["Civil Evidence Act 1995","hearsay"] },
  { id: "c174", subject: "FLK2", topic: "Disclosure", type: "sba",
    front: "During standard disclosure, a party locates a relevant document but believes it is protected by legal advice privilege. What is the party's correct approach under CPR Part 31?",
    options: [
      "The party may simply destroy the document to avoid any disclosure obligation.",
      "The party must generally disclose the existence of the document in their disclosure list (describing it appropriately) while withholding inspection on the basis of the privilege claimed.",
      "The party has no obligation to mention the document at all if it is privileged.",
      "The party must hand over the document for inspection regardless of any privilege claim.",
    ],
    answer: 1,
    explanation: "A party must generally disclose the existence of a privileged document (listing it, often in general terms) but may withhold it from inspection on the basis of a properly claimed privilege, such as legal advice privilege.",
    tags: ["CPR Part 31","legal advice privilege"] },
  { id: "c175", subject: "FLK2", topic: "Privilege", type: "sba",
    front: "A company's in-house lawyer prepares a report analysing the likely outcome of anticipated litigation, at the request of the company's litigation team, once litigation is reasonably in prospect. Is this report likely to attract litigation privilege?",
    options: [
      "No — litigation privilege only ever protects communications with external solicitors.",
      "Potentially yes — litigation privilege can protect confidential communications and documents created for the dominant purpose of use in litigation that is reasonably in contemplation, including reports by in-house lawyers.",
      "No, because litigation privilege requires proceedings to have already been formally issued.",
      "Yes, but only if the report is later shown to the other side voluntarily.",
    ],
    answer: 1,
    explanation: "Litigation privilege can protect documents created for the dominant purpose of litigation reasonably in contemplation, and is not limited to communications with external solicitors — it can extend to in-house lawyers acting in that capacity, provided the dominant purpose test is met.",
    tags: ["litigation privilege","dominant purpose test"] },
  { id: "c176", subject: "FLK2", topic: "Alternative Dispute Resolution", type: "sba",
    front: "Two commercial parties in dispute agree to attempt mediation before litigating. The mediation is unsuccessful and the matter proceeds to trial. Is anything said during the mediation generally admissible as evidence at trial?",
    options: [
      "Yes — everything said in mediation is automatically admissible if relevant to the trial issues.",
      "Generally no — mediation communications are usually protected by 'without prejudice' privilege, meaning they cannot generally be referred to or used as evidence in subsequent proceedings.",
      "Yes, but only statements made by the losing party.",
      "No, but only if both parties signed a confidentiality agreement in advance.",
    ],
    answer: 1,
    explanation: "Discussions during mediation are generally protected by without prejudice privilege (often reinforced by a mediation agreement), meaning they cannot usually be referred to or relied upon as evidence in later court proceedings, encouraging open settlement discussions.",
    tags: ["mediation","without prejudice privilege"] },
  { id: "c177", subject: "FLK2", topic: "Costs & Funding", type: "sba",
    front: "A client wants to fund litigation without paying their solicitor's fees unless the case succeeds, and is prepared to pay an uplifted fee if it does. Which type of funding arrangement does this describe?",
    options: [
      "A conditional fee agreement (CFA), commonly known as a 'no win, no fee' arrangement, involving a success fee payable if the case succeeds.",
      "Legal aid funding, available to all litigants regardless of means.",
      "A damages-based agreement calculated solely as a fixed hourly rate.",
      "Third party litigation funding provided directly by the court.",
    ],
    answer: 0,
    explanation: "A conditional fee agreement allows a solicitor to act on a 'no win, no fee' basis, charging a success fee (an uplift on normal fees) only if the case succeeds, to compensate for the risk of receiving no payment if it fails.",
    tags: ["Conditional Fee Agreement","success fee"] },
  { id: "c178", subject: "FLK2", topic: "Leasehold Enfranchisement & Residential", type: "sba",
    front: "A qualifying long leaseholder of a flat wants to acquire the freehold of their building collectively with other qualifying leaseholders, rather than simply extending their own lease. Which general statutory mechanism is most relevant?",
    options: [
      "Individual lease extension only; collective freehold acquisition is not possible for flats.",
      "Collective enfranchisement, allowing qualifying leaseholders acting together to acquire the freehold of their building under leasehold enfranchisement legislation.",
      "The Landlord and Tenant Act 1954, Part II.",
      "Compulsory purchase by the local authority.",
    ],
    answer: 1,
    explanation: "Leasehold enfranchisement legislation provides a collective enfranchisement route, allowing a sufficient proportion of qualifying leaseholders in a building to act together to acquire the freehold, distinct from an individual leaseholder's separate right to a lease extension.",
    tags: ["collective enfranchisement","leasehold enfranchisement"] },
  { id: "c179", subject: "FLK2", topic: "Estate Administration", type: "sba",
    front: "Personal representatives wish to distribute an estate but are concerned about potential claims from creditors or beneficiaries they are not currently aware of. What statutory step can they take to protect themselves from personal liability for such unknown claims?",
    options: [
      "Simply wait two years after the death before distributing, with no other action required.",
      "Place statutory notices under s.27 Trustee Act 1925 (e.g. in the London Gazette and a local newspaper) inviting claims within a specified period, then distribute after that period expires without personal liability for unknown claims.",
      "Personally guarantee to pay any future claims out of their own funds.",
      "Distribute immediately and rely on beneficiaries to return funds if a claim later arises.",
    ],
    answer: 1,
    explanation: "S.27 Trustee Act 1925 allows personal representatives to advertise for claims in the prescribed manner and, once the notice period (not less than two months) expires, distribute the estate without personal liability for claims of which they had no notice.",
    tags: ["s.27 Trustee Act 1925","statutory notices"] },
];

/* ---------------------------------------------------------
   CASEBOOK — every case, statute, and concept referenced
   across the syllabus, searchable independently of quiz cards.
   Auto-extracted from vetted question/flashcard content plus
   hand-authored supplements for thinly covered topics.
--------------------------------------------------------- */
const CASEBOOK = [
  {"id":"cb001","type":"concept","name":"Coincidence of actus reus and mens rea","subject":"FLK1","topic":"Actus Reus & Mens Rea","principle":"The general rule requires the actus reus and mens rea of an offence to coincide in time, though courts apply a flexible 'continuing act' approach to find coincidence where the guilty act continues while the required mental state is later formed."},
  {"id":"cb002","type":"case","name":"Fagan v Metropolitan Police Commissioner","subject":"FLK1","topic":"Actus Reus & Mens Rea","principle":"Illustrates the continuing act doctrine: driving onto and then deliberately remaining on a police officer's foot was treated as one continuing act, allowing the later-formed mens rea to coincide with the ongoing actus reus."},
  {"id":"cb003","type":"concept","name":"mens rea","subject":"FLK1","topic":"Actus Reus & Mens Rea","principle":"For offences against the person, once the basic intent to apply unlawful force is shown, D can be liable for the harm actually caused even if greater than intended, subject to the specific offence's mens rea requirements (cf. R v Mowatt on s.20 OAPA 1861).","relatedCardId":"c021"},
  {"id":"cb004","type":"concept","name":"OAPA 1861","subject":"FLK1","topic":"Actus Reus & Mens Rea","principle":"For offences against the person, once the basic intent to apply unlawful force is shown, D can be liable for the harm actually caused even if greater than intended, subject to the specific offence's mens rea requirements (cf. R v Mowatt on s.20 OAPA 1861).","relatedCardId":"c021"},
  {"id":"cb005","type":"case","name":"R v Miller","subject":"FLK1","topic":"Actus Reus & Mens Rea","principle":"Where a defendant inadvertently creates a dangerous situation and becomes aware of it, a duty arises to take reasonable steps to avert the danger; failure to do so can found liability, extending criminal liability for omissions beyond the traditional narrow categories."},
  {"id":"cb006","type":"concept","name":"adverse possession","subject":"FLK1","topic":"Adverse Possession","principle":"For registered land under the LRA 2002, a squatter can apply to be registered after 10 years' adverse possession, but the registered proprietor is notified and can object, generally defeating the claim unless specific exceptions apply — a significant change from the old 12-year 'automatic' unregistered land rule.","relatedCardId":"c098"},
  {"id":"cb007","type":"statute","name":"LRA 2002","subject":"FLK1","topic":"Adverse Possession","principle":"For registered land under the LRA 2002, a squatter can apply to be registered after 10 years' adverse possession, but the registered proprietor is notified and can object, generally defeating the claim unless specific exceptions apply — a significant change from the old 12-year 'automatic' unregistered land rule.","relatedCardId":"c098"},
  {"id":"cb008","type":"case","name":"Clayton's Case","subject":"FLK1","topic":"Breach of Trust & Tracing","principle":"Where a trustee mixes trust money with their own, equitable tracing rules (e.g. Re Hallett's Estate, Re Oatway) generally favour the beneficiary, allowing them to claim traceable proceeds or a charge over the mixed fund; Clayton's Case (FIFO) may apply in some banking contexts but is often displaced.","relatedCardId":"c077"},
  {"id":"cb009","type":"case","name":"Re Hallett's Estate","subject":"FLK1","topic":"Breach of Trust & Tracing","principle":"Where a trustee mixes trust money with their own, equitable tracing rules (e.g. Re Hallett's Estate, Re Oatway) generally favour the beneficiary, allowing them to claim traceable proceeds or a charge over the mixed fund; Clayton's Case (FIFO) may apply in some banking contexts but is often displaced.","relatedCardId":"c077"},
  {"id":"cb010","type":"concept","name":"tracing","subject":"FLK1","topic":"Breach of Trust & Tracing","principle":"Where a trustee mixes trust money with their own, equitable tracing rules (e.g. Re Hallett's Estate, Re Oatway) generally favour the beneficiary, allowing them to claim traceable proceeds or a charge over the mixed fund; Clayton's Case (FIFO) may apply in some banking contexts but is often displaced.","relatedCardId":"c077"},
  {"id":"cb011","type":"concept","name":"charitable trusts","subject":"FLK1","topic":"Charitable Trusts","principle":"Dingle v Turner established that poverty trusts benefit from a relaxed public benefit requirement, permitting trusts for the poor among a defined class (e.g. employees) to still qualify as charitable.","relatedCardId":"c099"},
  {"id":"cb012","type":"case","name":"Dingle v Turner","subject":"FLK1","topic":"Charitable Trusts","principle":"Dingle v Turner established that poverty trusts benefit from a relaxed public benefit requirement, permitting trusts for the poor among a defined class (e.g. employees) to still qualify as charitable.","relatedCardId":"c099"},
  {"id":"cb013","type":"concept","name":"poverty exception","subject":"FLK1","topic":"Charitable Trusts","principle":"Dingle v Turner established that poverty trusts benefit from a relaxed public benefit requirement, permitting trusts for the poor among a defined class (e.g. employees) to still qualify as charitable.","relatedCardId":"c099"},
  {"id":"cb014","type":"concept","name":"Right of survivorship","subject":"FLK1","topic":"Co-ownership","principle":"On the death of a joint tenant, their interest passes automatically to the surviving joint tenant(s) (jus accrescendi) regardless of any provision in their will; this does not apply to a tenancy in common, where the share passes under the deceased's will or intestacy."},
  {"id":"cb015","type":"statute","name":"s.36(2) LPA 1925","subject":"FLK1","topic":"Co-ownership","principle":"Under s.36(2) LPA 1925, written notice by one joint tenant to the other(s) is sufficient to sever the equitable joint tenancy into a tenancy in common; the legal estate remains held as joint tenants (which cannot be severed).","relatedCardId":"c054"},
  {"id":"cb016","type":"concept","name":"severance","subject":"FLK1","topic":"Co-ownership","principle":"Under s.36(2) LPA 1925, written notice by one joint tenant to the other(s) is sufficient to sever the equitable joint tenancy into a tenancy in common; the legal estate remains held as joint tenants (which cannot be severed).","relatedCardId":"c054"},
  {"id":"cb017","type":"concept","name":"The four unities","subject":"FLK1","topic":"Co-ownership","principle":"A joint tenancy requires the four unities: possession (each co-owner entitled to possession of the whole), interest (identical interest in extent, nature and duration), title (acquired under the same document or act), and time (interests vesting simultaneously); a tenancy in common requires only unity of possession."},
  {"id":"cb018","type":"statute","name":"Trusts of Land and Appointment of Trustees Act 1996","subject":"FLK1","topic":"Co-ownership","principle":"Governs trusts of land, including the statutory trust that automatically arises on co-ownership, and provides a mechanism (s.14) for a co-owner or other interested person to apply to court for an order relating to the trust property, e.g. for sale."},
  {"id":"cb019","type":"case","name":"Chappell v Nestlé","subject":"FLK1","topic":"Consideration","principle":"Something of value in the eyes of the law, moving from the promisee, given in exchange for the promise. Must be sufficient but need not be adequate (Chappell v Nestlé — chocolate wrappers were sufficient consideration).","relatedCardId":"c006"},
  {"id":"cb020","type":"case","name":"Combe v Combe","subject":"FLK1","topic":"Consideration","principle":"An equitable doctrine preventing a party from going back on a promise not to enforce strict legal rights where the other party relied on it (Central London Property Trust v High Trees House). It is a shield, not a sword — cannot create a new cause of action (Combe v Combe).","relatedCardId":"c009"},
  {"id":"cb021","type":"case","name":"Foakes v Beer","subject":"FLK1","topic":"Consideration","principle":"Pinnel's Case (and Foakes v Beer) hold that part payment of a debt is not good consideration for a promise to forgo the balance, absent some additional benefit — though promissory estoppel may prevent going back on the promise in some circumstances.","relatedCardId":"c092"},
  {"id":"cb022","type":"case","name":"High Trees","subject":"FLK1","topic":"Consideration","principle":"An equitable doctrine preventing a party from going back on a promise not to enforce strict legal rights where the other party relied on it (Central London Property Trust v High Trees House). It is a shield, not a sword — cannot create a new cause of action (Combe v Combe).","relatedCardId":"c009"},
  {"id":"cb023","type":"concept","name":"part payment","subject":"FLK1","topic":"Consideration","principle":"Pinnel's Case (and Foakes v Beer) hold that part payment of a debt is not good consideration for a promise to forgo the balance, absent some additional benefit — though promissory estoppel may prevent going back on the promise in some circumstances.","relatedCardId":"c092"},
  {"id":"cb024","type":"case","name":"Pinnel's Case","subject":"FLK1","topic":"Consideration","principle":"Pinnel's Case (and Foakes v Beer) hold that part payment of a debt is not good consideration for a promise to forgo the balance, absent some additional benefit — though promissory estoppel may prevent going back on the promise in some circumstances.","relatedCardId":"c092"},
  {"id":"cb025","type":"concept","name":"practical benefit","subject":"FLK1","topic":"Consideration","principle":"Williams v Roffey Bros established that performing an existing contractual duty can constitute consideration for a new promise if it confers a practical benefit on the promisor, provided there is no duress or fraud.","relatedCardId":"c093"},
  {"id":"cb026","type":"case","name":"Stilk v Myrick","subject":"FLK1","topic":"Consideration","principle":"Generally no (Stilk v Myrick). BUT if the promisor obtains a practical benefit and there is no economic duress, it can suffice (Williams v Roffey Bros).","relatedCardId":"c007"},
  {"id":"cb027","type":"case","name":"Williams v Roffey","subject":"FLK1","topic":"Consideration","principle":"Generally no (Stilk v Myrick). BUT if the promisor obtains a practical benefit and there is no economic duress, it can suffice (Williams v Roffey Bros).","relatedCardId":"c007"},
  {"id":"cb028","type":"case","name":"Williams v Roffey Bros","subject":"FLK1","topic":"Consideration","principle":"Williams v Roffey Bros established that performing an existing contractual duty can constitute consideration for a new promise if it confers a practical benefit on the promisor, provided there is no duress or fraud.","relatedCardId":"c093"},
  {"id":"cb029","type":"case","name":"Adams v Lindsell","subject":"FLK1","topic":"Contract Formation","principle":"Acceptance by post is effective on posting, not receipt (Adams v Lindsell), provided post was a reasonable/contemplated method and the letter was properly stamped and addressed. Does not apply to instantaneous communications (email, telex — Entores v Miles Far East).","relatedCardId":"c004"},
  {"id":"cb030","type":"case","name":"Boots","subject":"FLK1","topic":"Contract Formation","principle":"Goods displayed in a shop window or on a shelf are an invitation to treat, not an offer (Fisher v Bell; Pharmaceutical Society of GB v Boots). The customer makes the offer; the shopkeeper may refuse it.","relatedCardId":"c003"},
  {"id":"cb031","type":"case","name":"Byrne v Van Tienhoven","subject":"FLK1","topic":"Contract Formation","principle":"Under the postal rule, acceptance is effective on posting (Adams v Lindsell). Revocation must be communicated to be effective (Byrne v Van Tienhoven). B's acceptance took effect before A's revocation reached B, so a contract exists.","relatedCardId":"c005"},
  {"id":"cb032","type":"case","name":"Carlill v Carbolic Smoke Ball","subject":"FLK1","topic":"Contract Formation","principle":"Generally an invitation to treat, UNLESS it is a unilateral offer to the world showing clear intent to be bound on performance — Carlill v Carbolic Smoke Ball Co.","relatedCardId":"c002"},
  {"id":"cb033","type":"case","name":"Dickinson v Dodds","subject":"FLK1","topic":"Contract Formation","principle":"Dickinson v Dodds established that an offer can be impliedly revoked where the offeree learns, through a reliable source, that the offeror has acted inconsistently with the offer (e.g. sold the subject matter) — even before any formal notice of revocation.","relatedCardId":"c090"},
  {"id":"cb034","type":"case","name":"Entores","subject":"FLK1","topic":"Contract Formation","principle":"Acceptance by post is effective on posting, not receipt (Adams v Lindsell), provided post was a reasonable/contemplated method and the letter was properly stamped and addressed. Does not apply to instantaneous communications (email, telex — Entores v Miles Far East).","relatedCardId":"c004"},
  {"id":"cb035","type":"case","name":"Fisher v Bell","subject":"FLK1","topic":"Contract Formation","principle":"A definite promise to be bound, communicated to the offeree, capable of acceptance without further negotiation. Distinguish from an invitation to treat (e.g. goods in a shop window — Fisher v Bell).","relatedCardId":"c001"},
  {"id":"cb036","type":"concept","name":"letters of intent","subject":"FLK1","topic":"Contract Formation","principle":"Letters of intent are usually not binding contracts as they lack the necessary certainty and intention to create immediate legal relations, though restitutionary remedies (e.g. quantum meruit) may compensate work done in anticipation (British Steel Corp v Cleveland Bridge).","relatedCardId":"c041"},
  {"id":"cb037","type":"concept","name":"offer","subject":"FLK1","topic":"Contract Formation","principle":"A definite promise to be bound, communicated to the offeree, capable of acceptance without further negotiation. Distinguish from an invitation to treat (e.g. goods in a shop window — Fisher v Bell).","relatedCardId":"c001"},
  {"id":"cb038","type":"concept","name":"postal rule","subject":"FLK1","topic":"Contract Formation","principle":"Under the postal rule, acceptance is effective on posting (Adams v Lindsell). Revocation must be communicated to be effective (Byrne v Van Tienhoven). B's acceptance took effect before A's revocation reached B, so a contract exists.","relatedCardId":"c005"},
  {"id":"cb039","type":"concept","name":"quantum meruit","subject":"FLK1","topic":"Contract Formation","principle":"Letters of intent are usually not binding contracts as they lack the necessary certainty and intention to create immediate legal relations, though restitutionary remedies (e.g. quantum meruit) may compensate work done in anticipation (British Steel Corp v Cleveland Bridge).","relatedCardId":"c041"},
  {"id":"cb040","type":"concept","name":"revocation of offer","subject":"FLK1","topic":"Contract Formation","principle":"Dickinson v Dodds established that an offer can be impliedly revoked where the offeree learns, through a reliable source, that the offeror has acted inconsistently with the offer (e.g. sold the subject matter) — even before any formal notice of revocation.","relatedCardId":"c090"},
  {"id":"cb041","type":"concept","name":"Apportionment under the 1945 Act","subject":"FLK1","topic":"Contributory Negligence","principle":"Under the Law Reform (Contributory Negligence) Act 1945, damages are reduced to the extent the court considers just and equitable having regard to the claimant's share of responsibility for the damage."},
  {"id":"cb042","type":"case","name":"Froom v Butcher","subject":"FLK1","topic":"Contributory Negligence","principle":"Established that a claimant's failure to wear a seatbelt can amount to contributory negligence where it increases the severity of injury, with courts historically applying conventional percentage reductions depending on how much the injury would have been reduced."},
  {"id":"cb043","type":"statute","name":"Law Reform (Contributory Negligence) Act 1945","subject":"FLK1","topic":"Contributory Negligence","principle":"Contributory negligence can apply where the claimant's own fault contributed to the extent/severity of injury (not just causing the accident), and damages are reduced 'to such extent as the court thinks just and equitable' under the 1945 Act.","relatedCardId":"c095"},
  {"id":"cb044","type":"concept","name":"Standard of care for contributory negligence","subject":"FLK1","topic":"Contributory Negligence","principle":"A claimant is judged by the standard of a reasonable person taking care for their own safety, not the (often higher) standard applicable to a defendant's duty owed to others."},
  {"id":"cb045","type":"statute","name":"Criminal Damage Act 1971","subject":"FLK1","topic":"Criminal Damage","principle":"Following R v G (2003), recklessness for criminal damage is subjective — D must have foreseen a risk of damage to property belonging to another and unreasonably taken that risk; the facts require assessing D's actual foresight.","relatedCardId":"c075"},
  {"id":"cb046","type":"case","name":"R v G","subject":"FLK1","topic":"Criminal Damage","principle":"Following R v G (2003), recklessness for criminal damage is subjective — D must have foreseen a risk of damage to property belonging to another and unreasonably taken that risk; the facts require assessing D's actual foresight.","relatedCardId":"c075"},
  {"id":"cb047","type":"concept","name":"subjective recklessness","subject":"FLK1","topic":"Criminal Damage","principle":"Following R v G (2003), recklessness for criminal damage is subjective — D must have foreseen a risk of damage to property belonging to another and unreasonably taken that risk; the facts require assessing D's actual foresight.","relatedCardId":"c075"},
  {"id":"cb048","type":"concept","name":"general damages","subject":"FLK1","topic":"Damages","principle":"General damages cover losses that are not capable of precise arithmetical calculation, such as pain, suffering, loss of amenity, and future financial losses — as opposed to special damages, which are precisely quantifiable losses up to trial.","relatedCardId":"c117"},
  {"id":"cb049","type":"concept","name":"special damages","subject":"FLK1","topic":"Damages","principle":"General damages cover losses that are not capable of precise arithmetical calculation, such as pain, suffering, loss of amenity, and future financial losses — as opposed to special damages, which are precisely quantifiable losses up to trial.","relatedCardId":"c117"},
  {"id":"cb050","type":"statute","name":"Defamation Act 2013","subject":"FLK1","topic":"Defamation","principle":"S.1 Defamation Act 2013 introduced a 'serious harm' threshold — a statement is not defamatory unless its publication has caused or is likely to cause serious harm to the claimant's reputation.","relatedCardId":"c072"},
  {"id":"cb051","type":"concept","name":"Libel and slander","subject":"FLK1","topic":"Defamation","principle":"Libel is defamation in a permanent form (e.g. written or broadcast) and is actionable without proof of special damage; slander is defamation in a transient/spoken form and traditionally required proof of special damage, subject to established exceptions."},
  {"id":"cb052","type":"statute","name":"s.2 Defamation Act 2013 — truth","subject":"FLK1","topic":"Defamation","principle":"It is a defence to a defamation claim to show that the imputation conveyed by the statement complained of is substantially true."},
  {"id":"cb053","type":"statute","name":"s.3 Defamation Act 2013 — honest opinion","subject":"FLK1","topic":"Defamation","principle":"A defence available where the statement was a statement of opinion, indicated (in general or specific terms) the basis of that opinion, and an honest person could have held it on the basis of a fact existing, or a privileged statement made, at the time."},
  {"id":"cb054","type":"concept","name":"serious harm","subject":"FLK1","topic":"Defamation","principle":"S.1 Defamation Act 2013 introduced a 'serious harm' threshold — a statement is not defamatory unless its publication has caused or is likely to cause serious harm to the claimant's reputation.","relatedCardId":"c072"},
  {"id":"cb055","type":"concept","name":"consent defence","subject":"FLK1","topic":"Defences to Negligence","principle":"Volenti non fit injuria is a complete defence where the claimant has freely and knowingly consented to the specific risk that materialised, distinct from contributory negligence which only reduces damages.","relatedCardId":"c047"},
  {"id":"cb056","type":"concept","name":"Contributory negligence distinguished from volenti","subject":"FLK1","topic":"Defences to Negligence","principle":"Volenti non fit injuria is a complete defence based on the claimant's free and informed consent to the specific risk that materialised, while contributory negligence merely reduces damages for the claimant's own carelessness — the two are not interchangeable."},
  {"id":"cb057","type":"concept","name":"Ex turpi causa (illegality defence)","subject":"FLK1","topic":"Defences to Negligence","principle":"A claimant generally cannot recover in negligence for loss suffered as a consequence of their own criminal or seriously wrongful conduct, where allowing the claim would be inconsistent with the integrity of the legal system."},
  {"id":"cb058","type":"concept","name":"UCTA 1977 and negligence liability","subject":"FLK1","topic":"Defences to Negligence","principle":"A contract term or notice cannot exclude or restrict business liability for death or personal injury caused by negligence at all; exclusion of liability for other loss caused by negligence is subject to the reasonableness test in s.11 UCTA 1977."},
  {"id":"cb059","type":"concept","name":"volenti non fit injuria","subject":"FLK1","topic":"Defences to Negligence","principle":"Volenti non fit injuria is a complete defence where the claimant has freely and knowingly consented to the specific risk that materialised, distinct from contributory negligence which only reduces damages.","relatedCardId":"c047"},
  {"id":"cb060","type":"concept","name":"diminished responsibility","subject":"FLK1","topic":"Defences","principle":"Diminished responsibility under s.2 Homicide Act 1957 (as amended by the Coroners and Justice Act 2009) is a partial defence specific to murder, reducing the conviction to voluntary manslaughter.","relatedCardId":"c051"},
  {"id":"cb061","type":"statute","name":"Homicide Act 1957","subject":"FLK1","topic":"Defences","principle":"Diminished responsibility under s.2 Homicide Act 1957 (as amended by the Coroners and Justice Act 2009) is a partial defence specific to murder, reducing the conviction to voluntary manslaughter.","relatedCardId":"c051"},
  {"id":"cb062","type":"statute","name":"s.76 CJIA 2008","subject":"FLK1","topic":"Defences","principle":"Following R v Williams (Gladstone) and s.76 Criminal Justice and Immigration Act 2008, D is judged on the facts as honestly believed (even if unreasonable, subject to intoxication rules), but the degree of force must be reasonable in those circumstances.","relatedCardId":"c023"},
  {"id":"cb063","type":"concept","name":"self-defence","subject":"FLK1","topic":"Defences","principle":"Following R v Williams (Gladstone) and s.76 Criminal Justice and Immigration Act 2008, D is judged on the facts as honestly believed (even if unreasonable, subject to intoxication rules), but the degree of force must be reasonable in those circumstances.","relatedCardId":"c023"},
  {"id":"cb064","type":"case","name":"Davis Contractors","subject":"FLK1","topic":"Discharge & Remedies","principle":"A contract is frustrated when, after formation, an unforeseen event makes performance impossible, illegal, or radically different (Taylor v Caldwell). It does NOT cover events merely making performance more expensive or difficult (Davis Contractors v Fareham UDC), nor self-induced frustration.","relatedCardId":"c014"},
  {"id":"cb065","type":"concept","name":"expectation loss","subject":"FLK1","topic":"Discharge & Remedies","principle":"Contract damages are compensatory, aimed at expectation loss — putting the claimant in the position as if the contract had been properly performed, subject to remoteness (Hadley v Baxendale) and mitigation.","relatedCardId":"c015"},
  {"id":"cb066","type":"case","name":"Hadley v Baxendale","subject":"FLK1","topic":"Discharge & Remedies","principle":"Contract damages are compensatory, aimed at expectation loss — putting the claimant in the position as if the contract had been properly performed, subject to remoteness (Hadley v Baxendale) and mitigation.","relatedCardId":"c015"},
  {"id":"cb067","type":"concept","name":"remoteness of damage","subject":"FLK1","topic":"Discharge & Remedies","principle":"Hadley v Baxendale limits recoverable damages to loss arising naturally from the breach, or loss reasonably in the contemplation of both parties at contract formation as a probable result of breach — unusual, unknown losses fall outside this.","relatedCardId":"c044"},
  {"id":"cb068","type":"case","name":"Taylor v Caldwell","subject":"FLK1","topic":"Discharge & Remedies","principle":"A contract is frustrated when, after formation, an unforeseen event makes performance impossible, illegal, or radically different (Taylor v Caldwell). It does NOT cover events merely making performance more expensive or difficult (Davis Contractors v Fareham UDC), nor self-induced frustration.","relatedCardId":"c014"},
  {"id":"cb069","type":"concept","name":"easements","subject":"FLK1","topic":"Easements","principle":"Long, continuous, open ('as of right') use for 20+ years without permission can give rise to an easement by prescription, even absent an express deed.","relatedCardId":"c025"},
  {"id":"cb070","type":"concept","name":"Implied and statutory easements","subject":"FLK1","topic":"Easements","principle":"Beyond express grant by deed, easements can arise by necessity, common intention, the rule in Wheeldon v Burrows, or under s.62 Law of Property Act 1925, which can upgrade informal permissions into full easements on a conveyance."},
  {"id":"cb071","type":"concept","name":"prescription","subject":"FLK1","topic":"Easements","principle":"Long, continuous, open ('as of right') use for 20+ years without permission can give rise to an easement by prescription, even absent an express deed.","relatedCardId":"c025"},
  {"id":"cb072","type":"case","name":"Re Ellenborough Park","subject":"FLK1","topic":"Easements","principle":"Sets out the four essential characteristics of an easement: there must be a dominant and a servient tenement; the right must accommodate (benefit) the dominant tenement; the two tenements must be owned/occupied by different persons; and the right must be capable of forming the subject matter of a grant."},
  {"id":"cb073","type":"case","name":"Wheeldon v Burrows","subject":"FLK1","topic":"Easements","principle":"On a transfer of part of land, 'continuous and apparent' quasi-easements the seller had been exercising over the retained land for the benefit of the part transferred can pass to the buyer as full legal easements, absent contrary intention."},
  {"id":"cb074","type":"concept","name":"Competent staff","subject":"FLK1","topic":"Employers' Liability","principle":"One of the traditional elements of the employer's duty (alongside safe equipment, safe premises, and a safe system of work), requiring reasonable care in selecting and supervising staff, particularly where there is a known risk of harmful conduct such as bullying."},
  {"id":"cb075","type":"statute","name":"Employer's Liability (Compulsory Insurance) Act 1969","subject":"FLK1","topic":"Employers' Liability","principle":"Requires most employers to maintain insurance against liability for bodily injury or disease sustained by employees arising out of and in the course of their employment."},
  {"id":"cb076","type":"concept","name":"employers' liability","subject":"FLK1","topic":"Employers' Liability","principle":"Employers owe a personal, non-delegable duty at common law to provide competent staff, safe equipment, a safe system of work, and a safe place of work (Wilsons & Clyde Coal Co v English).","relatedCardId":"c094"},
  {"id":"cb077","type":"concept","name":"Non-delegable duty (employer)","subject":"FLK1","topic":"Employers' Liability","principle":"An employer's common law duty to provide a safe system of work is personal and non-delegable — the employer remains liable even if performance of the duty was entrusted to a competent employee or independent contractor."},
  {"id":"cb078","type":"concept","name":"safe system of work","subject":"FLK1","topic":"Employers' Liability","principle":"Employers owe a personal, non-delegable duty at common law to provide competent staff, safe equipment, a safe system of work, and a safe place of work (Wilsons & Clyde Coal Co v English).","relatedCardId":"c094"},
  {"id":"cb079","type":"concept","name":"false representation","subject":"FLK1","topic":"Fraud","principle":"Fraud by false representation (s.2 Fraud Act 2006) is a conduct crime — it is complete on the dishonest false representation made with the requisite intent, without needing proof that anyone was actually deceived or suffered loss.","relatedCardId":"c096"},
  {"id":"cb080","type":"statute","name":"Fraud Act 2006","subject":"FLK1","topic":"Fraud","principle":"Fraud by false representation (s.2 Fraud Act 2006) is a conduct crime — it is complete on the dishonest false representation made with the requisite intent, without needing proof that anyone was actually deceived or suffered loss.","relatedCardId":"c096"},
  {"id":"cb081","type":"concept","name":"Passing the benefit","subject":"FLK1","topic":"Freehold Covenants","principle":"The benefit of a covenant can pass to a successor at law (if it touches and concerns the land and the successor has a legal estate) or in equity, by annexation, express assignment, or under a building scheme."},
  {"id":"cb082","type":"concept","name":"Passing the burden at law","subject":"FLK1","topic":"Freehold Covenants","principle":"The burden of a freehold covenant generally does not run with the land at common law, meaning successors in title to the burdened land are not bound at law — only in equity, via the rule in Tulk v Moxhay."},
  {"id":"cb083","type":"concept","name":"restrictive covenants","subject":"FLK1","topic":"Freehold Covenants","principle":"Tulk v Moxhay allows the burden of a restrictive covenant to run in equity against successors, and the benefit can pass via annexation, express assignment, or a building scheme, subject to the usual requirements.","relatedCardId":"c076"},
  {"id":"cb084","type":"statute","name":"s.84 Law of Property Act 1925","subject":"FLK1","topic":"Freehold Covenants","principle":"Gives the Upper Tribunal (Lands Chamber) jurisdiction to discharge or modify restrictive covenants that have become obsolete or impede reasonable use of land, on specified statutory grounds."},
  {"id":"cb085","type":"case","name":"Tulk v Moxhay","subject":"FLK1","topic":"Freehold Covenants","principle":"Tulk v Moxhay allows the burden of a restrictive covenant to run in equity against successors, and the benefit can pass via annexation, express assignment, or a building scheme, subject to the usual requirements.","relatedCardId":"c076"},
  {"id":"cb086","type":"concept","name":"frustration","subject":"FLK1","topic":"Frustration","principle":"Destruction of the subject matter essential to performance (as in Taylor v Caldwell) frustrates the contract; the Law Reform (Frustrated Contracts) Act 1943 then governs recovery of pre-paid sums and expenses.","relatedCardId":"c115"},
  {"id":"cb087","type":"statute","name":"Law Reform (Frustrated Contracts) Act 1943","subject":"FLK1","topic":"Frustration","principle":"Destruction of the subject matter essential to performance (as in Taylor v Caldwell) frustrates the contract; the Law Reform (Frustrated Contracts) Act 1943 then governs recovery of pre-paid sums and expenses.","relatedCardId":"c115"},
  {"id":"cb088","type":"statute","name":"Coroners and Justice Act 2009","subject":"FLK1","topic":"Homicide","principle":"Loss of control under ss.54-55 CJA 2009 requires a qualifying trigger (fear of serious violence, or things said/done of an extremely grave character causing justifiable sense of being seriously wronged) and genuine loss of self-control — a trivial insult with deliberation is unlikely to satisfy this.","relatedCardId":"c022"},
  {"id":"cb089","type":"concept","name":"loss of control","subject":"FLK1","topic":"Homicide","principle":"Loss of control under ss.54-55 CJA 2009 requires a qualifying trigger (fear of serious violence, or things said/done of an extremely grave character causing justifiable sense of being seriously wronged) and genuine loss of self-control — a trivial insult with deliberation is unlikely to satisfy this.","relatedCardId":"c022"},
  {"id":"cb090","type":"case","name":"R v Church","subject":"FLK1","topic":"Homicide","principle":"Unlawful act manslaughter requires an intentional unlawful act, dangerous in the sense that a sober, reasonable person would recognise a risk of some harm, which causes death — full foresight of death or serious injury is not required (R v Church).","relatedCardId":"c112"},
  {"id":"cb091","type":"concept","name":"unlawful act manslaughter","subject":"FLK1","topic":"Homicide","principle":"Unlawful act manslaughter requires an intentional unlawful act, dangerous in the sense that a sober, reasonable person would recognise a risk of some harm, which causes death — full foresight of death or serious injury is not required (R v Church).","relatedCardId":"c112"},
  {"id":"cb092","type":"concept","name":"Horizontal and vertical effect","subject":"FLK1","topic":"Human Rights Act 1998","principle":"The HRA 1998 has primarily vertical effect (claims against public authorities), though courts, being public authorities themselves, must develop the common law compatibly with Convention rights, giving the Act some indirect effect between private parties."},
  {"id":"cb093","type":"statute","name":"Human Rights Act 1998","subject":"FLK1","topic":"Human Rights Act 1998","principle":"S.3 HRA 1998 requires courts to interpret legislation compatibly with Convention rights so far as possible; if not possible, a higher court may instead issue a declaration of incompatibility under s.4 (which does not invalidate the statute).","relatedCardId":"c078"},
  {"id":"cb094","type":"statute","name":"s.4 HRA 1998 — declaration of incompatibility","subject":"FLK1","topic":"Human Rights Act 1998","principle":"Where legislation cannot be interpreted compatibly with Convention rights under s.3, a higher court may make a declaration of incompatibility; this does not invalidate or suspend the statute but signals to Parliament that a remedy may be needed."},
  {"id":"cb095","type":"statute","name":"s.6 HRA 1998","subject":"FLK1","topic":"Human Rights Act 1998","principle":"Makes it unlawful for a public authority to act in a way incompatible with a Convention right, unless required to do so by primary legislation it cannot interpret compatibly."},
  {"id":"cb096","type":"concept","name":"conspiracy","subject":"FLK1","topic":"Inchoate Offences","principle":"Under s.1 Criminal Law Act 1977, statutory conspiracy is complete on agreement between two or more people to commit an offence — no further act toward the substantive offence is required.","relatedCardId":"c049"},
  {"id":"cb097","type":"statute","name":"Criminal Attempts Act 1981","subject":"FLK1","topic":"Inchoate Offences","principle":"Under the Criminal Attempts Act 1981, an act more than merely preparatory, done with the requisite intent, can found liability for attempt even where completion was factually impossible in the circumstances.","relatedCardId":"c050"},
  {"id":"cb098","type":"statute","name":"Criminal Law Act 1977","subject":"FLK1","topic":"Inchoate Offences","principle":"Under s.1 Criminal Law Act 1977, statutory conspiracy is complete on agreement between two or more people to commit an offence — no further act toward the substantive offence is required.","relatedCardId":"c049"},
  {"id":"cb099","type":"concept","name":"impossibility","subject":"FLK1","topic":"Inchoate Offences","principle":"Under the Criminal Attempts Act 1981, an act more than merely preparatory, done with the requisite intent, can found liability for attempt even where completion was factually impossible in the circumstances.","relatedCardId":"c050"},
  {"id":"cb100","type":"concept","name":"basic vs specific intent","subject":"FLK1","topic":"Intoxication","principle":"DPP v Majewski established that voluntary intoxication cannot found a defence to basic intent offences (like most assaults), though it may negate the specific intent required for offences like murder or s.18 GBH with intent.","relatedCardId":"c118"},
  {"id":"cb101","type":"case","name":"DPP v Majewski","subject":"FLK1","topic":"Intoxication","principle":"DPP v Majewski established that voluntary intoxication cannot found a defence to basic intent offences (like most assaults), though it may negate the specific intent required for offences like murder or s.18 GBH with intent.","relatedCardId":"c118"},
  {"id":"cb102","type":"concept","name":"voluntary intoxication","subject":"FLK1","topic":"Intoxication","principle":"DPP v Majewski established that voluntary intoxication cannot found a defence to basic intent offences (like most assaults), though it may negate the specific intent required for offences like murder or s.18 GBH with intent.","relatedCardId":"c118"},
  {"id":"cb103","type":"statute","name":"CPR 54.5","subject":"FLK1","topic":"Judicial Review","principle":"CPR 54.5 requires a claim for judicial review to be filed promptly, and in any event within 3 months of the grounds first arising, subject to specific statutory variations.","relatedCardId":"c039"},
  {"id":"cb104","type":"concept","name":"judicial review","subject":"FLK1","topic":"Judicial Review","principle":"Irrationality/Wednesbury unreasonableness applies where a decision is so unreasonable that no reasonable decision-maker could have reached it (Associated Provincial Picture Houses v Wednesbury Corp).","relatedCardId":"c038"},
  {"id":"cb105","type":"concept","name":"judicial review time limits","subject":"FLK1","topic":"Judicial Review","principle":"CPR 54.5 requires a claim for judicial review to be filed promptly, and in any event within 3 months of the grounds first arising, subject to specific statutory variations.","relatedCardId":"c039"},
  {"id":"cb106","type":"concept","name":"Wednesbury unreasonableness","subject":"FLK1","topic":"Judicial Review","principle":"Irrationality/Wednesbury unreasonableness applies where a decision is so unreasonable that no reasonable decision-maker could have reached it (Associated Provincial Picture Houses v Wednesbury Corp).","relatedCardId":"c038"},
  {"id":"cb107","type":"concept","name":"Assignment vs sub-letting","subject":"FLK1","topic":"Leases","principle":"An assignment transfers the tenant's entire remaining interest to a new tenant, who steps into the original tenant's shoes; a sub-lease instead creates a new, shorter estate carved out of the tenant's interest, with the original tenant remaining as landlord of the sub-tenant."},
  {"id":"cb108","type":"concept","name":"Forfeiture of leases","subject":"FLK1","topic":"Leases","principle":"A landlord may seek to forfeit a lease for breach of covenant where the lease contains a forfeiture clause, but must generally serve a s.146 Law of Property Act 1925 notice for breaches other than non-payment of rent, and the tenant may apply for relief from forfeiture."},
  {"id":"cb109","type":"concept","name":"Formalities for legal leases","subject":"FLK1","topic":"Leases","principle":"A legal lease for more than 3 years generally requires creation by deed (s.52 LPA 1925) and registration if for a term of more than 7 years (LRA 2002); a lease of 3 years or less, taking effect in possession at the best rent reasonably obtainable without a premium, can be created orally or informally in writing (s.54(2) LPA 1925)."},
  {"id":"cb110","type":"concept","name":"leases vs licences","subject":"FLK1","topic":"Leases","principle":"Street v Mountford establishes that substance prevails over form — exclusive possession, for a fixed or periodic term, at a rent, creates a tenancy irrespective of the label the parties use.","relatedCardId":"c026"},
  {"id":"cb111","type":"case","name":"Street v Mountford","subject":"FLK1","topic":"Leases","principle":"Street v Mountford establishes that substance prevails over form — exclusive possession, for a fixed or periodic term, at a rent, creates a tenancy irrespective of the label the parties use.","relatedCardId":"c026"},
  {"id":"cb112","type":"concept","name":"burden of proof","subject":"FLK1","topic":"Misrepresentation","principle":"S.2(1) Misrepresentation Act 1967 reverses the normal burden of proof: once a false statement inducing the contract is shown, the maker must prove they had reasonable grounds to believe it true.","relatedCardId":"c069"},
  {"id":"cb113","type":"statute","name":"Misrepresentation Act 1967","subject":"FLK1","topic":"Misrepresentation","principle":"Fraudulent (deceit; damages under tort measure + rescission), Negligent under s.2(1) Misrepresentation Act 1967 (damages as if fraudulent, reversed burden of proof, + rescission), Innocent (rescission, or damages in lieu under s.2(2)).","relatedCardId":"c012"},
  {"id":"cb114","type":"concept","name":"rescission","subject":"FLK1","topic":"Misrepresentation","principle":"Even innocent misrepresentation entitles the representee to rescind the contract; the court has discretion under s.2(2) Misrepresentation Act 1967 to award damages in lieu of rescission.","relatedCardId":"c068"},
  {"id":"cb115","type":"statute","name":"s.2(1) Misrepresentation Act 1967","subject":"FLK1","topic":"Misrepresentation","principle":"The statement was false, induced the contract, and the maker had no reasonable grounds to believe it true — this is negligent misrepresentation under s.2(1), which reverses the burden of proof onto the representor.","relatedCardId":"c013"},
  {"id":"cb116","type":"concept","name":"Equity of redemption","subject":"FLK1","topic":"Mortgages","principle":"The mortgagor's underlying proprietary right to redeem (get back) the mortgaged property on repayment of the loan, protected by equity against contractual terms that unduly restrict or postpone this right ('no clogs on the equity of redemption')."},
  {"id":"cb117","type":"concept","name":"Foreclosure","subject":"FLK1","topic":"Mortgages","principle":"A court order vesting the mortgaged property absolutely in the mortgagee and extinguishing the mortgagor's equity of redemption; rarely used in practice given the availability of the power of sale."},
  {"id":"cb118","type":"concept","name":"mortgagee remedies","subject":"FLK1","topic":"Mortgages","principle":"Taking possession (often via a court order for residential property) is a common step allowing a mortgagee to then exercise the power of sale to realise the security.","relatedCardId":"c053"},
  {"id":"cb119","type":"concept","name":"possession","subject":"FLK1","topic":"Mortgages","principle":"Taking possession (often via a court order for residential property) is a common step allowing a mortgagee to then exercise the power of sale to realise the security.","relatedCardId":"c053"},
  {"id":"cb120","type":"concept","name":"Undue influence and mortgages","subject":"FLK1","topic":"Mortgages","principle":"Where a mortgage/guarantee is procured by undue influence over a surety and the lender is put on inquiry, the lender may be unable to enforce the security against that surety unless reasonable steps (e.g. independent legal advice) were taken (Etridge (No 2))."},
  {"id":"cb121","type":"concept","name":"Caparo test applied to economic loss","subject":"FLK1","topic":"Negligence — Economic Loss","principle":"Courts apply the threefold Caparo test (foreseeability, proximity, fair/just/reasonable) with particular caution in pure economic loss cases, given policy concerns about indeterminate liability to an indeterminate class."},
  {"id":"cb122","type":"case","name":"Hedley Byrne v Heller","subject":"FLK1","topic":"Negligence — Economic Loss","principle":"Hedley Byrne v Heller established that a duty of care can arise for negligent misstatements causing pure economic loss where there is a special relationship involving assumption of responsibility and reasonable reliance.","relatedCardId":"c073"},
  {"id":"cb123","type":"concept","name":"pure economic loss","subject":"FLK1","topic":"Negligence — Economic Loss","principle":"Hedley Byrne v Heller established that a duty of care can arise for negligent misstatements causing pure economic loss where there is a special relationship involving assumption of responsibility and reasonable reliance.","relatedCardId":"c073"},
  {"id":"cb124","type":"concept","name":"Pure economic loss general exclusionary rule","subject":"FLK1","topic":"Negligence — Economic Loss","principle":"As a general rule, the tort of negligence does not compensate for pure economic loss (loss not consequential on physical damage to person or property), subject to recognised exceptions such as negligent misstatement and certain assumption-of-responsibility cases."},
  {"id":"cb125","type":"case","name":"Spartan Steel & Alloys v Martin & Co","subject":"FLK1","topic":"Negligence — Economic Loss","principle":"Illustrates the distinction between recoverable physical damage/consequential economic loss and irrecoverable pure economic loss flowing from damage to a third party's property — there, a power cut damaging the claimant's furnace and causing lost production."},
  {"id":"cb126","type":"case","name":"Barnett","subject":"FLK1","topic":"Negligence","principle":"Barnett established that even where there is a clear breach, a claimant must show the breach caused the harm on the balance of probabilities. If death was inevitable regardless, factual causation fails.","relatedCardId":"c017"},
  {"id":"cb127","type":"concept","name":"breach of duty","subject":"FLK1","topic":"Negligence","principle":"A driver owes an established duty to other road users. Checking a phone instead of watching the road falls below the standard of the reasonable driver (Nettleship v Weston) — this is breach, not the other elements.","relatedCardId":"c016"},
  {"id":"cb128","type":"concept","name":"but for test","subject":"FLK1","topic":"Negligence","principle":"Barnett established that even where there is a clear breach, a claimant must show the breach caused the harm on the balance of probabilities. If death was inevitable regardless, factual causation fails.","relatedCardId":"c017"},
  {"id":"cb129","type":"case","name":"Caparo v Dickman","subject":"FLK1","topic":"Negligence","principle":"For novel duty situations, Caparo v Dickman requires foreseeability, proximity, and that imposing a duty be fair, just and reasonable — all three elements are assessed incrementally by analogy with existing categories.","relatedCardId":"c045"},
  {"id":"cb130","type":"concept","name":"chain of causation","subject":"FLK1","topic":"Negligence","principle":"Ordinary negligent medical treatment of an injury caused by the original tort generally does not break the chain of causation (Webb v Barclays Bank; Rahman v Arearose) — only egregiously poor treatment is likely to constitute a novus actus interveniens.","relatedCardId":"c111"},
  {"id":"cb131","type":"concept","name":"duty of care","subject":"FLK1","topic":"Negligence","principle":"For novel duty situations, Caparo v Dickman requires foreseeability, proximity, and that imposing a duty be fair, just and reasonable — all three elements are assessed incrementally by analogy with existing categories.","relatedCardId":"c045"},
  {"id":"cb132","type":"case","name":"Haynes v Harwood","subject":"FLK1","topic":"Negligence","principle":"Haynes v Harwood and related authorities establish that rescuers are foreseeable claimants and their intervention to assist does not usually break the chain of causation from the defendant's original negligence.","relatedCardId":"c091"},
  {"id":"cb133","type":"case","name":"Hughes v Lord Advocate","subject":"FLK1","topic":"Negligence","principle":"Under Hughes v Lord Advocate, liability turns on foreseeability of the type of harm, not the exact sequence of events by which it occurs.","relatedCardId":"c018"},
  {"id":"cb134","type":"concept","name":"medical negligence intervening act","subject":"FLK1","topic":"Negligence","principle":"Ordinary negligent medical treatment of an injury caused by the original tort generally does not break the chain of causation (Webb v Barclays Bank; Rahman v Arearose) — only egregiously poor treatment is likely to constitute a novus actus interveniens.","relatedCardId":"c111"},
  {"id":"cb135","type":"case","name":"Nettleship v Weston","subject":"FLK1","topic":"Negligence","principle":"A driver owes an established duty to other road users. Checking a phone instead of watching the road falls below the standard of the reasonable driver (Nettleship v Weston) — this is breach, not the other elements.","relatedCardId":"c016"},
  {"id":"cb136","type":"concept","name":"novus actus interveniens","subject":"FLK1","topic":"Negligence","principle":"Haynes v Harwood and related authorities establish that rescuers are foreseeable claimants and their intervention to assist does not usually break the chain of causation from the defendant's original negligence.","relatedCardId":"c091"},
  {"id":"cb137","type":"concept","name":"remoteness","subject":"FLK1","topic":"Negligence","principle":"Under Hughes v Lord Advocate, liability turns on foreseeability of the type of harm, not the exact sequence of events by which it occurs.","relatedCardId":"c018"},
  {"id":"cb138","type":"concept","name":"rescuer cases","subject":"FLK1","topic":"Negligence","principle":"Haynes v Harwood and related authorities establish that rescuers are foreseeable claimants and their intervention to assist does not usually break the chain of causation from the defendant's original negligence.","relatedCardId":"c091"},
  {"id":"cb139","type":"case","name":"Smith v Leech Brain","subject":"FLK1","topic":"Negligence","principle":"The thin skull rule means a defendant is liable for the full extent of injury even if unusually severe due to the claimant's pre-existing vulnerability, provided the type of harm was foreseeable (Smith v Leech Brain).","relatedCardId":"c046"},
  {"id":"cb140","type":"concept","name":"thin skull rule","subject":"FLK1","topic":"Negligence","principle":"The thin skull rule means a defendant is liable for the full extent of injury even if unusually severe due to the claimant's pre-existing vulnerability, provided the type of harm was foreseeable (Smith v Leech Brain).","relatedCardId":"c046"},
  {"id":"cb141","type":"case","name":"R v Cunningham","subject":"FLK1","topic":"Non-Fatal Offences","principle":"Offences under ss.20/47 OAPA 1861 can be satisfied by subjective recklessness as to some harm resulting (R v Cunningham; R v Savage), even without intent to injure the specific victim.","relatedCardId":"c074"},
  {"id":"cb142","type":"concept","name":"recklessness","subject":"FLK1","topic":"Non-Fatal Offences","principle":"Offences under ss.20/47 OAPA 1861 can be satisfied by subjective recklessness as to some harm resulting (R v Cunningham; R v Savage), even without intent to injure the specific victim.","relatedCardId":"c074"},
  {"id":"cb143","type":"statute","name":"s.20 OAPA 1861","subject":"FLK1","topic":"Non-Fatal Offences","principle":"Offences under ss.20/47 OAPA 1861 can be satisfied by subjective recklessness as to some harm resulting (R v Cunningham; R v Savage), even without intent to injure the specific victim.","relatedCardId":"c074"},
  {"id":"cb144","type":"concept","name":"private nuisance","subject":"FLK1","topic":"Nuisance","principle":"Private nuisance protects against substantial and unreasonable interference with the use and enjoyment of land, distinct from trespass (which requires direct physical interference).","relatedCardId":"c071"},
  {"id":"cb145","type":"concept","name":"Public nuisance","subject":"FLK1","topic":"Nuisance","principle":"Public nuisance is distinct from private nuisance: it affects a class of the public and can found both a criminal offence and a civil claim, but a claimant must usually show they suffered damage over and above that suffered by the rest of the class."},
  {"id":"cb146","type":"concept","name":"Reasonable user (nuisance)","subject":"FLK1","topic":"Nuisance","principle":"The touchstone of liability in private nuisance is whether the defendant's use of land was reasonable, weighing factors such as locality, duration and frequency, and the sensitivity of the claimant's own use."},
  {"id":"cb147","type":"case","name":"Rylands v Fletcher","subject":"FLK1","topic":"Nuisance","principle":"Establishes a strict liability tort for the escape of a dangerous thing accumulated on land in the course of a non-natural use, causing foreseeable damage; now generally treated as a specialised branch of private nuisance rather than a standalone tort."},
  {"id":"cb148","type":"concept","name":"Common duty of care","subject":"FLK1","topic":"Occupiers' Liability","principle":"Under s.2(2) Occupiers' Liability Act 1957, an occupier must take such care as is reasonable in all the circumstances to see that a visitor will be reasonably safe in using the premises for the purposes for which they are invited or permitted to be there."},
  {"id":"cb149","type":"concept","name":"Independent contractors (occupiers' liability)","subject":"FLK1","topic":"Occupiers' Liability","principle":"Under s.2(4)(b) OLA 1957, an occupier is not liable for danger due to faulty work by an independent contractor if it was reasonable to entrust the work to them and the occupier took reasonable steps to check the work was properly done and the contractor was competent."},
  {"id":"cb150","type":"statute","name":"Occupiers' Liability Act 1984","subject":"FLK1","topic":"Occupiers' Liability","principle":"The 1957 Act covers lawful visitors; the 1984 Act governs the duty owed to trespassers/non-visitors, particularly where the occupier is aware people may come into the vicinity of a danger.","relatedCardId":"c019"},
  {"id":"cb151","type":"concept","name":"Warning notices (occupiers' liability)","subject":"FLK1","topic":"Occupiers' Liability","principle":"Under s.2(4)(a) OLA 1957, a warning of a danger does not by itself discharge the occupier's duty unless, in all the circumstances, it was enough to make the visitor reasonably safe."},
  {"id":"cb152","type":"concept","name":"Constitutional statutes","subject":"FLK1","topic":"Parliamentary Sovereignty","principle":"Courts have recognised a category of 'constitutional statutes' which are not subject to the ordinary doctrine of implied repeal and can only be expressly repealed, reflecting their special constitutional status."},
  {"id":"cb153","type":"case","name":"Dicey","subject":"FLK1","topic":"Parliamentary Sovereignty","principle":"Dicey's classic formulation of parliamentary sovereignty holds that Parliament has unlimited legislative competence and its Acts cannot be overridden or invalidated by any other body, including the courts.","relatedCardId":"c079"},
  {"id":"cb154","type":"concept","name":"EU law and parliamentary sovereignty (historical)","subject":"FLK1","topic":"Parliamentary Sovereignty","principle":"While the UK was an EU member, the European Communities Act 1972 gave EU law supremacy over inconsistent domestic legislation; this arrangement ended with the UK's withdrawal from the EU."},
  {"id":"cb155","type":"concept","name":"Implied repeal","subject":"FLK1","topic":"Parliamentary Sovereignty","principle":"Under the traditional doctrine, where a later Act conflicts with an earlier Act, the later Act impliedly repeals the earlier one to the extent of the inconsistency, since Parliament cannot bind its successors."},
  {"id":"cb156","type":"concept","name":"parliamentary sovereignty","subject":"FLK1","topic":"Parliamentary Sovereignty","principle":"Dicey's classic formulation of parliamentary sovereignty holds that Parliament has unlimited legislative competence and its Acts cannot be overridden or invalidated by any other body, including the courts.","relatedCardId":"c079"},
  {"id":"cb157","type":"statute","name":"Contracts (Rights of Third Parties) Act 1999","subject":"FLK1","topic":"Privity of Contract","principle":"The Contracts (Rights of Third Parties) Act 1999 allows a third party to enforce a contractual term where the contract expressly says so, or where the term purports to confer a benefit on them, displacing strict privity in these circumstances.","relatedCardId":"c114"},
  {"id":"cb158","type":"concept","name":"privity","subject":"FLK1","topic":"Privity of Contract","principle":"The Contracts (Rights of Third Parties) Act 1999 allows a third party to enforce a contractual term where the contract expressly says so, or where the term purports to confer a benefit on them, displacing strict privity in these circumstances.","relatedCardId":"c114"},
  {"id":"cb159","type":"statute","name":"Consumer Protection Act 1987","subject":"FLK1","topic":"Product Liability","principle":"The Consumer Protection Act 1987 implements strict (no-fault) liability for producers of defective products causing damage, removing the need to prove negligence.","relatedCardId":"c048"},
  {"id":"cb160","type":"concept","name":"Defect under the CPA 1987","subject":"FLK1","topic":"Product Liability","principle":"A product is 'defective' under the Consumer Protection Act 1987 if its safety is not such as persons generally are entitled to expect, taking into account all the circumstances, including how it was marketed and any instructions or warnings given."},
  {"id":"cb161","type":"concept","name":"Development risks defence","subject":"FLK1","topic":"Product Liability","principle":"Under s.4(1)(e) CPA 1987, a producer has a defence if the state of scientific and technical knowledge at the time the product was put into circulation was not such that a producer of similar products might have been expected to discover the defect."},
  {"id":"cb162","type":"case","name":"Donoghue v Stevenson","subject":"FLK1","topic":"Product Liability","principle":"The foundational 'neighbour principle' case: a manufacturer owes a duty of care to the ultimate consumer of a product to take reasonable care that it is free from defects likely to cause injury, even absent a contract between them."},
  {"id":"cb163","type":"concept","name":"strict liability","subject":"FLK1","topic":"Product Liability","principle":"The Consumer Protection Act 1987 implements strict (no-fault) liability for producers of defective products causing damage, removing the need to prove negligence.","relatedCardId":"c048"},
  {"id":"cb164","type":"concept","name":"proprietary estoppel","subject":"FLK1","topic":"Proprietary Estoppel","principle":"Proprietary estoppel requires a clear assurance, reasonable reliance by the claimant, and resulting detriment; where established, the court has discretion to satisfy the equity, which can include transferring the promised interest (Thorner v Major).","relatedCardId":"c120"},
  {"id":"cb165","type":"case","name":"Thorner v Major","subject":"FLK1","topic":"Proprietary Estoppel","principle":"Proprietary estoppel requires a clear assurance, reasonable reliance by the claimant, and resulting detriment; where established, the court has discretion to satisfy the equity, which can include transferring the promised interest (Thorner v Major).","relatedCardId":"c120"},
  {"id":"cb166","type":"case","name":"Alcock v Chief Constable of South Yorkshire","subject":"FLK1","topic":"Psychiatric Injury","principle":"Alcock sets out the key control mechanisms for secondary victim claims: a close relationship of love and affection, proximity in time and space to the event or its immediate aftermath, and direct perception (not merely being told about it).","relatedCardId":"c116"},
  {"id":"cb167","type":"concept","name":"secondary victims","subject":"FLK1","topic":"Psychiatric Injury","principle":"Alcock sets out the key control mechanisms for secondary victim claims: a close relationship of love and affection, proximity in time and space to the event or its immediate aftermath, and direct perception (not merely being told about it).","relatedCardId":"c116"},
  {"id":"cb168","type":"concept","name":"First registration","subject":"FLK1","topic":"Registered Land","principle":"Certain dealings with unregistered land (e.g. a transfer, a first legal mortgage, or a lease over 7 years) trigger compulsory first registration of title at the Land Registry under the LRA 2002."},
  {"id":"cb169","type":"statute","name":"LRA 2002 Sch 3","subject":"FLK1","topic":"Registered Land","principle":"Sch 3, para 2 LRA 2002 protects interests of persons in actual occupation as overriding interests, capable of binding a purchaser even without registration, subject to specified exceptions.","relatedCardId":"c055"},
  {"id":"cb170","type":"concept","name":"Mirror principle","subject":"FLK1","topic":"Registered Land","principle":"The register is intended to be a complete and accurate reflection of the state of title to registered land, so a purchaser can generally rely on it without further investigation, subject to overriding interests."},
  {"id":"cb171","type":"concept","name":"Notices and restrictions","subject":"FLK1","topic":"Registered Land","principle":"Under the LRA 2002, third-party interests can be protected on the register by entering a notice (for interests such as easements, restrictive covenants or estate contracts) or a restriction (limiting the circumstances in which a registered disposition can be made)."},
  {"id":"cb172","type":"concept","name":"overriding interests","subject":"FLK1","topic":"Registered Land","principle":"Sch 3, para 2 LRA 2002 protects interests of persons in actual occupation as overriding interests, capable of binding a purchaser even without registration, subject to specified exceptions.","relatedCardId":"c055"},
  {"id":"cb173","type":"concept","name":"constructive trust","subject":"FLK1","topic":"Resulting & Constructive Trusts","principle":"Where legal title is in one name but there is a common intention (express or inferred) that both should have a beneficial share, and detrimental reliance, a common intention constructive trust can arise (Stack v Dowden; Jones v Kernott).","relatedCardId":"c028"},
  {"id":"cb174","type":"concept","name":"Presumed resulting trust","subject":"FLK1","topic":"Resulting & Constructive Trusts","principle":"Where a person contributes to the purchase price of property without more, equity presumes (absent contrary intention, or the presumption of advancement) that the legal owner holds the property on resulting trust in proportion to that contribution."},
  {"id":"cb175","type":"concept","name":"Presumption of advancement","subject":"FLK1","topic":"Resulting & Constructive Trusts","principle":"Historically, a transfer of property from husband to wife, or parent to child, is presumed to be an outright gift rather than giving rise to a resulting trust — a presumption that can be rebutted by evidence of contrary intention."},
  {"id":"cb176","type":"concept","name":"Quantifying the beneficial share","subject":"FLK1","topic":"Resulting & Constructive Trusts","principle":"Once a common intention constructive trust is established, the court considers the whole course of dealing between the parties to determine what share was intended, which may differ from the parties' actual financial contributions (Jones v Kernott)."},
  {"id":"cb177","type":"case","name":"Stack v Dowden","subject":"FLK1","topic":"Resulting & Constructive Trusts","principle":"Where legal title is in one name but there is a common intention (express or inferred) that both should have a beneficial share, and detrimental reliance, a common intention constructive trust can arise (Stack v Dowden; Jones v Kernott).","relatedCardId":"c028"},
  {"id":"cb178","type":"concept","name":"robbery","subject":"FLK1","topic":"Robbery","principle":"S.8 Theft Act 1968 requires force (or threat of force) used on a person to steal; the force need not cause injury — pulling/wrenching an item from someone's grip has been held capable of satisfying this element.","relatedCardId":"c097"},
  {"id":"cb179","type":"statute","name":"s.8 Theft Act 1968","subject":"FLK1","topic":"Robbery","principle":"S.8 Theft Act 1968 requires force (or threat of force) used on a person to steal; the force need not cause injury — pulling/wrenching an item from someone's grip has been held capable of satisfying this element.","relatedCardId":"c097"},
  {"id":"cb180","type":"concept","name":"reasonable belief","subject":"FLK1","topic":"Sexual Offences","principle":"S.1(2) Sexual Offences Act 2003 requires the prosecution to show D did not reasonably believe the complainant consented, with reasonableness assessed by reference to all the circumstances, including steps taken to ascertain consent.","relatedCardId":"c119"},
  {"id":"cb181","type":"statute","name":"Sexual Offences Act 2003","subject":"FLK1","topic":"Sexual Offences","principle":"S.1(2) Sexual Offences Act 2003 requires the prosecution to show D did not reasonably believe the complainant consented, with reasonableness assessed by reference to all the circumstances, including steps taken to ascertain consent.","relatedCardId":"c119"},
  {"id":"cb182","type":"concept","name":"court hierarchy","subject":"FLK1","topic":"Sources of Law","principle":"Under the doctrine of precedent, decisions of lower or equal courts are persuasive, not binding, on higher courts. The Court of Appeal is bound by its own prior decisions and the Supreme Court, not by first-instance rulings.","relatedCardId":"c040"},
  {"id":"cb183","type":"concept","name":"doctrine of precedent","subject":"FLK1","topic":"Sources of Law","principle":"Under the doctrine of precedent, decisions of lower or equal courts are persuasive, not binding, on higher courts. The Court of Appeal is bound by its own prior decisions and the Supreme Court, not by first-instance rulings.","relatedCardId":"c040"},
  {"id":"cb184","type":"concept","name":"Practice Statement 1966","subject":"FLK1","topic":"Sources of Law","principle":"The House of Lords (now Supreme Court) announced it may depart from its own previous decisions when it appears right to do so, moving away from the earlier rule that it was absolutely bound by its own past decisions."},
  {"id":"cb185","type":"concept","name":"Primary and secondary legislation","subject":"FLK1","topic":"Sources of Law","principle":"Primary legislation (Acts of Parliament) is made directly by Parliament, while secondary (delegated) legislation, such as statutory instruments, is made by a body Parliament has empowered to do so, and must stay within the scope of the parent Act (intra vires)."},
  {"id":"cb186","type":"concept","name":"Ratio decidendi and obiter dicta","subject":"FLK1","topic":"Sources of Law","principle":"Under the doctrine of precedent, only the ratio decidendi (the legal reasoning necessary to the decision) is binding on lower courts; obiter dicta (observations made in passing) are merely persuasive."},
  {"id":"cb187","type":"statute","name":"Consumer Rights Act 2015","subject":"FLK1","topic":"Terms","principle":"The Consumer Rights Act 2015 prevents traders from excluding or limiting the core consumer protections, including the implied term of satisfactory quality, in consumer contracts.","relatedCardId":"c110"},
  {"id":"cb188","type":"case","name":"Hong Kong Fir Shipping","subject":"FLK1","topic":"Terms","principle":"Condition: a term so central that breach entitles the innocent party to terminate + damages. Warranty: a minor term — breach gives damages only. Innominate term: classification depends on the seriousness of the consequences of the actual breach (Hong Kong Fir Shipping).","relatedCardId":"c010"},
  {"id":"cb189","type":"concept","name":"incorporation of terms","subject":"FLK1","topic":"Terms","principle":"Where a clause is unsigned, it must be reasonably brought to the other party's attention; particularly onerous or unusual clauses require a higher degree of notice (Interfoto; Parker v South Eastern Railway).","relatedCardId":"c042"},
  {"id":"cb190","type":"concept","name":"innominate terms","subject":"FLK1","topic":"Terms","principle":"Following Hong Kong Fir Shipping, 'seaworthiness' clauses are typically innominate terms — the remedy depends on the practical consequences of the breach, not a fixed label.","relatedCardId":"c011"},
  {"id":"cb191","type":"case","name":"Interfoto","subject":"FLK1","topic":"Terms","principle":"Where a clause is unsigned, it must be reasonably brought to the other party's attention; particularly onerous or unusual clauses require a higher degree of notice (Interfoto; Parker v South Eastern Railway).","relatedCardId":"c042"},
  {"id":"cb192","type":"concept","name":"reasonableness test","subject":"FLK1","topic":"Terms","principle":"Under s.2(2) UCTA 1977, exclusion of liability for negligence causing loss other than death/personal injury is subject to the reasonableness test in s.11.","relatedCardId":"c043"},
  {"id":"cb193","type":"concept","name":"satisfactory quality","subject":"FLK1","topic":"Terms","principle":"The Consumer Rights Act 2015 prevents traders from excluding or limiting the core consumer protections, including the implied term of satisfactory quality, in consumer contracts.","relatedCardId":"c110"},
  {"id":"cb194","type":"concept","name":"UCTA 1977","subject":"FLK1","topic":"Terms","principle":"Under s.2(2) UCTA 1977, exclusion of liability for negligence causing loss other than death/personal injury is subject to the reasonableness test in s.11.","relatedCardId":"c043"},
  {"id":"cb195","type":"concept","name":"burglary","subject":"FLK1","topic":"Theft & Property Offences","principle":"Burglary under s.9(1)(b) requires D to be a trespasser and, having entered as such, to steal or attempt to steal (or inflict/attempt GBH). Entering a shop during trading hours as a member of the public is authorised entry, not trespass, so this is more likely simple theft rather than burglary.","relatedCardId":"c052"},
  {"id":"cb196","type":"concept","name":"dishonesty","subject":"FLK1","topic":"Theft & Property Offences","principle":"Under s.2(1)(a) Theft Act 1968, a person is not dishonest if they believe they have a legal right to the property — an honest mistaken belief of ownership negates dishonesty.","relatedCardId":"c024"},
  {"id":"cb197","type":"statute","name":"s.9 Theft Act 1968","subject":"FLK1","topic":"Theft & Property Offences","principle":"Burglary under s.9(1)(b) requires D to be a trespasser and, having entered as such, to steal or attempt to steal (or inflict/attempt GBH). Entering a shop during trading hours as a member of the public is authorised entry, not trespass, so this is more likely simple theft rather than burglary.","relatedCardId":"c052"},
  {"id":"cb198","type":"statute","name":"Theft Act 1968","subject":"FLK1","topic":"Theft & Property Offences","principle":"Under s.2(1)(a) Theft Act 1968, a person is not dishonest if they believe they have a legal right to the property — an honest mistaken belief of ownership negates dishonesty.","relatedCardId":"c024"},
  {"id":"cb199","type":"concept","name":"trespass","subject":"FLK1","topic":"Theft & Property Offences","principle":"Burglary under s.9(1)(b) requires D to be a trespasser and, having entered as such, to steal or attempt to steal (or inflict/attempt GBH). Entering a shop during trading hours as a member of the public is authorised entry, not trespass, so this is more likely simple theft rather than burglary.","relatedCardId":"c052"},
  {"id":"cb200","type":"concept","name":"certainty of objects","subject":"FLK1","topic":"Trust Creation","principle":"McPhail v Doulton established that discretionary trusts need only satisfy the 'is or is not' test for certainty of objects, rather than requiring a complete list of beneficiaries.","relatedCardId":"c057"},
  {"id":"cb201","type":"concept","name":"certainty of subject matter","subject":"FLK1","topic":"Trust Creation","principle":"Hunter v Moss held that a trust of a specified number of identical, fungible intangible assets (like shares of the same class) can be valid without segregation, distinguishing it from cases involving tangible unascertained goods (e.g. Re London Wine Co).","relatedCardId":"c113"},
  {"id":"cb202","type":"concept","name":"constitution of trusts","subject":"FLK1","topic":"Trust Creation","principle":"Milroy v Lord requires the settlor to have done everything necessary to transfer the property, with narrow exceptions where the donor has done all in their power (Re Rose) or it would be unconscionable to resile (Pennington v Waine).","relatedCardId":"c027"},
  {"id":"cb203","type":"case","name":"Hunter v Moss","subject":"FLK1","topic":"Trust Creation","principle":"Hunter v Moss held that a trust of a specified number of identical, fungible intangible assets (like shares of the same class) can be valid without segregation, distinguishing it from cases involving tangible unascertained goods (e.g. Re London Wine Co).","relatedCardId":"c113"},
  {"id":"cb204","type":"case","name":"McPhail v Doulton","subject":"FLK1","topic":"Trust Creation","principle":"McPhail v Doulton established that discretionary trusts need only satisfy the 'is or is not' test for certainty of objects, rather than requiring a complete list of beneficiaries.","relatedCardId":"c057"},
  {"id":"cb205","type":"case","name":"Milroy v Lord","subject":"FLK1","topic":"Trust Creation","principle":"Milroy v Lord requires the settlor to have done everything necessary to transfer the property, with narrow exceptions where the donor has done all in their power (Re Rose) or it would be unconscionable to resile (Pennington v Waine).","relatedCardId":"c027"},
  {"id":"cb206","type":"case","name":"Boardman v Phipps","subject":"FLK1","topic":"Trustees' Duties","principle":"The strict fiduciary no-profit/no-conflict rules (Keech v Sandford; Boardman v Phipps) require trustees to account for unauthorised profits connected to their position, even absent bad faith.","relatedCardId":"c056"},
  {"id":"cb207","type":"concept","name":"Delegation by trustees","subject":"FLK1","topic":"Trustees' Duties","principle":"Under the Trustee Act 2000, trustees may delegate certain administrative or investment functions to agents, subject to statutory safeguards including periodic review of the arrangement; core distributive discretions cannot be delegated."},
  {"id":"cb208","type":"concept","name":"Duty to act unanimously","subject":"FLK1","topic":"Trustees' Duties","principle":"Unless the trust instrument provides otherwise, trustees must generally exercise their powers unanimously — a decision made by a mere majority is not usually binding on the trust."},
  {"id":"cb209","type":"concept","name":"no-profit rule","subject":"FLK1","topic":"Trustees' Duties","principle":"The strict fiduciary no-profit/no-conflict rules (Keech v Sandford; Boardman v Phipps) require trustees to account for unauthorised profits connected to their position, even absent bad faith.","relatedCardId":"c056"},
  {"id":"cb210","type":"statute","name":"Trustee Act 2000 duty of care","subject":"FLK1","topic":"Trustees' Duties","principle":"Trustees must exercise such care and skill as is reasonable in the circumstances, having regard to any special knowledge or experience the trustee has, and, for a professional trustee, to what is reasonable to expect of someone acting in the course of that business."},
  {"id":"cb211","type":"case","name":"Barclays Bank v Various Claimants","subject":"FLK1","topic":"Vicarious Liability","principle":"The Supreme Court confirmed that vicarious liability requires a relationship akin to employment, and reined in earlier expansive lower-court authority by emphasising that a truly independent contractor will not usually meet this threshold."},
  {"id":"cb212","type":"concept","name":"close connection test","subject":"FLK1","topic":"Vicarious Liability","principle":"Prohibitions that merely limit how an authorised task is carried out (an unauthorised route) do not usually take the act outside the course of employment; the 'close connection' test (Lister v Hesley Hall / Mohamud) governs.","relatedCardId":"c020"},
  {"id":"cb213","type":"concept","name":"Independent contractors and vicarious liability","subject":"FLK1","topic":"Vicarious Liability","principle":"As a general rule, employers are not vicariously liable for the torts of a truly independent contractor, only for employees (or those in a relationship 'akin to employment'), subject to limited exceptions for non-delegable duties."},
  {"id":"cb214","type":"concept","name":"Relationship akin to employment","subject":"FLK1","topic":"Vicarious Liability","principle":"Vicarious liability can extend beyond formal employment contracts to relationships that are sufficiently akin to employment, but a genuinely independent contractor in business on their own account will not usually satisfy this test."},
  {"id":"cb215","type":"concept","name":"vicarious liability","subject":"FLK1","topic":"Vicarious Liability","principle":"Prohibitions that merely limit how an authorised task is carried out (an unauthorised route) do not usually take the act outside the course of employment; the 'close connection' test (Lister v Hesley Hall / Mohamud) governs.","relatedCardId":"c020"},
  {"id":"cb216","type":"concept","name":"Duress","subject":"FLK1","topic":"Vitiating Factors","principle":"Illegitimate pressure — such as threats to the person, or in some cases illegitimate economic pressure — which is a significant cause of the claimant entering the contract, can render it voidable and entitle the claimant to rescind."},
  {"id":"cb217","type":"concept","name":"Economic duress","subject":"FLK1","topic":"Vitiating Factors","principle":"Requires illegitimate pressure (e.g. a threat to breach a contract with no reasonable commercial justification) leaving the claimant no practical choice but to submit, going beyond ordinary hard commercial bargaining."},
  {"id":"cb218","type":"case","name":"Etridge (No 2)","subject":"FLK1","topic":"Vitiating Factors","principle":"Etridge (No 2) sets out the steps a bank must take once put on inquiry of possible undue influence in surety cases, including ensuring the surety receives independent advice — failure can render the security unenforceable against the surety.","relatedCardId":"c070"},
  {"id":"cb219","type":"concept","name":"Non est factum","subject":"FLK1","topic":"Vitiating Factors","principle":"A narrow defence allowing a person who signed a document fundamentally different in character from what they believed they were signing, through no carelessness of their own, to avoid the contract entirely."},
  {"id":"cb220","type":"concept","name":"undue influence","subject":"FLK1","topic":"Vitiating Factors","principle":"Etridge (No 2) sets out the steps a bank must take once put on inquiry of possible undue influence in surety cases, including ensuring the surety receives independent advice — failure can render the security unenforceable against the surety.","relatedCardId":"c070"},
  {"id":"cb221","type":"concept","name":"ADR","subject":"FLK2","topic":"Alternative Dispute Resolution","principle":"Courts can and do penalise parties in costs for unreasonably refusing to engage in ADR, even where that party ultimately succeeds at trial (Halsey v Milton Keynes General NHS Trust and subsequent case law).","relatedCardId":"c083"},
  {"id":"cb222","type":"concept","name":"costs sanctions","subject":"FLK2","topic":"Alternative Dispute Resolution","principle":"Courts can and do penalise parties in costs for unreasonably refusing to engage in ADR, even where that party ultimately succeeds at trial (Halsey v Milton Keynes General NHS Trust and subsequent case law).","relatedCardId":"c083"},
  {"id":"cb223","type":"case","name":"Halsey v Milton Keynes","subject":"FLK2","topic":"Alternative Dispute Resolution","principle":"Courts can and do penalise parties in costs for unreasonably refusing to engage in ADR, even where that party ultimately succeeds at trial (Halsey v Milton Keynes General NHS Trust and subsequent case law).","relatedCardId":"c083"},
  {"id":"cb224","type":"statute","name":"CPR Part 27","subject":"FLK2","topic":"Civil Procedure & Limitation","principle":"The small claims track has restricted costs rules (CPR Part 27) — successful parties generally cannot recover their legal costs, only limited fixed items like court fees and certain expenses.","relatedCardId":"c032"},
  {"id":"cb225","type":"statute","name":"Limitation Act 1980","subject":"FLK2","topic":"Civil Procedure & Limitation","principle":"S.5 Limitation Act 1980 sets a 6-year limitation period for actions founded on simple contract, running from the date the cause of action accrued (usually the date of breach).","relatedCardId":"c031"},
  {"id":"cb226","type":"concept","name":"small claims track","subject":"FLK2","topic":"Civil Procedure & Limitation","principle":"The small claims track has restricted costs rules (CPR Part 27) — successful parties generally cannot recover their legal costs, only limited fixed items like court fees and certain expenses.","relatedCardId":"c032"},
  {"id":"cb227","type":"concept","name":"allotment of shares","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Under s.551 CA 2006, directors need authority to allot shares, usually granted by the articles or an ordinary resolution, unless it is a private company with only one class of shares (s.550).","relatedCardId":"c030"},
  {"id":"cb228","type":"concept","name":"articles of association","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.21 CA 2006 requires a special resolution (75% majority) of shareholders to alter a company's articles of association.","relatedCardId":"c100"},
  {"id":"cb229","type":"statute","name":"Companies Act 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Ss.175 and 177 Companies Act 2006 require directors to avoid conflicts of interest and disclose the nature and extent of any interest in a proposed transaction to the board.","relatedCardId":"c029"},
  {"id":"cb230","type":"concept","name":"directors' duties","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Ss.175 and 177 Companies Act 2006 require directors to avoid conflicts of interest and disclose the nature and extent of any interest in a proposed transaction to the board.","relatedCardId":"c029"},
  {"id":"cb231","type":"concept","name":"distributable profits","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Ss.830-831 CA 2006 require a company to have sufficient distributable profits (accumulated realised profits less accumulated realised losses) before lawfully paying a dividend.","relatedCardId":"c081"},
  {"id":"cb232","type":"concept","name":"removal of directors","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.168 CA 2006 allows a company to remove a director by ordinary resolution before the expiration of their period of office, subject to special notice requirements and the director's right to make representations.","relatedCardId":"c080"},
  {"id":"cb233","type":"statute","name":"s.168 CA 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.168 CA 2006 allows a company to remove a director by ordinary resolution before the expiration of their period of office, subject to special notice requirements and the director's right to make representations.","relatedCardId":"c080"},
  {"id":"cb234","type":"statute","name":"s.190 CA 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.190 CA 2006 requires member approval for substantial property transactions between a company and its director (or connected person), subject to exceptions such as wholly-owned subsidiary transactions.","relatedCardId":"c121"},
  {"id":"cb235","type":"statute","name":"s.21 CA 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.21 CA 2006 requires a special resolution (75% majority) of shareholders to alter a company's articles of association.","relatedCardId":"c100"},
  {"id":"cb236","type":"statute","name":"s.551 CA 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Under s.551 CA 2006, directors need authority to allot shares, usually granted by the articles or an ordinary resolution, unless it is a private company with only one class of shares (s.550).","relatedCardId":"c030"},
  {"id":"cb237","type":"concept","name":"special resolution","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.21 CA 2006 requires a special resolution (75% majority) of shareholders to alter a company's articles of association.","relatedCardId":"c100"},
  {"id":"cb238","type":"statute","name":"ss.830-831 CA 2006","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"Ss.830-831 CA 2006 require a company to have sufficient distributable profits (accumulated realised profits less accumulated realised losses) before lawfully paying a dividend.","relatedCardId":"c081"},
  {"id":"cb239","type":"concept","name":"substantial property transactions","subject":"FLK2","topic":"Company Formation & Directors' Duties","principle":"S.190 CA 2006 requires member approval for substantial property transactions between a company and its director (or connected person), subject to exceptions such as wholly-owned subsidiary transactions.","relatedCardId":"c121"},
  {"id":"cb240","type":"concept","name":"AML","subject":"FLK2","topic":"Conveyancing","principle":"Under the Money Laundering Regulations, solicitors must carry out customer due diligence, including verifying client identity and, in higher-risk cases, considering the source of funds/wealth.","relatedCardId":"c105"},
  {"id":"cb241","type":"concept","name":"completion","subject":"FLK2","topic":"Conveyancing","principle":"Exchange of contracts is the point at which the transaction becomes legally binding on both parties; completion is when legal title actually transfers and money changes hands.","relatedCardId":"c033"},
  {"id":"cb242","type":"statute","name":"CON29","subject":"FLK2","topic":"Conveyancing","principle":"The Local Authority search (LLC1 for local land charges, CON29 for additional enquiries) reveals matters like planning history, building regulations, road proposals, and enforcement notices affecting the property.","relatedCardId":"c062"},
  {"id":"cb243","type":"concept","name":"customer due diligence","subject":"FLK2","topic":"Conveyancing","principle":"Under the Money Laundering Regulations, solicitors must carry out customer due diligence, including verifying client identity and, in higher-risk cases, considering the source of funds/wealth.","relatedCardId":"c105"},
  {"id":"cb244","type":"concept","name":"exchange of contracts","subject":"FLK2","topic":"Conveyancing","principle":"Exchange of contracts is the point at which the transaction becomes legally binding on both parties; completion is when legal title actually transfers and money changes hands.","relatedCardId":"c033"},
  {"id":"cb245","type":"concept","name":"Land Registry","subject":"FLK2","topic":"Conveyancing","principle":"Post-completion, the buyer's solicitor must pay any SDLT/LTT due and submit the application to register the buyer's title (and any mortgage) at the Land Registry, generally within the priority period conferred by the pre-completion search.","relatedCardId":"c084"},
  {"id":"cb246","type":"statute","name":"LLC1","subject":"FLK2","topic":"Conveyancing","principle":"The Local Authority search (LLC1 for local land charges, CON29 for additional enquiries) reveals matters like planning history, building regulations, road proposals, and enforcement notices affecting the property.","relatedCardId":"c062"},
  {"id":"cb247","type":"concept","name":"local land charges","subject":"FLK2","topic":"Conveyancing","principle":"The buyer's solicitor should raise enquiries about undisclosed matters revealed by searches before advising the client whether/how to proceed — caveat emptor is mitigated by disclosure obligations and standard conveyancing practice.","relatedCardId":"c034"},
  {"id":"cb248","type":"concept","name":"local searches","subject":"FLK2","topic":"Conveyancing","principle":"The Local Authority search (LLC1 for local land charges, CON29 for additional enquiries) reveals matters like planning history, building regulations, road proposals, and enforcement notices affecting the property.","relatedCardId":"c062"},
  {"id":"cb249","type":"statute","name":"Money Laundering Regulations","subject":"FLK2","topic":"Conveyancing","principle":"Under the Money Laundering Regulations, solicitors must carry out customer due diligence, including verifying client identity and, in higher-risk cases, considering the source of funds/wealth.","relatedCardId":"c105"},
  {"id":"cb250","type":"concept","name":"new-build warranty","subject":"FLK2","topic":"Conveyancing","principle":"New-build warranties (e.g. NHBC) provide the buyer (and successors) with protection against specified structural defects for a set period, which the buyer's solicitor should check is in place and properly assigned/available.","relatedCardId":"c125"},
  {"id":"cb251","type":"concept","name":"NHBC","subject":"FLK2","topic":"Conveyancing","principle":"New-build warranties (e.g. NHBC) provide the buyer (and successors) with protection against specified structural defects for a set period, which the buyer's solicitor should check is in place and properly assigned/available.","relatedCardId":"c125"},
  {"id":"cb252","type":"statute","name":"OS1 search","subject":"FLK2","topic":"Conveyancing","principle":"An OS1 search reveals any changes to the register since the official copies were obtained and gives the applicant a priority period during which their subsequent registration application takes priority over most later entries.","relatedCardId":"c085"},
  {"id":"cb253","type":"concept","name":"post-completion","subject":"FLK2","topic":"Conveyancing","principle":"Post-completion, the buyer's solicitor must pay any SDLT/LTT due and submit the application to register the buyer's title (and any mortgage) at the Land Registry, generally within the priority period conferred by the pre-completion search.","relatedCardId":"c084"},
  {"id":"cb254","type":"concept","name":"pre-contract enquiries","subject":"FLK2","topic":"Conveyancing","principle":"The buyer's solicitor should raise enquiries about undisclosed matters revealed by searches before advising the client whether/how to proceed — caveat emptor is mitigated by disclosure obligations and standard conveyancing practice.","relatedCardId":"c034"},
  {"id":"cb255","type":"concept","name":"priority period","subject":"FLK2","topic":"Conveyancing","principle":"An OS1 search reveals any changes to the register since the official copies were obtained and gives the applicant a priority period during which their subsequent registration application takes priority over most later entries.","relatedCardId":"c085"},
  {"id":"cb256","type":"concept","name":"SDLT","subject":"FLK2","topic":"Conveyancing","principle":"Post-completion, the buyer's solicitor must pay any SDLT/LTT due and submit the application to register the buyer's title (and any mortgage) at the Land Registry, generally within the priority period conferred by the pre-completion search.","relatedCardId":"c084"},
  {"id":"cb257","type":"statute","name":"s.40 CA 2006","subject":"FLK2","topic":"Corporate Governance","principle":"S.40 CA 2006 protects third parties dealing with a company in good faith by deeming the board's power to bind the company free from constitutional limitations, even where internal governance requirements were not followed.","relatedCardId":"c122"},
  {"id":"cb258","type":"concept","name":"third party protection","subject":"FLK2","topic":"Corporate Governance","principle":"S.40 CA 2006 protects third parties dealing with a company in good faith by deeming the board's power to bind the company free from constitutional limitations, even where internal governance requirements were not followed.","relatedCardId":"c122"},
  {"id":"cb259","type":"concept","name":"Conditional Fee Agreement","subject":"FLK2","topic":"Costs & Funding","principle":"Under a CFA, a success fee is a percentage uplift on normal fees, payable only if the case is won, compensating the solicitor for the risk of acting on a no-win-no-fee basis; caps apply in certain proceedings (e.g. personal injury under LASPO reforms).","relatedCardId":"c130"},
  {"id":"cb260","type":"concept","name":"success fee","subject":"FLK2","topic":"Costs & Funding","principle":"Under a CFA, a success fee is a percentage uplift on normal fees, payable only if the case is won, compensating the solicitor for the risk of acting on a no-win-no-fee basis; caps apply in certain proceedings (e.g. personal injury under LASPO reforms).","relatedCardId":"c130"},
  {"id":"cb261","type":"statute","name":"CPR Part 31","subject":"FLK2","topic":"Disclosure","principle":"CPR Part 31 standard disclosure requires disclosure of documents on which a party relies, and documents which adversely affect their own or another party's case, or support another party's case — not merely favourable documents.","relatedCardId":"c123"},
  {"id":"cb262","type":"concept","name":"standard disclosure","subject":"FLK2","topic":"Disclosure","principle":"CPR Part 31 standard disclosure requires disclosure of documents on which a party relies, and documents which adversely affect their own or another party's case, or support another party's case — not merely favourable documents.","relatedCardId":"c123"},
  {"id":"cb263","type":"statute","name":"s.27 Trustee Act 1925","subject":"FLK2","topic":"Estate Administration","principle":"S.27 Trustee Act 1925 allows personal representatives (and trustees) to advertise for claims (Gazette and appropriate newspaper) and, after the notice period expires, distribute the estate without personal liability for claims they didn't know about.","relatedCardId":"c128"},
  {"id":"cb264","type":"concept","name":"statutory notices","subject":"FLK2","topic":"Estate Administration","principle":"S.27 Trustee Act 1925 allows personal representatives (and trustees) to advertise for claims (Gazette and appropriate newspaper) and, after the notice period expires, distribute the estate without personal liability for claims they didn't know about.","relatedCardId":"c128"},
  {"id":"cb265","type":"concept","name":"balance of probabilities","subject":"FLK2","topic":"Evidence & Trial","principle":"The civil standard of proof is the balance of probabilities, i.e. that a fact is more likely than not to be true — a lower threshold than the criminal standard of beyond reasonable doubt.","relatedCardId":"c082"},
  {"id":"cb266","type":"concept","name":"Burden of proof in civil claims","subject":"FLK2","topic":"Evidence & Trial","principle":"Generally, the party asserting a fact (usually the claimant) bears the legal burden of proving it, though this can shift for particular issues, including under statutes that expressly reverse the burden (e.g. s.2(1) Misrepresentation Act 1967)."},
  {"id":"cb267","type":"statute","name":"Civil Evidence Act 1995","subject":"FLK2","topic":"Evidence & Trial","principle":"Unlike in criminal proceedings, hearsay evidence is generally admissible in civil trials under this Act, subject to notice requirements and the court's assessment of what weight to give it."},
  {"id":"cb268","type":"statute","name":"CPR Part 35 — expert evidence","subject":"FLK2","topic":"Evidence & Trial","principle":"Expert evidence in civil proceedings must be restricted to what is reasonably required to resolve the case, and an expert's overriding duty is to help the court, not the party instructing them."},
  {"id":"cb269","type":"concept","name":"standard of proof","subject":"FLK2","topic":"Evidence & Trial","principle":"The civil standard of proof is the balance of probabilities, i.e. that a fact is more likely than not to be true — a lower threshold than the criminal standard of beyond reasonable doubt.","relatedCardId":"c082"},
  {"id":"cb270","type":"concept","name":"7-year rule","subject":"FLK2","topic":"Inheritance Tax","principle":"A potentially exempt transfer becomes fully exempt from IHT if the donor survives seven years from the date of the gift; surviving just over 7 years takes it outside the charge.","relatedCardId":"c087"},
  {"id":"cb271","type":"concept","name":"Inheritance Tax","subject":"FLK2","topic":"Inheritance Tax","principle":"Transfers between UK-domiciled spouses/civil partners are generally fully exempt from Inheritance Tax, regardless of the value transferred, under the spouse exemption.","relatedCardId":"c086"},
  {"id":"cb272","type":"concept","name":"potentially exempt transfer","subject":"FLK2","topic":"Inheritance Tax","principle":"A potentially exempt transfer becomes fully exempt from IHT if the donor survives seven years from the date of the gift; surviving just over 7 years takes it outside the charge.","relatedCardId":"c087"},
  {"id":"cb273","type":"concept","name":"spouse exemption","subject":"FLK2","topic":"Inheritance Tax","principle":"Transfers between UK-domiciled spouses/civil partners are generally fully exempt from Inheritance Tax, regardless of the value transferred, under the spouse exemption.","relatedCardId":"c086"},
  {"id":"cb274","type":"statute","name":"Insolvency Act 1986","subject":"FLK2","topic":"Insolvency","principle":"S.123 Insolvency Act 1986 sets out several tests for inability to pay debts, including failure to satisfy a statutory demand (for a qualifying debt exceeding the prescribed minimum) within 21 days.","relatedCardId":"c059"},
  {"id":"cb275","type":"concept","name":"statutory demand","subject":"FLK2","topic":"Insolvency","principle":"S.123 Insolvency Act 1986 sets out several tests for inability to pay debts, including failure to satisfy a statutory demand (for a qualifying debt exceeding the prescribed minimum) within 21 days.","relatedCardId":"c059"},
  {"id":"cb276","type":"statute","name":"CPR Part 24","subject":"FLK2","topic":"Interim Applications","principle":"CPR Part 24 allows a party to apply for summary judgment where the other side has no real prospect of success on the claim/defence and there is no other compelling reason for the case to go to trial.","relatedCardId":"c103"},
  {"id":"cb277","type":"concept","name":"freezing injunction","subject":"FLK2","topic":"Interim Applications","principle":"A freezing injunction (historically 'Mareva injunction') restrains a defendant from dissipating or dealing with assets in a way that would frustrate a future judgment.","relatedCardId":"c102"},
  {"id":"cb278","type":"concept","name":"interim remedies","subject":"FLK2","topic":"Interim Applications","principle":"A freezing injunction (historically 'Mareva injunction') restrains a defendant from dissipating or dealing with assets in a way that would frustrate a future judgment.","relatedCardId":"c102"},
  {"id":"cb279","type":"concept","name":"summary judgment","subject":"FLK2","topic":"Interim Applications","principle":"CPR Part 24 allows a party to apply for summary judgment where the other side has no real prospect of success on the claim/defence and there is no other compelling reason for the case to go to trial.","relatedCardId":"c103"},
  {"id":"cb280","type":"concept","name":"commercial leases","subject":"FLK2","topic":"Landlord & Tenant (Commercial)","principle":"Courts have held that a covenant to 'keep in repair' can, on ordinary wording, oblige a tenant to first put premises into repair, not merely to maintain them 'as found', absent express limiting wording.","relatedCardId":"c126"},
  {"id":"cb281","type":"statute","name":"Landlord and Tenant Act 1954","subject":"FLK2","topic":"Landlord & Tenant (Commercial)","principle":"Part II of the Landlord and Tenant Act 1954 gives qualifying business tenants a statutory right to security of tenure and to apply for a new tenancy, subject to specified landlord grounds of opposition.","relatedCardId":"c063"},
  {"id":"cb282","type":"concept","name":"repairing covenants","subject":"FLK2","topic":"Landlord & Tenant (Commercial)","principle":"Courts have held that a covenant to 'keep in repair' can, on ordinary wording, oblige a tenant to first put premises into repair, not merely to maintain them 'as found', absent express limiting wording.","relatedCardId":"c126"},
  {"id":"cb283","type":"concept","name":"security of tenure","subject":"FLK2","topic":"Landlord & Tenant (Commercial)","principle":"Part II of the Landlord and Tenant Act 1954 gives qualifying business tenants a statutory right to security of tenure and to apply for a new tenancy, subject to specified landlord grounds of opposition.","relatedCardId":"c063"},
  {"id":"cb284","type":"concept","name":"lease extension","subject":"FLK2","topic":"Leasehold Enfranchisement & Residential","principle":"Qualifying long leaseholders of flats have a statutory right to a lease extension under leasehold enfranchisement legislation, historically the 1993 Act (as amended by more recent reforms).","relatedCardId":"c104"},
  {"id":"cb285","type":"concept","name":"leasehold enfranchisement","subject":"FLK2","topic":"Leasehold Enfranchisement & Residential","principle":"Qualifying long leaseholders of flats have a statutory right to a lease extension under leasehold enfranchisement legislation, historically the 1993 Act (as amended by more recent reforms).","relatedCardId":"c104"},
  {"id":"cb286","type":"concept","name":"Joint and several liability of partners","subject":"FLK2","topic":"Partnerships & LLPs","principle":"Under s.9 Partnership Act 1890, partners are jointly liable for the firm's contractual debts, and jointly and severally liable for torts/wrongful acts committed while they were a partner."},
  {"id":"cb287","type":"statute","name":"Limited Liability Partnerships Act 2000","subject":"FLK2","topic":"Partnerships & LLPs","principle":"An LLP is a body corporate with separate legal personality from its members, whose liability is generally limited to their agreed capital contribution — a key distinction from an ordinary partnership, where partners have unlimited personal liability."},
  {"id":"cb288","type":"statute","name":"Partnership Act 1890","subject":"FLK2","topic":"Partnerships & LLPs","principle":"Under s.1 Partnership Act 1890, a partnership arises automatically where two or more persons carry on business in common with a view of profit — no formal agreement or registration is required.","relatedCardId":"c058"},
  {"id":"cb289","type":"statute","name":"s.5 Partnership Act 1890","subject":"FLK2","topic":"Partnerships & LLPs","principle":"Every partner is an agent of the firm and their co-partners for the purpose of the partnership business, so acts done in the usual course of that business bind the firm, unless the partner had no authority and the third party knew this or did not know/believe them to be a partner."},
  {"id":"cb290","type":"statute","name":"CPR 1.1 — overriding objective","subject":"FLK2","topic":"Pre-Action & Track Allocation","principle":"Requires the court and parties to deal with cases justly and at proportionate cost, including ensuring parties are on an equal footing, saving expense, and handling cases in ways proportionate to the amount involved, importance and complexity."},
  {"id":"cb291","type":"concept","name":"fast track","subject":"FLK2","topic":"Pre-Action & Track Allocation","principle":"The fast track generally covers claims between £10,000 and £25,000 that are not overly complex and can be tried within one day, under CPR Part 26/28.","relatedCardId":"c060"},
  {"id":"cb292","type":"concept","name":"Multi-track","subject":"FLK2","topic":"Pre-Action & Track Allocation","principle":"The multi-track is generally used for claims exceeding the fast track's financial or complexity limits (broadly claims over £25,000, or lower-value claims that are unusually complex), with more bespoke case management by the court."},
  {"id":"cb293","type":"concept","name":"Pre-Action Protocols","subject":"FLK2","topic":"Pre-Action & Track Allocation","principle":"Before issuing proceedings, parties are generally expected to comply with the relevant pre-action protocol (or the Practice Direction on Pre-Action Conduct), including exchanging enough information to understand each other's case and attempting to settle without litigation; unreasonable non-compliance can carry costs consequences."},
  {"id":"cb294","type":"concept","name":"track allocation","subject":"FLK2","topic":"Pre-Action & Track Allocation","principle":"The fast track generally covers claims between £10,000 and £25,000 that are not overly complex and can be tried within one day, under CPR Part 26/28.","relatedCardId":"c060"},
  {"id":"cb295","type":"concept","name":"legal advice privilege","subject":"FLK2","topic":"Privilege","principle":"Legal advice privilege protects confidential communications between a solicitor and client made for the purpose of giving or seeking legal advice, regardless of whether litigation is in contemplation.","relatedCardId":"c124"},
  {"id":"cb296","type":"concept","name":"litigation privilege","subject":"FLK2","topic":"Privilege","principle":"Legal advice privilege protects confidential communications between a solicitor and client made for the purpose of giving or seeking legal advice, regardless of whether litigation is in contemplation.","relatedCardId":"c124"},
  {"id":"cb297","type":"concept","name":"client conflicts","subject":"FLK2","topic":"Professional Conduct","principle":"Under the SRA Code, solicitors must not act where there is a client conflict (or significant risk of one) unless a limited exception applies (e.g. substantially common interest or competing for the same objective) with informed consent — otherwise they must cease acting for one or both.","relatedCardId":"c109"},
  {"id":"cb298","type":"concept","name":"own-interest conflict","subject":"FLK2","topic":"Professional Conduct","principle":"The SRA Codes of Conduct prohibit acting where there is an own-interest conflict, or a significant risk of one — unlike some client conflicts, this generally cannot be cured by consent.","relatedCardId":"c088"},
  {"id":"cb299","type":"concept","name":"POCA 2002","subject":"FLK2","topic":"Professional Conduct","principle":"POCA 2002 requires regulated persons who know or suspect money laundering to submit a Suspicious Activity Report to the NCA, and prohibits 'tipping off' the client about the report.","relatedCardId":"c089"},
  {"id":"cb300","type":"concept","name":"reporting misconduct","subject":"FLK2","topic":"Professional Conduct","principle":"The SRA Principles require solicitors to act with integrity and uphold public trust in the profession; serious misconduct such as dishonest overbilling generally triggers reporting obligations to the firm and/or the SRA.","relatedCardId":"c108"},
  {"id":"cb301","type":"concept","name":"SRA Code of Conduct","subject":"FLK2","topic":"Professional Conduct","principle":"The SRA Codes of Conduct prohibit acting where there is an own-interest conflict, or a significant risk of one — unlike some client conflicts, this generally cannot be cured by consent.","relatedCardId":"c088"},
  {"id":"cb302","type":"concept","name":"SRA Principles","subject":"FLK2","topic":"Professional Conduct","principle":"The SRA Principles require solicitors to act with integrity and uphold public trust in the profession; serious misconduct such as dishonest overbilling generally triggers reporting obligations to the firm and/or the SRA.","relatedCardId":"c108"},
  {"id":"cb303","type":"concept","name":"Suspicious Activity Report","subject":"FLK2","topic":"Professional Conduct","principle":"POCA 2002 requires regulated persons who know or suspect money laundering to submit a Suspicious Activity Report to the NCA, and prohibits 'tipping off' the client about the report.","relatedCardId":"c089"},
  {"id":"cb304","type":"concept","name":"tipping off","subject":"FLK2","topic":"Professional Conduct","principle":"POCA 2002 requires regulated persons who know or suspect money laundering to submit a Suspicious Activity Report to the NCA, and prohibits 'tipping off' the client about the report.","relatedCardId":"c089"},
  {"id":"cb305","type":"concept","name":"Charging order","subject":"FLK2","topic":"Remedies & Enforcement","principle":"A method of enforcing a money judgment by securing the debt against the debtor's land or certain other assets, which can subsequently be enforced by an order for sale if the debt remains unpaid."},
  {"id":"cb306","type":"statute","name":"CPR Part 71","subject":"FLK2","topic":"Remedies & Enforcement","principle":"CPR Part 71 allows a judgment creditor to obtain an order requiring the judgment debtor to attend court and provide information about their means/assets, informing the choice of enforcement method.","relatedCardId":"c061"},
  {"id":"cb307","type":"concept","name":"enforcement of judgments","subject":"FLK2","topic":"Remedies & Enforcement","principle":"CPR Part 71 allows a judgment creditor to obtain an order requiring the judgment debtor to attend court and provide information about their means/assets, informing the choice of enforcement method.","relatedCardId":"c061"},
  {"id":"cb308","type":"concept","name":"Third party debt order","subject":"FLK2","topic":"Remedies & Enforcement","principle":"Allows a judgment creditor to obtain payment directly from a third party who owes money to the judgment debtor (e.g. the debtor's bank), by freezing and then ordering payment of that debt to the creditor."},
  {"id":"cb309","type":"concept","name":"Writ/warrant of control","subject":"FLK2","topic":"Remedies & Enforcement","principle":"An enforcement method allowing enforcement agents (bailiffs) to seize and sell a judgment debtor's goods to satisfy a County Court or High Court money judgment."},
  {"id":"cb310","type":"concept","name":"company security","subject":"FLK2","topic":"Share Capital & Financing","principle":"A floating charge covers a fluctuating class of assets (e.g. stock, receivables), leaving the company free to deal with them in the ordinary course of business until an event of crystallisation fixes the charge onto specific assets.","relatedCardId":"c101"},
  {"id":"cb311","type":"concept","name":"floating charge","subject":"FLK2","topic":"Share Capital & Financing","principle":"A floating charge covers a fluctuating class of assets (e.g. stock, receivables), leaving the company free to deal with them in the ordinary course of business until an event of crystallisation fixes the charge onto specific assets.","relatedCardId":"c101"},
  {"id":"cb312","type":"concept","name":"billing and transfers","subject":"FLK2","topic":"Solicitors Accounts","principle":"Under the SRA Accounts Rules, money can only move from client to office account once a bill (or other written notification of costs) has been delivered, and only up to the amount properly billed.","relatedCardId":"c067"},
  {"id":"cb313","type":"concept","name":"client money","subject":"FLK2","topic":"Solicitors Accounts","principle":"Money held on behalf of a client, including advance funds for costs/disbursements not yet incurred or billed, is client money and must be held in a client account under the SRA Accounts Rules.","relatedCardId":"c037"},
  {"id":"cb314","type":"concept","name":"mixed receipts","subject":"FLK2","topic":"Solicitors Accounts","principle":"Under the SRA Accounts Rules, where a receipt includes both client money and the firm's own money, the firm's own money must be identified and transferred out of the client account promptly, not left mixed in client account.","relatedCardId":"c129"},
  {"id":"cb315","type":"concept","name":"return of client money","subject":"FLK2","topic":"Solicitors Accounts","principle":"Under the SRA Accounts Rules, client money must be returned promptly to the client (or other entitled person) as soon as there is no longer a proper reason to hold it.","relatedCardId":"c066"},
  {"id":"cb316","type":"concept","name":"SRA Accounts Rules","subject":"FLK2","topic":"Solicitors Accounts","principle":"Money held on behalf of a client, including advance funds for costs/disbursements not yet incurred or billed, is client money and must be held in a client account under the SRA Accounts Rules.","relatedCardId":"c037"},
  {"id":"cb317","type":"case","name":"Barry v Butlin","subject":"FLK2","topic":"Wills & Intestacy","principle":"Where a beneficiary is involved in preparing a will, suspicious circumstances can require those propounding the will to affirmatively prove the testator knew and approved of its contents (Barry v Butlin and related authority), rather than relying on the usual presumption.","relatedCardId":"c127"},
  {"id":"cb318","type":"concept","name":"beneficiary witnessing","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.15 Wills Act 1837 provides that a gift to an attesting witness (or their spouse) is void, though the will remains valid provided it is otherwise properly executed (e.g. with a sufficient number of other independent witnesses).","relatedCardId":"c106"},
  {"id":"cb319","type":"concept","name":"execution of wills","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.9 Wills Act 1837 requires the testator's signature to be made or acknowledged in the presence of two witnesses present at the same time, who must then also attest and sign in the testator's presence.","relatedCardId":"c065"},
  {"id":"cb320","type":"concept","name":"grant of representation","subject":"FLK2","topic":"Wills & Intestacy","principle":"Where a valid will exists but no executor is appointed (or none can/will act), a person with an interest under the will — commonly a residuary beneficiary — can apply for a grant of letters of administration with the will annexed.","relatedCardId":"c035"},
  {"id":"cb321","type":"concept","name":"intestacy","subject":"FLK2","topic":"Wills & Intestacy","principle":"The statutory order of intestate succession includes grandparents as a category (after spouse, issue, parents, and siblings), before more remote relatives like aunts/uncles, with bona vacantia only applying if no qualifying relative exists.","relatedCardId":"c107"},
  {"id":"cb322","type":"concept","name":"intestacy rules","subject":"FLK2","topic":"Wills & Intestacy","principle":"Under the intestacy rules (as amended), where there is a spouse and children, the spouse receives personal chattels, a statutory legacy, and half of the remaining estate outright; the other half is shared among the children.","relatedCardId":"c036"},
  {"id":"cb323","type":"concept","name":"knowledge and approval","subject":"FLK2","topic":"Wills & Intestacy","principle":"Where a beneficiary is involved in preparing a will, suspicious circumstances can require those propounding the will to affirmatively prove the testator knew and approved of its contents (Barry v Butlin and related authority), rather than relying on the usual presumption.","relatedCardId":"c127"},
  {"id":"cb324","type":"concept","name":"letters of administration","subject":"FLK2","topic":"Wills & Intestacy","principle":"Where a valid will exists but no executor is appointed (or none can/will act), a person with an interest under the will — commonly a residuary beneficiary — can apply for a grant of letters of administration with the will annexed.","relatedCardId":"c035"},
  {"id":"cb325","type":"concept","name":"revocation by marriage","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.18 Wills Act 1837 provides that marriage generally revokes an earlier will automatically, unless the will was made in contemplation of that specific marriage and expressed not to be revoked by it.","relatedCardId":"c064"},
  {"id":"cb326","type":"statute","name":"s.15 Wills Act 1837","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.15 Wills Act 1837 provides that a gift to an attesting witness (or their spouse) is void, though the will remains valid provided it is otherwise properly executed (e.g. with a sufficient number of other independent witnesses).","relatedCardId":"c106"},
  {"id":"cb327","type":"statute","name":"s.18 Wills Act 1837","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.18 Wills Act 1837 provides that marriage generally revokes an earlier will automatically, unless the will was made in contemplation of that specific marriage and expressed not to be revoked by it.","relatedCardId":"c064"},
  {"id":"cb328","type":"statute","name":"s.9 Wills Act 1837","subject":"FLK2","topic":"Wills & Intestacy","principle":"S.9 Wills Act 1837 requires the testator's signature to be made or acknowledged in the presence of two witnesses present at the same time, who must then also attest and sign in the testator's presence.","relatedCardId":"c065"},
  {"id":"cb329","type":"concept","name":"statutory legacy","subject":"FLK2","topic":"Wills & Intestacy","principle":"Under the intestacy rules (as amended), where there is a spouse and children, the spouse receives personal chattels, a statutory legacy, and half of the remaining estate outright; the other half is shared among the children.","relatedCardId":"c036"},
  {"id":"cb330","type":"concept","name":"statutory order of succession","subject":"FLK2","topic":"Wills & Intestacy","principle":"The statutory order of intestate succession includes grandparents as a category (after spouse, issue, parents, and siblings), before more remote relatives like aunts/uncles, with bona vacantia only applying if no qualifying relative exists.","relatedCardId":"c107"},
  {"id":"cb331","type":"concept","name":"suspicious circumstances","subject":"FLK2","topic":"Wills & Intestacy","principle":"Where a beneficiary is involved in preparing a will, suspicious circumstances can require those propounding the will to affirmatively prove the testator knew and approved of its contents (Barry v Butlin and related authority), rather than relying on the usual presumption.","relatedCardId":"c127"},
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

// SQE modules (the actual subjects: Contract Law, Tort, Criminal Law, etc.),
// each mapping to the finer-grained topics used on individual cards.
const MODULES = {
  FLK1: {
    "Contract Law": ["Contract Formation", "Consideration", "Terms", "Misrepresentation", "Discharge & Remedies", "Vitiating Factors", "Privity of Contract", "Frustration"],
    "Tort": ["Negligence", "Occupiers' Liability", "Vicarious Liability", "Defences to Negligence", "Product Liability", "Nuisance", "Defamation", "Negligence — Economic Loss", "Employers' Liability", "Contributory Negligence", "Psychiatric Injury", "Damages"],
    "Criminal Law": ["Actus Reus & Mens Rea", "Homicide", "Defences", "Theft & Property Offences", "Inchoate Offences", "Non-Fatal Offences", "Criminal Damage", "Fraud", "Robbery", "Intoxication", "Sexual Offences"],
    "Land Law": ["Easements", "Leases", "Mortgages", "Co-ownership", "Registered Land", "Freehold Covenants", "Adverse Possession", "Proprietary Estoppel"],
    "Trusts": ["Trust Creation", "Resulting & Constructive Trusts", "Trustees' Duties", "Breach of Trust & Tracing", "Charitable Trusts"],
    "Constitutional & Administrative Law": ["Judicial Review", "Human Rights Act 1998", "Parliamentary Sovereignty"],
    "EU Law & Legal Systems": ["Sources of Law"],
  },
  FLK2: {
    "Business Law & Practice": ["Company Formation & Directors' Duties", "Corporate Governance", "Share Capital & Financing", "Partnerships & LLPs", "Insolvency"],
    "Dispute Resolution": ["Civil Procedure & Limitation", "Pre-Action & Track Allocation", "Remedies & Enforcement", "Interim Applications", "Evidence & Trial", "Disclosure", "Privilege", "Alternative Dispute Resolution", "Costs & Funding"],
    "Property Practice": ["Conveyancing", "Landlord & Tenant (Commercial)", "Leasehold Enfranchisement & Residential"],
    "Wills & Estate Admin": ["Wills & Intestacy", "Estate Administration", "Inheritance Tax"],
    "Solicitors Accounts": ["Solicitors Accounts"],
    "Professional Conduct": ["Professional Conduct"],
  },
};

// Derived lookups: topic -> module name, and module -> { subject, topics, count }.
// Built from MODULES + TOPIC_MAP so counts always stay in sync with SEED_CARDS.
const TOPIC_TO_MODULE = {};
const MODULE_INFO = {};
Object.entries(MODULES).forEach(([subj, mods]) => {
  Object.entries(mods).forEach(([moduleName, topics]) => {
    MODULE_INFO[moduleName] = {
      subject: subj,
      topics,
      count: topics.reduce((n, t) => n + (TOPIC_MAP[t]?.count || 0), 0),
    };
    topics.forEach(t => { TOPIC_TO_MODULE[t] = moduleName; });
  });
});

/* ---------------------------------------------------------
   Spaced repetition (light SM-2)
--------------------------------------------------------- */
function scheduleNext(prog, quality) {
  // quality: 0 = need review / got it wrong, 1 = know it / got it right.
  // Fed by both flashcard self-rating AND SBA quiz/mock answers now, so a
  // card's schedule reflects its full track record, not just the last flip.
  let { ease = 2.5, interval = 0, reps = 0, correctCount = 0, totalCount = 0 } = prog || {};
  totalCount += 1;
  if (quality === 1) correctCount += 1;
  const accuracy = totalCount ? correctCount / totalCount : 0;

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

    // Weight resurfacing by historical accuracy, not just the latest rating:
    // a card you've gotten right just now but have a shaky track record on
    // shouldn't jump straight to a long gap — scale the interval down until
    // accuracy climbs back above the threshold.
    if (accuracy < 0.6 && totalCount >= 2) {
      interval = Math.max(1, Math.round(interval * Math.max(0.3, accuracy)));
    }
  }
  const next = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ease, interval, reps, nextReview: next, lastSeen: Date.now(), quality, correctCount, totalCount, accuracy };
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

const MOCK_HISTORY_KEY = "sqe-mock-history-v1";
async function loadMockHistory() {
  try { const v = localStorage.getItem(MOCK_HISTORY_KEY); return v ? JSON.parse(v) : []; } catch { return []; }
}
async function saveMockHistory(list) {
  try { localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(list)); } catch {}
}

const ATTEMPT_LOG_KEY = "sqe-attempt-log-v1";
async function loadAttemptLog() {
  try { const v = localStorage.getItem(ATTEMPT_LOG_KEY); return v ? JSON.parse(v) : []; } catch { return []; }
}
async function saveAttemptLog(list) {
  try { localStorage.setItem(ATTEMPT_LOG_KEY, JSON.stringify(list)); } catch {}
}

const ONBOARD_KEY = "sqe-onboarding-v1";
const DEFAULT_ONBOARDING = { examDate: "", subjects: ["FLK1", "FLK2"], completed: false };
async function loadOnboarding() {
  try { const v = localStorage.getItem(ONBOARD_KEY); return v ? { ...DEFAULT_ONBOARDING, ...JSON.parse(v) } : { ...DEFAULT_ONBOARDING }; }
  catch { return { ...DEFAULT_ONBOARDING }; }
}
async function saveOnboarding(data) {
  try { localStorage.setItem(ONBOARD_KEY, JSON.stringify(data)); } catch {}
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

// Wrong-answer journal reason tags
const REASON_OPTIONS = [
  { key: "knowledge", label: "Knowledge gap" },
  { key: "misread", label: "Misread" },
  { key: "timing", label: "Timing pressure" },
  { key: "distractor", label: "Distractor trap" },
];
const REASON_LABELS = REASON_OPTIONS.reduce((acc, r) => { acc[r.key] = r.label; return acc; }, {});

function todayStr() { return new Date().toISOString().slice(0, 10); }

/* ---------------------------------------------------------
   Mock exam helpers
--------------------------------------------------------- */
// Real SQE1 pacing: ~10h12m across 360 questions ≈ 1 min 40 sec/question.
const PACE_SECONDS_PER_Q = 100;

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2.5 transition-colors relative ${active ? "text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-mid)]"}`}>
      {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--accent)]" />}
      <Icon size={20} strokeWidth={active ? 2.1 : 1.75} />
      <span className="text-[10px] tracking-wide font-medium">{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------
   Wrong-answer reason tagger — optional, shown after an
   incorrect/skipped SBA answer in practice or mock review
--------------------------------------------------------- */
function ReasonTagger({ attemptId, currentReason, onTag }) {
  if (!attemptId) return null;
  return (
    <div className="mt-3 pt-3 border-t border-[var(--border-soft)]">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mb-2">Why did you miss this? (optional)</p>
      <div className="flex flex-wrap gap-1.5">
        {REASON_OPTIONS.map(r => (
          <button key={r.key} onClick={() => onTag(attemptId, r.key)}
            className={`text-[11px] px-2.5 py-1 rounded-sm border font-medium transition-colors ${currentReason === r.key ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-mid)]"}`}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
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
function SbaQuiz({ cards, timed, onFinish, onLogAttempt, onTagReason, onRate }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [reasonPicked, setReasonPicked] = useState(null);
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
    const isCorrect = i === q.answer;
    if (isCorrect) setScore(s => s + 1);
    const id = `practice-${Date.now()}-${q.id}`;
    setAttemptId(id);
    setReasonPicked(null);
    onLogAttempt && onLogAttempt({
      id, questionId: q.id, topic: q.topic, subject: q.subject,
      module: TOPIC_TO_MODULE[q.topic], correct: isCorrect, skipped: false,
      source: "practice", timestamp: Date.now(), reason: null,
    });
    onRate && onRate(q.id, isCorrect ? 1 : 0);
  };

  const next = () => {
    if (idx < cards.length - 1) {
      setIdx(idx + 1); setSelected(null); setRevealed(false); setAttemptId(null); setReasonPicked(null);
    } else {
      clearInterval(timerRef.current);
      onFinish(score, cards.length, seconds);
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
                className={`text-left text-sm px-4 py-3 rounded-sm border transition-colors flex items-center justify-between gap-3 ${style}`}>
                <span>{opt}</span>
                {revealed && i === q.answer && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--know-text)] flex items-center justify-center">
                    <Check size={13} className="text-[var(--know-bg)]" strokeWidth={3} />
                  </span>
                )}
                {revealed && i === selected && i !== q.answer && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--review-text)] flex items-center justify-center">
                    <X size={13} className="text-[var(--review-bg)]" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs uppercase tracking-wide text-[var(--accent)] mb-1.5">Explanation</p>
            <p className="text-sm text-[var(--text-soft)] leading-relaxed">{q.explanation}</p>
            {selected !== q.answer && (
              <ReasonTagger attemptId={attemptId} currentReason={reasonPicked}
                onTag={(id, reason) => { setReasonPicked(reason); onTagReason && onTagReason(id, reason); }} />
            )}
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
   Mock Exam — realistic timed SQE1 session
   Setup (choose paper/length) -> Runner (single countdown,
   navigator, flag-for-review, no feedback until submit) ->
   Results (score, per-topic breakdown, full review)
--------------------------------------------------------- */
function MockSetup({ allSbaCards, onStart, defaultPaper }) {
  const [paper, setPaper] = useState(defaultPaper || "Mixed");
  const pool = useMemo(() => {
    if (paper === "Mixed") return allSbaCards;
    return allSbaCards.filter(c => c.subject === paper);
  }, [paper, allSbaCards]);

  const presets = useMemo(() => {
    const full = Math.min(90, pool.length);
    return [
      { label: "Quick drill", count: Math.min(20, pool.length) },
      { label: "Standard", count: Math.min(45, pool.length) },
      { label: "Full session", count: full },
    ].filter((p, i, arr) => p.count > 0 && arr.findIndex(x => x.count === p.count) === i);
  }, [pool]);

  const [count, setCount] = useState(presets[0]?.count || 0);
  useEffect(() => { setCount(presets[0]?.count || 0); }, [paper]); // eslint-disable-line react-hooks/exhaustive-deps

  const estMinutes = Math.round((count * PACE_SECONDS_PER_Q) / 60);

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5">
        <p className="font-serif text-lg text-[var(--text)] mb-1">Mock exam</p>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Real SQE1 pacing is about 1 min 40 sec per question. Once you start, there's no
          feedback or explanations until you submit — just like the real thing.
        </p>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">Paper</p>
        <div className="flex gap-2">
          {["FLK1", "FLK2", "Mixed"].map(p => (
            <button key={p} onClick={() => setPaper(p)}
              className={`flex-1 text-xs py-2 rounded-sm border font-medium transition-colors ${paper === p ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">Length</p>
        <div className="flex flex-col gap-2">
          {presets.map(p => (
            <button key={p.label} onClick={() => setCount(p.count)}
              className={`text-left text-sm px-3 py-2.5 rounded-sm border transition-colors flex items-center justify-between gap-2 ${count === p.count ? "border-[var(--accent)] bg-[var(--surface2)] text-[var(--text)]" : "border-[var(--border)] text-[var(--text-soft)]"}`}>
              <span>
                <span className="font-medium">{p.label}</span>
                <span className="text-[var(--text-dim)]">
                  {" "}— {p.count} question{p.count === 1 ? "" : "s"}
                  {p.label === "Full session" && p.count < 90 ? ` (bank has ${p.count} so far; SRA target is 90)` : ""}
                </span>
              </span>
              <span className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${count === p.count ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-mid)]"}`}>
                {count === p.count && <Check size={11} className="text-[var(--accent-ink)]" />}
              </span>
            </button>
          ))}
        </div>
        {pool.length === 0 && <p className="text-xs text-[var(--review-text)] mt-2">No SBA questions available for this selection yet.</p>}
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4 flex items-center justify-between">
        <span className="text-xs text-[var(--text-dim)] flex items-center gap-1.5"><TimerIcon size={13} /> Time budget</span>
        <span className="text-sm text-[var(--accent)] font-medium">{estMinutes} min</span>
      </div>

      <button
        disabled={count === 0}
        onClick={() => onStart(shuffleArray(pool).slice(0, count), count * PACE_SECONDS_PER_Q, paper)}
        className="w-full py-3.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40">
        Start mock exam
      </button>
    </div>
  );
}

function MockRunner({ questions, durationSec, onSubmit }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  const flagsRef = useRef(flags);
  answersRef.current = answers;
  flagsRef.current = flags;

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          if (!submittedRef.current) {
            submittedRef.current = true;
            onSubmit(answersRef.current, flagsRef.current, true, 0);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = questions[idx];
  const answeredCount = Object.keys(answers).length;
  const low = timeLeft < 300; // last 5 minutes

  const finish = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(answers, flags, false, timeLeft);
  };

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-3">
        <span>{answeredCount} / {questions.length} answered</span>
        <span className={`flex items-center gap-1 font-medium ${low ? "text-[var(--review-text)]" : "text-[var(--accent)]"}`}>
          <TimerIcon size={13} /> {formatDuration(timeLeft)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {questions.map((qq, i) => {
          const answered = answers[qq.id] !== undefined;
          const flagged = flags[qq.id];
          return (
            <button key={qq.id} onClick={() => setIdx(i)}
              className={`w-7 h-7 text-[10px] rounded-sm border flex items-center justify-center relative transition-colors
                ${i === idx ? "border-[var(--accent)] text-[var(--accent)]" :
                  answered ? "border-[var(--know-border)] bg-[var(--know-bg)] text-[var(--know-text)]" :
                  "border-[var(--border)] text-[var(--text-dim)]"}`}>
              {i + 1}
              {flagged && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--review-text)]" />}
            </button>
          );
        })}
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge>{q.topic}</Badge>
          <button onClick={() => setFlags(f => ({ ...f, [q.id]: !f[q.id] }))}
            className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm border transition-colors ${flags[q.id] ? "border-[var(--review-border)] text-[var(--review-text)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
            {flags[q.id] ? "Flagged" : "Flag for review"}
          </button>
        </div>
        <p className="font-serif text-base leading-snug text-[var(--text)] mb-4">{q.front}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
              className={`text-left text-sm px-4 py-3 rounded-sm border transition-colors flex items-center justify-between gap-3 ${
                answers[q.id] === i
                  ? "border-[var(--accent)] bg-[var(--surface2)] text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--nav)] text-[var(--text-soft)] hover:border-[var(--text-faint)]"}`}>
              <span>{opt}</span>
              <span className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${answers[q.id] === i ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-mid)]"}`}>
                {answers[q.id] === i && <Check size={11} className="text-[var(--accent-ink)]" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="flex-1 py-2.5 rounded-sm border border-[var(--border)] text-[var(--text-soft)] text-sm disabled:opacity-30 flex items-center justify-center gap-1">
          <ChevronLeft size={15} /> Previous
        </button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx(i => Math.min(questions.length - 1, i + 1))}
            className="flex-1 py-2.5 rounded-sm border border-[var(--border)] text-[var(--text-soft)] text-sm flex items-center justify-center gap-1">
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={finish}
            className="flex-1 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold">
            Submit
          </button>
        )}
      </div>
      <button onClick={finish} className="w-full mt-2 py-2 text-xs text-[var(--text-dim)] hover:text-[var(--review-text)] transition-colors">
        End mock early &amp; submit
      </button>
    </div>
  );
}

function MockResults({ questions, answers, durationSec, timeLeft, timeExpired, paper, mockId, onTagReason, onExit }) {
  const [reasonSelections, setReasonSelections] = useState({});
  const total = questions.length;
  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const timeUsed = durationSec - timeLeft;

  const perTopic = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      map[q.topic] = map[q.topic] || { correct: 0, total: 0 };
      map[q.topic].total++;
      if (answers[q.id] === q.answer) map[q.topic].correct++;
    });
    return Object.entries(map).sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total));
  }, [questions, answers]);

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5 text-center">
        {timeExpired && <p className="text-[10px] uppercase tracking-wide text-[var(--review-text)] mb-2">Time expired — auto-submitted</p>}
        <p className="font-serif text-3xl text-[var(--accent)] mb-1">{correct} / {total}</p>
        <p className="text-sm text-[var(--text-mid)]">{pct}% correct · {paper} · {formatDuration(timeUsed)} used</p>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">By topic</p>
        <div className="flex flex-col gap-2">
          {perTopic.map(([topic, s]) => {
            const p = Math.round((s.correct / s.total) * 100);
            return (
              <div key={topic}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--text-soft)]">{topic}</span>
                  <span className="text-[var(--text-dim)]">{s.correct}/{s.total}</span>
                </div>
                <div className="h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
                  <div className={`h-full ${p >= 70 ? "bg-[var(--know-text)]" : p >= 40 ? "bg-[var(--accent)]" : "bg-[var(--review-text)]"}`} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] px-1">Question review</p>
        {questions.map((q, i) => {
          const yourIdx = answers[q.id];
          const isCorrect = yourIdx === q.answer;
          const unanswered = yourIdx === undefined;
          return (
            <div key={q.id} className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge tone={isCorrect ? "know" : "review"}>{isCorrect ? "Correct" : unanswered ? "Skipped" : "Incorrect"}</Badge>
                <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">{i + 1}. {q.topic}</span>
              </div>
              <p className="text-sm text-[var(--text)] mb-2">{q.front}</p>
              <p className="text-xs text-[var(--text-mid)]">Your answer: {unanswered ? "—" : q.options[yourIdx]}</p>
              {!isCorrect && <p className="text-xs text-[var(--know-text)] mt-1">Correct: {q.options[q.answer]}</p>}
              <p className="text-xs text-[var(--text-soft)] leading-relaxed mt-2 pt-2 border-t border-[var(--border-soft)]">{q.explanation}</p>
              {!isCorrect && (
                <ReasonTagger attemptId={`${mockId}-${q.id}`} currentReason={reasonSelections[q.id]}
                  onTag={(id, reason) => {
                    setReasonSelections(s => ({ ...s, [q.id]: reason }));
                    onTagReason && onTagReason(id, reason);
                  }} />
              )}
            </div>
          );
        })}
      </div>

      <button onClick={onExit} className="w-full py-3 rounded-sm border border-[var(--accent)] text-[var(--accent)] text-sm font-semibold">
        Back to mock setup
      </button>
    </div>
  );
}

function MockExam({ allSbaCards, onComplete, onLogAttempts, onTagReason, onRate, defaultPaper }) {
  const [phase, setPhase] = useState("setup"); // setup | running | results
  const [session, setSession] = useState(null); // { questions, durationSec, paper, mockId }
  const [outcome, setOutcome] = useState(null); // { answers, flags, timeExpired, timeLeft }

  const start = (questions, durationSec, paper) => {
    setSession({ questions, durationSec, paper, mockId: `mock-${Date.now()}` });
    setPhase("running");
  };

  const submit = (answers, flags, timeExpired, timeLeft) => {
    const { questions, mockId, paper, durationSec } = session;
    const correct = questions.filter(q => answers[q.id] === q.answer).length;
    setOutcome({ answers, flags, timeExpired, timeLeft });

    const now = Date.now();
    const records = questions.map(q => ({
      id: `${mockId}-${q.id}`,
      questionId: q.id,
      topic: q.topic,
      subject: q.subject,
      module: TOPIC_TO_MODULE[q.topic],
      correct: answers[q.id] === q.answer,
      skipped: answers[q.id] === undefined,
      source: "mock",
      timestamp: now,
      reason: null,
    }));
    onLogAttempts && onLogAttempts(records);
    // Feed every mock answer into the same spaced-repetition scheduler as
    // flashcards and practice SBAs — an unanswered (skipped) question is
    // treated as a miss, same as getting it wrong.
    if (onRate) {
      questions.forEach(q => onRate(q.id, answers[q.id] === q.answer ? 1 : 0));
    }

    onComplete({
      id: mockId,
      date: new Date().toISOString(),
      paper,
      total: questions.length,
      correct,
      durationSec,
      timeExpired,
    });
    setPhase("results");
  };

  const reset = () => { setPhase("setup"); setSession(null); setOutcome(null); };

  if (phase === "setup") return <MockSetup allSbaCards={allSbaCards} onStart={start} defaultPaper={defaultPaper} />;
  if (phase === "running") return <MockRunner questions={session.questions} durationSec={session.durationSec} onSubmit={submit} />;
  return (
    <MockResults
      questions={session.questions}
      answers={outcome.answers}
      durationSec={session.durationSec}
      timeLeft={outcome.timeLeft}
      timeExpired={outcome.timeExpired}
      paper={session.paper}
      mockId={session.mockId}
      onTagReason={onTagReason}
      onExit={reset}
    />
  );
}

/* ---------------------------------------------------------
   Module filter — pick a subject (Contract Law, Tort, etc.) to review
--------------------------------------------------------- */
function ModuleFilter({ module, setModule }) {
  return (
    <div className="max-w-lg mx-auto px-4 mb-4">
      <button onClick={() => setModule(null)}
        className={`text-[11px] px-2.5 py-1 rounded-sm border font-medium transition-colors mb-2 ${!module ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-mid)]"}`}>
        All subjects
      </button>
      {Object.entries(MODULES).map(([subj, mods]) => (
        <div key={subj} className="mb-2 last:mb-0">
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)] mb-1">{subj}</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(mods).map(name => {
              const active = module === name;
              return (
                <button key={name} onClick={() => setModule(name)}
                  className={`text-[11px] px-2.5 py-1 rounded-sm border font-medium transition-colors ${active ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-mid)]"}`}>
                  {name} · {MODULE_INFO[name].count}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Search view — cases, statutes, and concepts only
--------------------------------------------------------- */
/* ---------------------------------------------------------
   Casebook — every case, statute, and concept in CASEBOOK,
   browsable by subject/module/topic or searched directly.
--------------------------------------------------------- */
const CASEBOOK_TYPE_LABELS = { case: "Case", statute: "Statute", concept: "Concept" };

function CasebookTypeBadge({ type }) {
  const toneMap = { case: "review", statute: "know", concept: "default" };
  return <Badge tone={toneMap[type] || "default"}>{CASEBOOK_TYPE_LABELS[type] || type}</Badge>;
}

function CasebookView({ query, setQuery }) {
  const [typeFilter, setTypeFilter] = useState("all"); // all | case | statute | concept

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CASEBOOK.filter(e => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      return (
        e.name.toLowerCase().includes(q) ||
        e.principle.toLowerCase().includes(q) ||
        e.topic.toLowerCase().includes(q)
      );
    });
  }, [query, typeFilter]);

  const showingList = query.trim().length > 0;

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search a case, statute, or concept…"
            autoFocus
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm pl-9 pr-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "case", "statute", "concept"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-[11px] px-2.5 py-1 rounded-sm border font-medium transition-colors ${typeFilter === t ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
              {t === "all" ? "All" : CASEBOOK_TYPE_LABELS[t] + "s"}
            </button>
          ))}
        </div>
      </div>

      {!showingList && (
        <div className="flex flex-col items-center text-center gap-2 py-14">
          <Search size={22} className="text-[var(--text-faint)] mb-1" />
          <p className="text-sm text-[var(--text-soft)]">Search the casebook</p>
          <p className="text-xs text-[var(--text-dim)] max-w-[240px]">
            {CASEBOOK.length} cases, statutes &amp; concepts across every SQE1 topic. Start typing to find one.
          </p>
        </div>
      )}

      {showingList && filtered.length === 0 && (
        <p className="text-sm text-[var(--text-dim)] text-center py-8">No matches. Try a different case, statute, or concept.</p>
      )}

      <div className="flex flex-col gap-3">
        {showingList && filtered.map(e => (
          <div key={e.id} className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <CasebookTypeBadge type={e.type} />
              <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">{e.subject} · {e.topic}</span>
            </div>
            <p className={`text-sm font-medium text-[var(--text)] mb-1 ${e.type === "case" ? "italic" : ""}`}>{e.name}</p>
            <p className="text-xs text-[var(--text-mid)] leading-relaxed">{e.principle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Insights — per-topic accuracy, syllabus coverage heatmap,
   and a wrong-answer journal with reason tagging. Draws on
   the shared attempt log fed by both practice SBA and mocks.
--------------------------------------------------------- */
function tierColor(pct) {
  if (pct >= 70) return "bg-[var(--know-text)]";
  if (pct >= 40) return "bg-[var(--accent)]";
  return "bg-[var(--review-text)]";
}
function tierTextColor(pct) {
  if (pct >= 70) return "text-[var(--know-text)]";
  if (pct >= 40) return "text-[var(--accent)]";
  return "text-[var(--review-text)]";
}

function InsightsView({ attemptLog, onSelectModule }) {
  const topicStats = useMemo(() => {
    const map = {};
    attemptLog.forEach(a => {
      map[a.topic] = map[a.topic] || { attempts: 0, correct: 0 };
      map[a.topic].attempts++;
      if (a.correct) map[a.topic].correct++;
    });
    return map;
  }, [attemptLog]);

  const totalAttempts = attemptLog.length;
  const totalCorrect = attemptLog.filter(a => a.correct).length;
  const overallPct = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const topicsAttempted = Object.keys(topicStats).length;
  const totalTopics = Object.keys(TOPIC_MAP).length;

  const weakestTopics = useMemo(() => {
    return Object.entries(topicStats)
      .filter(([, s]) => s.attempts >= 2)
      .map(([topic, s]) => ({ topic, ...s, pct: Math.round((s.correct / s.attempts) * 100) }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5);
  }, [topicStats]);

  const journal = useMemo(() => {
    return attemptLog.filter(a => !a.correct).sort((a, b) => b.timestamp - a.timestamp).slice(0, 40);
  }, [attemptLog]);

  const reasonCounts = useMemo(() => {
    const counts = { untagged: 0 };
    REASON_OPTIONS.forEach(r => { counts[r.key] = 0; });
    attemptLog.filter(a => !a.correct).forEach(a => {
      if (a.reason && counts[a.reason] !== undefined) counts[a.reason]++;
      else counts.untagged++;
    });
    return counts;
  }, [attemptLog]);

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5">
        <p className="font-serif text-lg text-[var(--text)] mb-1">Insights</p>
        <p className="text-xs text-[var(--text-mid)] leading-relaxed">
          Drawn from every SBA question you've answered in practice and mock mode.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className="text-xl font-serif text-[var(--text)]">{totalAttempts}</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Answered</p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className={`text-xl font-serif ${tierTextColor(overallPct)}`}>{overallPct}%</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Accuracy</p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 text-center">
          <p className="text-xl font-serif text-[var(--text)]">{topicsAttempted}/{totalTopics}</p>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-dim)] mt-1">Topics touched</p>
        </div>
      </div>

      {weakestTopics.length > 0 && (
        <div className="border border-[var(--review-border)] bg-[var(--review-bg)] rounded-sm p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--review-text)] mb-3">Focus areas</p>
          <div className="flex flex-col gap-2">
            {weakestTopics.map(t => (
              <div key={t.topic} className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-soft)]">{t.topic}</span>
                <span className="text-[var(--review-text)] font-medium">{t.pct}% ({t.correct}/{t.attempts})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">Syllabus coverage</p>
        {Object.entries(MODULES).map(([subj, mods]) => (
          <div key={subj} className="mb-4 last:mb-0">
            <p className="text-[11px] font-semibold text-[var(--accent)] mb-2">{subj}</p>
            <div className="flex flex-col gap-2">
              {Object.entries(mods).map(([moduleName, topics]) => {
                const modAttempts = topics.reduce((n, t) => n + (topicStats[t]?.attempts || 0), 0);
                const modCorrect = topics.reduce((n, t) => n + (topicStats[t]?.correct || 0), 0);
                const modPct = modAttempts ? Math.round((modCorrect / modAttempts) * 100) : null;
                return (
                  <button key={moduleName} onClick={() => onSelectModule && onSelectModule(moduleName)} className="text-left">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[var(--text-soft)]">{moduleName}</span>
                      <span className={modPct === null ? "text-[var(--text-faint)]" : tierTextColor(modPct)}>
                        {modPct === null ? "Not started" : `${modPct}% (${modCorrect}/${modAttempts})`}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {topics.map(t => {
                        const s = topicStats[t];
                        const p = s && s.attempts ? Math.round((s.correct / s.attempts) * 100) : null;
                        return (
                          <div key={t} title={`${t}${s ? `: ${s.correct}/${s.attempts}` : ": not attempted"}`}
                            className={`h-2.5 flex-1 rounded-sm ${p === null ? "bg-[var(--border-soft)]" : tierColor(p)}`} />
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">Wrong-answer journal</p>
        {journal.length === 0 ? (
          <p className="text-xs text-[var(--text-dim)]">No missed questions logged yet — they'll show up here as you practice.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {REASON_OPTIONS.map(r => (
                <span key={r.key} className="text-[10px] px-2 py-1 rounded-sm border border-[var(--border)] text-[var(--text-dim)]">
                  {r.label}: {reasonCounts[r.key]}
                </span>
              ))}
              <span className="text-[10px] px-2 py-1 rounded-sm border border-[var(--border)] text-[var(--text-dim)]">
                Untagged: {reasonCounts.untagged}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {journal.map(a => (
                <div key={a.id} className="flex items-center justify-between text-xs border-b border-[var(--border-soft)] pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-[var(--text-soft)]">{a.topic}</span>
                    <span className="text-[10px] text-[var(--text-faint)]">
                      {a.source === "mock" ? "Mock exam" : "Practice"} · {new Date(a.timestamp).toLocaleDateString()}
                      {a.skipped ? " · skipped" : ""}
                    </span>
                  </div>
                  <Badge tone={a.reason ? "default" : "review"}>{a.reason ? REASON_LABELS[a.reason] : "Untagged"}</Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard
--------------------------------------------------------- */
function Dashboard({ progress, streak, goal, setGoal, dueCount, totalCards, onGo, onSelectModule, mockHistory, attemptLog, examDate }) {
  const knownCount = Object.values(progress).filter(p => p.quality === 1).length;
  const reviewCount = Object.values(progress).filter(p => p.quality === 0).length;
  const pct = totalCards ? Math.round((knownCount / totalCards) * 100) : 0;
  const goalPct = Math.min(100, Math.round((streak.todayDone / goal) * 100));
  const examDays = daysUntil(examDate);

  return (
    <div className="px-4 max-w-lg mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] bg-gradient-to-br from-[var(--surface2)] to-[var(--nav)] rounded-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)]">SQE Revision</p>
          <div className="flex items-center gap-1 text-[var(--accent)]"><Flame size={14} /><span className="text-sm font-semibold">{streak.count}</span></div>
        </div>
        <p className="font-serif text-2xl text-[var(--text)]">Welcome back, Tai.</p>
        <p className="text-sm text-[var(--text-mid)] mt-1">{dueCount} card{dueCount === 1 ? "" : "s"} due for review today.</p>
        {examDays !== null && (
          <p className="text-xs text-[var(--accent)] mt-2 font-medium">
            {examDays > 0 ? `${examDays} day${examDays === 1 ? "" : "s"} until your exam` : examDays === 0 ? "Exam day is today" : "Exam date has passed"}
          </p>
        )}
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
              className={`text-xs px-2.5 py-1 rounded-sm border font-medium transition-colors ${goal === n ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
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

      <button onClick={() => onGo("mock")}
        className="w-full py-3.5 rounded-sm border border-[var(--accent)] text-[var(--accent)] text-sm font-semibold hover:bg-[var(--surface2)] transition-colors flex items-center justify-center gap-2">
        <TimerIcon size={16} /> Take a mock exam
      </button>

      {mockHistory && mockHistory.length > 0 && (
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">Recent mocks</p>
          <div className="flex flex-col gap-2">
            {mockHistory.slice(0, 3).map(m => {
              const p = Math.round((m.correct / m.total) * 100);
              return (
                <div key={m.id} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-soft)]">{m.paper} · {new Date(m.date).toLocaleDateString()}</span>
                  <span className={p >= 60 ? "text-[var(--know-text)]" : "text-[var(--review-text)]"}>{m.correct}/{m.total} ({p}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {attemptLog && attemptLog.length > 0 && (() => {
        const correctCount = attemptLog.filter(a => a.correct).length;
        const pct = Math.round((correctCount / attemptLog.length) * 100);
        return (
          <button onClick={() => onGo("insights")}
            className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4 text-left hover:border-[var(--accent)] transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] flex items-center gap-1.5"><TrendingUp size={13} /> Insights</p>
              <span className={pct >= 70 ? "text-[var(--know-text)]" : pct >= 40 ? "text-[var(--accent)]" : "text-[var(--review-text)]"}>{pct}% overall</span>
            </div>
            <p className="text-xs text-[var(--text-mid)] mt-1">{attemptLog.length} questions logged · see weak topics &amp; wrong-answer journal →</p>
          </button>
        );
      })()}

      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3">Select a subject to review</p>
        {Object.entries(MODULES).map(([code, mods]) => (
          <div key={code} className="mb-3 last:mb-0">
            <p className="text-[11px] font-semibold text-[var(--accent)] mb-1.5">{code}</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(mods).map(name => (
                <button key={name} onClick={() => onSelectModule(name)}
                  className="text-[10px] px-2 py-1 rounded-sm border border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  {name} · {MODULE_INFO[name].count}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[11px] text-[var(--text-dim)] mt-3 leading-relaxed">{SEED_CARDS.length} cards across {Object.keys(MODULE_INFO).length} subjects. Tap a subject to jump into a focused review session.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Onboarding — first-run setup (exam date, FLK1/FLK2 scope,
   daily goal) so the app opens personalized instead of empty.
   Reused as an inline editor from the More tab ("Edit plan").
--------------------------------------------------------- */
function OnboardingFlow({ initial, onComplete, editing, onCancel }) {
  const [examDate, setExamDate] = useState(initial.examDate || "");
  const [subjects, setSubjects] = useState(initial.subjects && initial.subjects.length ? initial.subjects : ["FLK1", "FLK2"]);
  const [dailyGoal, setDailyGoal] = useState(initial.goal || 20);

  const toggleSubject = (s) => {
    setSubjects(prev => {
      if (prev.includes(s)) {
        if (prev.length === 1) return prev; // keep at least one selected
        return prev.filter(x => x !== s);
      }
      return [...prev, s];
    });
  };

  const submit = () => {
    onComplete({ examDate, subjects, goal: dailyGoal });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        {!editing && (
          <div className="text-center mb-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] mb-2">sqe.tairevision.com</p>
            <p className="font-serif text-2xl text-[var(--text)]">Let's set up your revision plan</p>
            <p className="text-sm text-[var(--text-mid)] mt-2 leading-relaxed">Three quick picks — this personalizes your pacing, streak, and mock exam defaults.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2 flex items-center gap-1.5"><Clock size={13} /> Exam date</p>
            <input
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              className="w-full bg-[var(--nav)] border border-[var(--border)] rounded-sm px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <p className="text-[11px] text-[var(--text-faint)] mt-2">Optional — powers a countdown on your dashboard. You can add it later.</p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2">Which papers are you sitting?</p>
            <div className="flex gap-2">
              {["FLK1", "FLK2"].map(s => (
                <button key={s} type="button" onClick={() => toggleSubject(s)}
                  className={`flex-1 text-sm py-2.5 rounded-sm border font-medium transition-colors ${subjects.includes(s) ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-faint)] mt-2">Pick both if you're sitting the full SQE1 — this sets your default mock exam paper.</p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-2 flex items-center gap-1.5"><Target size={13} /> Daily goal (cards/day)</p>
            <div className="flex gap-2">
              {[10, 20, 30, 50].map(n => (
                <button key={n} type="button" onClick={() => setDailyGoal(n)}
                  className={`flex-1 text-sm py-2 rounded-sm border font-medium transition-colors ${dailyGoal === n ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={submit}
            className="w-full py-3.5 rounded-sm bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors mt-1">
            {editing ? "Save changes" : "Start revising"}
          </button>
          {editing && (
            <button onClick={onCancel} className="w-full py-2 text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors">
              Cancel
            </button>
          )}
        </div>
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
  const [studyModule, setStudyModule] = useState(null); // null | "Contract Law" | "Tort" | ...
  const [loaded, setLoaded] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [mockHistory, setMockHistory] = useState([]);
  const [attemptLog, setAttemptLog] = useState([]);
  const [onboarding, setOnboardingState] = useState(null);
  const [editingPlan, setEditingPlan] = useState(false);

  useEffect(() => { loadTheme().then(setTheme); }, []);
  const toggleTheme = () => { const t = theme === "dark" ? "light" : "dark"; setTheme(t); saveTheme(t); };
  const isDark = theme === "dark";

  useEffect(() => {
    (async () => {
      const [p, s, g, mh, al, ob] = await Promise.all([loadProgress(), loadStreak(), loadGoal(), loadMockHistory(), loadAttemptLog(), loadOnboarding()]);
      let nextStreak = s;
      if (s.lastDate !== todayStr()) {
        // new day: check if yesterday continues streak
        const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        nextStreak = { count: s.lastDate === yest ? s.count : 0, lastDate: todayStr(), todayDone: 0 };
      }
      setProgress(p); setStreak(nextStreak); setGoalState(g); setMockHistory(mh); setAttemptLog(al); setOnboardingState(ob); setLoaded(true);
      saveStreak(nextStreak);
    })();
  }, []);

  const completeOnboarding = ({ examDate, subjects, goal: g }) => {
    const data = { examDate, subjects, completed: true };
    setOnboardingState(data);
    saveOnboarding(data);
    setGoal(g);
    setEditingPlan(false);
  };

  const addMockAttempt = useCallback((attempt) => {
    setMockHistory(prev => {
      const updated = [attempt, ...prev].slice(0, 20);
      saveMockHistory(updated);
      return updated;
    });
  }, []);

  const logAttempt = useCallback((record) => {
    setAttemptLog(prev => {
      const updated = [record, ...prev].slice(0, 3000);
      saveAttemptLog(updated);
      return updated;
    });
  }, []);

  const logAttempts = useCallback((records) => {
    setAttemptLog(prev => {
      const updated = [...records, ...prev].slice(0, 3000);
      saveAttemptLog(updated);
      return updated;
    });
  }, []);

  const tagAttemptReason = useCallback((attemptId, reason) => {
    setAttemptLog(prev => {
      const updated = prev.map(a => a.id === attemptId ? { ...a, reason } : a);
      saveAttemptLog(updated);
      return updated;
    });
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
  const dueSba = sbaCards.filter(c => isDue(progress[c.id]));

  const matchesStudyFilter = (c) => !studyModule || TOPIC_TO_MODULE[c.topic] === studyModule;
  const studyFlipCards = flipCards.filter(matchesStudyFilter);
  const studySbaCards = sbaCards.filter(matchesStudyFilter);
  const studyDueFlip = studyFlipCards.filter(c => isDue(progress[c.id]));
  // Same due-first-else-everything pattern as flashcards: once an SBA has
  // been answered, its schedule (weighted by accuracy) decides how soon it
  // resurfaces in practice mode, so weak topics come back around faster.
  const studyDueSba = studySbaCards.filter(c => isDue(progress[c.id]));

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

  if (!onboarding.completed || editingPlan) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300" style={{ fontFamily: "'Inter', system-ui, sans-serif", ...themeVars }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');
          .font-serif { font-family: 'Source Serif 4', Georgia, serif; }
        `}</style>
        <OnboardingFlow
          initial={{ examDate: onboarding.examDate, subjects: onboarding.subjects, goal }}
          editing={onboarding.completed && editingPlan}
          onCancel={() => setEditingPlan(false)}
          onComplete={completeOnboarding}
        />
      </div>
    );
  }

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
            dueCount={dueFlip.length + dueSba.length} totalCards={SEED_CARDS.length} onGo={setTab}
            onSelectModule={(name) => { setStudyModule(name); setTab("study"); }}
            mockHistory={mockHistory} attemptLog={attemptLog} examDate={onboarding.examDate} />
        )}

        {tab === "study" && (
          <div>
            <ModuleFilter module={studyModule} setModule={setStudyModule} />
            <div className="flex gap-2 max-w-lg mx-auto px-4 mb-5">
              <button onClick={() => setMode("flip")}
                className={`flex-1 text-xs py-2 rounded-sm border font-medium transition-colors ${mode === "flip" ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                Flip cards
              </button>
              <button onClick={() => { setMode("sba"); setQuizResult(null); }}
                className={`flex-1 text-xs py-2 rounded-sm border font-medium transition-colors ${mode === "sba" ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--border)] text-[var(--text-dim)]"}`}>
                SBA quiz
              </button>
            </div>

            {mode === "flip" && <StudyDeck cards={studyDueFlip.length ? studyDueFlip : studyFlipCards} progress={progress} onRate={rate} />}

            {mode === "sba" && !quizResult && (
              <>
                <div className="max-w-lg mx-auto px-4 mb-4 flex items-center justify-between">
                  <label className="text-xs text-[var(--text-dim)] flex items-center gap-2">
                    <input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)} className="accent-[var(--accent)]" />
                    Timed practice
                  </label>
                </div>
                <SbaQuiz cards={studyDueSba.length ? studyDueSba : studySbaCards} timed={timed}
                  onFinish={(score, total, secs) => setQuizResult({ score, total, secs })}
                  onLogAttempt={logAttempt} onTagReason={tagAttemptReason} onRate={rate} />
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

        {tab === "mock" && (
          <MockExam allSbaCards={sbaCards} onComplete={addMockAttempt}
            onLogAttempts={logAttempts} onTagReason={tagAttemptReason} onRate={rate}
            defaultPaper={onboarding.subjects.length === 1 ? onboarding.subjects[0] : "Mixed"} />
        )}

        {tab === "insights" && (
          <InsightsView attemptLog={attemptLog}
            onSelectModule={(name) => { setStudyModule(name); setTab("study"); }} />
        )}

        {tab === "search" && <CasebookView query={query} setQuery={setQuery} />}

        {tab === "more" && (
          <div className="px-4 max-w-lg mx-auto flex flex-col gap-3">
            <button onClick={() => setEditingPlan(true)}
              className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4 text-left hover:border-[var(--accent)] transition-colors flex items-center justify-between">
              <div>
                <p className="font-serif text-base text-[var(--text)] mb-1">Study plan</p>
                <p className="text-xs text-[var(--text-mid)] leading-relaxed">
                  {onboarding.subjects.join(" + ")} · {goal} cards/day
                  {onboarding.examDate ? ` · exam ${new Date(onboarding.examDate + "T00:00:00").toLocaleDateString()}` : " · no exam date set"}
                </p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-dim)] shrink-0" />
            </button>
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
        <NavButton icon={Home} label="Home" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
        <NavButton icon={Layers} label="Study" active={tab === "study"} onClick={() => setTab("study")} />
        <NavButton icon={TimerIcon} label="Mock" active={tab === "mock"} onClick={() => setTab("mock")} />
        <NavButton icon={TrendingUp} label="Insights" active={tab === "insights"} onClick={() => setTab("insights")} />
        <NavButton icon={Search} label="Casebook" active={tab === "search"} onClick={() => setTab("search")} />
        <NavButton icon={Menu} label="More" active={tab === "more"} onClick={() => setTab("more")} />
      </nav>
    </div>
  );
}
