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
