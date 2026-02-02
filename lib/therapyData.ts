// lib/therapyData.ts
import type { ModalityId } from "./quizData";

export type TherapyPage = {
  id?: ModalityId;
  slug: string;
  name: string;
  family: string;

  whatItIs: string;
  whatSessionsLookLike: string[];
  oftenHelpfulFor: string[];
  goodFitIf: string[];
  notIdealIf: string[];

  evidenceNotes?: string[];
  safetyNotes?: string[];

  // search keywords (plain-language, teen-friendly, common Google terms)
  keywords?: string[];
};

export const THERAPY_PAGES: TherapyPage[] = [

  {
    id: "cbt",
    slug: "cbt",
    name: "CBT (Cognitive Behavioral Therapy)",
    family: "Evidence-based & skills-based",
    whatItIs:
      "CBT helps you spot unhelpful thought-and-behavior loops and practice new patterns that reduce symptoms over time—one doable step at a time.",
    whatSessionsLookLike: [
      "Identify patterns (thoughts, feelings, behaviors) and what keeps them going",
      "Practice tools: reframing, problem-solving, exposure/behavior change strategies when relevant",
      "Between-session practice is collaborative and flexible (meant to support you, not pressure you)",
    ],
    oftenHelpfulFor: ["Anxiety", "Depression", "Panic", "Stress", "Insomnia", "Phobias (sometimes with exposure)"],
    goodFitIf: [
      "You like clear structure",
      "You want practical tools you can use between sessions",
      "You’re open to practicing skills in real life with support",
    ],
    notIdealIf: [
      "You’re wanting a fully open-ended, exploratory style right now (psychodynamic may feel better)",
      "Homework feels overwhelming at the moment—your therapist can adapt, or you might prefer ACT or a more insight-based approach to start",
    ],
    evidenceNotes: ["Strong evidence base across many conditions; often a first-line option for anxiety and depression."],
    keywords: [
      "tools",
      "skills",
      "thoughts",
      "negative thoughts",
      "overthinking",
      "worry",
      "panic",
      "stress management",
      "sleep",
      "insomnia",
      "burnout",
      "motivation",
      "behavior change",
      "worksheet",
    ],
  },

  {
    id: "dbt",
    slug: "dbt",
    name: "DBT (Dialectical Behavior Therapy)",
    family: "Evidence-based & skills-based",
    whatItIs:
      "DBT teaches practical skills for navigating big emotions, handling distress, and strengthening relationships—often in a supportive, coaching-style format.",
    whatSessionsLookLike: [
      "Skills training (often in group) + individual therapy to apply skills to your real life",
      "Tools for high-intensity moments (grounding, distress tolerance, safety planning when needed)",
      "Tracking patterns and practicing new responses with repetition and encouragement",
    ],
    oftenHelpfulFor: ["Emotion dysregulation", "High emotional intensity", "Mood instability", "Relationship conflict", "Impulsivity"],
    goodFitIf: [
      "You want step-by-step skills and practice",
      "You want tools for intense moments and tough days",
      "You like learning in a structured, supportive way",
    ],
    notIdealIf: [
      "You’re looking for a mostly insight-only approach with minimal skills practice (psychodynamic or IFS may feel closer)",
      "A program format feels like too much right now—ask about a lighter DBT-informed approach as a starting point",
    ],
    evidenceNotes: ["Well-supported for high emotional intensity; often delivered as a structured program."],
    keywords: [
      "emotion regulation",
      "distress tolerance",
      "big emotions",
      "impulsive",
      "self control",
      "mindfulness",
      "interpersonal effectiveness",
      "boundaries",
      "conflict",
      "relationship skills",
      "group skills",
    ],
  },

  {
    id: "act",
    slug: "act",
    name: "ACT (Acceptance & Commitment Therapy)",
    family: "Evidence-based & values-driven",
    whatItIs:
      "ACT helps you make room for difficult thoughts and feelings while building a life guided by your values—so you can move forward even when things feel hard.",
    whatSessionsLookLike: [
      "Clarify what matters to you and set small, realistic action steps",
      "Learn ways to unhook from sticky thoughts (defusion) and build emotional openness",
      "Mindfulness and self-compassion practices tailored to your pace",
    ],
    oftenHelpfulFor: ["Anxiety", "Depression", "Perfectionism", "Chronic stress", "Life transitions", "Chronic pain (often integrated)"],
    goodFitIf: [
      "You want tools + meaning",
      "You want more flexibility than constant thought-challenging",
      "You like values-based direction and gentle accountability",
    ],
    notIdealIf: [
      "You want a very worksheet-driven protocol every session (CBT/DBT may feel clearer)",
      "You’re hoping for quick symptom elimination only—ACT focuses more on resilience, choice, and meaningful action",
    ],
    evidenceNotes: ["Strong evidence base; often helpful for psychological flexibility with difficult internal experiences."],
    keywords: [
      "values",
      "meaning",
      "purpose",
      "overthinking",
      "anxiety",
      "stress",
      "burnout",
      "self compassion",
      "mindfulness",
      "defusion",
      "acceptance",
      "life direction",
    ],
  },

  {
    id: "erp",
    slug: "erp",
    name: "ERP (Exposure & Response Prevention)",
    family: "Evidence-based & specialty care",
    whatItIs:
      "ERP is a gold-standard approach for OCD that helps you reduce compulsions by gradually facing triggers while practicing new responses—at a pace you can handle.",
    whatSessionsLookLike: [
      "Map obsessions/compulsions and build an exposure plan together",
      "Practice exposures in-session (and between sessions) with support and tracking",
      "Build tolerance for uncertainty and reduce reassurance/rituals over time",
    ],
    oftenHelpfulFor: ["OCD", "Compulsions", "Intrusive thoughts", "Certain anxiety presentations where avoidance is central"],
    goodFitIf: [
      "You want a direct, evidence-based approach for OCD",
      "You’re willing to practice gradually with guidance",
      "You like a clear plan and measurable progress",
    ],
    notIdealIf: [
      "Your main need right now is crisis stabilization (skills-first support can come first)",
      "You’re looking for a purely insight-only approach to OCD (ERP tends to work best when practice is included)",
    ],
    evidenceNotes: ["Considered a gold-standard treatment for OCD."],
    safetyNotes: ["A good provider will pace exposures collaboratively—no flooding or forcing."],
    keywords: [
      "ocd",
      "intrusive thoughts",
      "compulsions",
      "rumination",
      "reassurance seeking",
      "checking",
      "contamination",
      "harm ocd",
      "religious scrupulosity",
      "exposure therapy",
    ],
  },

  {
    slug: "mindfulness-based",
    name: "Mindfulness-Based Therapies (MBCT / MBSR)",
    family: "Evidence-based & skills-based",
    whatItIs:
      "Mindfulness-based approaches strengthen attention and present-moment awareness, helping you relate to thoughts and emotions with more steadiness and choice.",
    whatSessionsLookLike: [
      "Guided mindfulness practices + supportive discussion of what you notice",
      "Skills for observing thoughts without getting pulled into them",
      "Often includes home practice—short, consistent repetition over time",
    ],
    oftenHelpfulFor: ["Stress", "Anxiety", "Relapse prevention for depression (MBCT)", "Chronic pain/stress conditions (MBSR)"],
    goodFitIf: [
      "You want calming and grounding tools for your nervous system",
      "You’re open to gentle practice over time",
      "You want a steady approach that builds resilience",
    ],
    notIdealIf: [
      "You’re hoping for fast change without practice (mindfulness benefits from repetition)",
      "You’re feeling very dissociated or unsafe in your body right now—modified mindfulness and grounding may be a better starting point",
    ],
    safetyNotes: ["Some trauma histories benefit from modified mindfulness (eyes open, shorter practices, more grounding and choice)."],
    keywords: [
      "mindfulness",
      "grounding",
      "stress",
      "anxiety",
      "calm",
      "breathing",
      "present moment",
      "sleep",
      "rumination",
      "meditation",
      "mbct",
      "mbsr",
    ],
  },

  {
    slug: "mi",
    name: "Motivational Interviewing (MI)",
    family: "Evidence-based & change-focused",
    whatItIs:
      "MI helps you work through ambivalence about change by strengthening your own reasons, confidence, and next steps—without shame or pressure.",
    whatSessionsLookLike: [
      "Clarify goals and what matters to you",
      "Explore pros/cons with compassion and honesty",
      "Build a realistic change plan and support follow-through",
    ],
    oftenHelpfulFor: ["Substance use", "Health behavior change", "Medication adherence", "Lifestyle change", "Treatment engagement"],
    goodFitIf: [
      "Part of you wants change and part of you feels stuck",
      "You respond better to collaboration than pressure",
      "You want support building confidence and momentum",
    ],
    notIdealIf: ["You want trauma processing as the main focus—MI can still be a helpful starting layer, but not usually the whole plan"],
    keywords: [
      "motivation",
      "stuck",
      "ambivalence",
      "change",
      "habits",
      "substance use",
      "drinking",
      "smoking",
      "health goals",
      "follow through",
      "confidence",
    ],
  },

  {
    id: "emdr",
    slug: "emdr",
    name: "EMDR",
    family: "Trauma-focused",
    whatItIs:
      "EMDR helps distressing memories feel less intense and less ‘stuck,’ so the present can feel safer and more manageable.",
    whatSessionsLookLike: [
      "Preparation and stabilization first (coping skills, safety, resourcing)",
      "Reprocessing with bilateral stimulation (eye movements, taps, or tones)",
      "Integration: working with present-day triggers, meaning-making, and future templates",
    ],
    oftenHelpfulFor: ["Trauma/PTSD", "Disturbing memories", "Triggers", "Negative core beliefs tied to experiences"],
    goodFitIf: [
      "You want a structured trauma approach",
      "You feel ready for guided memory work with strong support",
      "You appreciate a step-by-step model with pacing",
    ],
    notIdealIf: [
      "You’re in acute crisis and need stabilization first (skills support can come first)",
      "You prefer not to touch past memories right now—skills-first or present-focused therapy may feel safer to start",
    ],
    evidenceNotes: ["Supported for PTSD and trauma-related symptoms."],
    keywords: [
      "ptsd",
      "trauma",
      "flashbacks",
      "nightmares",
      "triggers",
      "disturbing memories",
      "processing trauma",
      "bilateral stimulation",
    ],
  },

  {
    id: "somatic",
    slug: "somatic",
    name: "Somatic Therapy (Body-Focused)",
    family: "Trauma & body-focused",
    whatItIs:
      "Somatic approaches support regulation by working with the nervous system and body cues—especially helpful when stress shows up physically.",
    whatSessionsLookLike: [
      "Track body sensations, impulses, and signals of safety",
      "Practice regulation tools (grounding, breath, movement, pacing)",
      "Connect body experience to emotion and meaning—gently and collaboratively",
    ],
    oftenHelpfulFor: ["Trauma stress responses", "Anxiety", "Dissociation", "Chronic tension", "Panic-like body symptoms"],
    goodFitIf: ["You feel stress ‘in your body’", "Talking alone hasn’t been enough", "You want nervous-system support and skills"],
    notIdealIf: [
      "You only want talk therapy with no body focus (CBT/ACT/psychodynamic may fit better)",
      "Body awareness feels unsafe right now—starting with stabilization, grounding, and choice-based pacing can help",
    ],
    safetyNotes: ["A strong provider will pace slowly and prioritize consent, grounding, and your window of tolerance."],
    keywords: [
      "nervous system",
      "body anxiety",
      "panic in body",
      "tension",
      "stress symptoms",
      "dissociation",
      "freeze",
      "shutdown",
      "grounding",
      "breathing",
      "regulation",
    ],
  },

  {
    slug: "se",
    name: "Somatic Experiencing (SE)",
    family: "Trauma & body-focused",
    whatItIs:
      "SE is a somatic method that helps restore regulation by working with sensation, attention, and gradual processing—focused on safety and pacing.",
    whatSessionsLookLike: [
      "Careful pacing and ‘titration’ (small doses of activation)",
      "Tracking shifts in body sensations and nervous system states",
      "Building capacity for stability, safety, and regulation over time",
    ],
    oftenHelpfulFor: ["Trauma", "Chronic stress", "Panic", "Hypervigilance", "Somatic symptoms"],
    goodFitIf: ["You want a gentle body-first approach", "You benefit from pacing and nervous-system education", "You prefer steady progress over intensity"],
    notIdealIf: ["You want highly structured worksheets and homework every week (CBT/DBT may feel clearer)"],
    keywords: ["somatic experiencing", "se", "titration", "hypervigilance", "trauma", "panic", "nervous system", "window of tolerance"],
  },

  {
    slug: "narm",
    name: "NARM (NeuroAffective Relational Model)",
    family: "Trauma & relational",
    whatItIs:
      "NARM focuses on developmental trauma and attachment wounds—how survival strategies shape identity, emotion, and connection, and how to move toward more freedom and choice.",
    whatSessionsLookLike: [
      "Explore present-day patterns (not only the past)",
      "Work with shame, identity, and relational strategies with compassion",
      "Track nervous system shifts and meaning-making in real time",
    ],
    oftenHelpfulFor: ["Developmental trauma", "Chronic shame", "Relational patterns", "Freeze/collapse states"],
    goodFitIf: ["You want depth work with nervous-system awareness", "You’re curious about long-standing patterns", "You want support building healthier connection and self-trust"],
    notIdealIf: ["You’re seeking a quick, skills-only program as the primary focus (DBT/CBT may be a better starting step)"],
    keywords: ["developmental trauma", "attachment", "shame", "identity", "patterns", "freeze", "collapse", "narm"],
  },

  {
    slug: "tf-cbt-cpt",
    name: "Trauma-Focused CBT (TF-CBT) & Cognitive Processing Therapy (CPT)",
    family: "Trauma-focused & evidence-based",
    whatItIs:
      "These structured trauma treatments reduce trauma symptoms and shift trauma-linked beliefs—helping you rebuild safety, trust, and self-understanding.",
    whatSessionsLookLike: [
      "Skills first (coping, regulation), then trauma narrative / processing",
      "Identify stuck points (e.g., safety, trust, blame) and update beliefs",
      "Practice new coping and meaning-making strategies over time",
    ],
    oftenHelpfulFor: ["PTSD", "Trauma-related anxiety/depression", "Adolescents (TF-CBT)", "Adults (CPT)"],
    goodFitIf: ["You want a structured trauma roadmap", "You like skills + cognitive frameworks", "You want measurable progress and clarity"],
    notIdealIf: ["You don’t want trauma-focused work right now—starting with stabilization and present-focused support is okay"],
    keywords: ["tf-cbt", "cpt", "ptsd", "stuck points", "trauma beliefs", "blame", "trust", "safety", "trauma narrative"],
  },

  {
    id: "psychodynamic",
    slug: "psychodynamic",
    name: "Psychodynamic Therapy",
    family: "Depth & insight-oriented",
    whatItIs:
      "Psychodynamic therapy helps you understand deeper patterns—how past experiences shape present emotions, relationships, and self-beliefs—so you can live with more clarity and choice.",
    whatSessionsLookLike: [
      "Open-ended exploration of emotions, themes, and recurring patterns",
      "Attention to relationships (including the therapy relationship) and attachment dynamics",
      "Less worksheet-driven; insight grows steadily over time",
    ],
    oftenHelpfulFor: ["Long-standing relational patterns", "Low self-worth/shame", "Identity", "Chronic anxiety/depression with deeper roots"],
    goodFitIf: ["You want insight, meaning, and deeper self-understanding", "You like exploring patterns over time", "You’re curious about the ‘why’ beneath symptoms"],
    notIdealIf: [
      "You want short-term, highly structured skills right away (CBT/DBT may feel more immediate)",
      "You need urgent stabilization—skills support can come first, then depth work when you’re steadier",
    ],
    keywords: ["patterns", "childhood", "attachment", "insight", "why", "relationships", "identity", "shame", "long-term"],
  },

  {
    id: "ifs",
    slug: "ifs",
    name: "IFS (Internal Family Systems / Parts Work)",
    family: "Depth & parts-based",
    whatItIs:
      "IFS helps you relate to different ‘parts’ of yourself (like an inner critic or protector) with curiosity and compassion—often reducing shame and inner conflict.",
    whatSessionsLookLike: [
      "Map parts (e.g., inner critic, people-pleaser, shut-down part) with care",
      "Build Self-to-part connection (compassionate leadership)",
      "Address older pain gently, with pacing, consent, and stabilization",
    ],
    oftenHelpfulFor: ["Trauma and attachment wounds", "Inner conflict", "Shame/inner critic", "Anxiety/depression with protective patterns"],
    goodFitIf: ["Parts language resonates with you", "You want compassion + depth", "You want to soften shame cycles and build self-trust"],
    notIdealIf: ["You prefer strictly concrete symptom tools with minimal inner exploration (CBT/DBT may feel better)", "You want a purely behavioral approach with no parts framework"],
    safetyNotes: ["A strong provider will pace deeper work carefully and build stabilization first."],
    keywords: ["parts work", "inner critic", "protector", "people pleasing", "self compassion", "shame", "inner child", "attachment"],
  },

  {
    id: "narrative",
    slug: "narrative",
    name: "Narrative Therapy",
    family: "Meaning-making & identity",
    whatItIs:
      "Narrative therapy helps you separate from the problem (“the problem is the problem”) and strengthen your story with more agency, values, and preferred identity.",
    whatSessionsLookLike: [
      "Externalize problems and map how they show up in your life",
      "Identify values, exceptions, and moments of resilience",
      "Strengthen identity through language, story, and cultural/community context",
    ],
    oftenHelpfulFor: ["Identity exploration", "Life transitions", "Shame", "Cultural/contextual stress", "Grief meaning-making"],
    goodFitIf: ["You like reflection, storytelling, and meaning-making", "You want strengths-based identity work", "You want therapy that honors context and culture"],
    notIdealIf: ["You want a highly manualized symptom protocol as the main focus (CBT/ERP may feel clearer)", "You want primarily body-based work (somatic approaches may be a better match)"],
    keywords: ["identity", "story", "meaning", "life transition", "breakup", "divorce", "grief", "shame", "culture", "values"],
  },

  {
    id: "family",
    slug: "family-systems",
    name: "Family Systems Therapy",
    family: "Relational & family-focused",
    whatItIs:
      "Family systems therapy looks at patterns between people—not just within one person—so you can shift cycles, strengthen boundaries, and build healthier connection.",
    whatSessionsLookLike: [
      "Map interaction cycles (roles, boundaries, communication patterns)",
      "Build new interaction skills and repair processes",
      "May include multiple family members—or individual therapy with a systems lens",
    ],
    oftenHelpfulFor: ["Family conflict", "Parent-child stress", "Boundary issues", "Caregiver burnout", "Couples/family transitions"],
    goodFitIf: ["Relationships are a main stressor", "You want to change patterns (not just cope inside them)", "You value communication and repair skills"],
    notIdealIf: ["You want only individual symptom work and relationships feel unrelated"],
    keywords: ["family conflict", "parenting", "communication", "boundaries", "roles", "cycles", "couples", "relationships"],
  },

  {
    slug: "fbt",
    name: "FBT (Family-Based Treatment) for Eating Disorders",
    family: "Relational & specialized",
    whatItIs:
      "FBT is a structured approach where caregivers play a central role in supporting eating disorder recovery—often for adolescents—with an emphasis on safety and steady progress.",
    whatSessionsLookLike: [
      "Clear phases focused on nutrition restoration and medical/psychological safety",
      "Caregiver coaching and structured support at home",
      "Gradual return of autonomy as stability increases",
    ],
    oftenHelpfulFor: ["Adolescent eating disorders", "Family support during recovery"],
    goodFitIf: ["A young person needs coordinated support and structure", "Caregivers can participate consistently (with guidance)"],
    notIdealIf: ["A family system is unsafe or abusive—safety and additional supports come first"],
    keywords: ["eating disorder", "anorexia", "bulimia", "teen", "adolescent", "family support", "caregiver", "nutrition restoration"],
  },

  {
    slug: "gottman",
    name: "Gottman Method Couples Therapy",
    family: "Relational & couples-focused",
    whatItIs:
      "A research-informed couples approach that strengthens friendship, builds conflict tools, and supports shared meaning—so both partners feel more understood and connected.",
    whatSessionsLookLike: ["Assessment + mapping conflict patterns", "Communication tools and repair strategies", "Building rituals of connection and shared goals"],
    oftenHelpfulFor: ["Couples conflict", "Communication breakdown", "Trust repair (case-by-case)", "Life transitions"],
    goodFitIf: ["You want practical relationship tools", "Both partners can participate consistently", "You’re open to practicing skills between sessions"],
    notIdealIf: ["There is ongoing abuse or coercive control—safety planning and individual support come first"],
    safetyNotes: ["Couples therapy isn’t recommended when active coercive control is present."],
    keywords: ["couples", "marriage", "partner", "communication", "conflict", "trust", "repair", "relationship counseling"],
  },

  {
    slug: "ipt",
    name: "IPT (Interpersonal Therapy)",
    family: "Evidence-based & relational",
    whatItIs:
      "IPT improves mood and symptoms by strengthening relationships and building skills for navigating key interpersonal stressors—often in a focused, time-limited format.",
    whatSessionsLookLike: [
      "Choose an interpersonal focus (grief, role transitions, disputes, social support/skills)",
      "Practice communication and support-building strategies",
      "Track symptom changes alongside relational shifts",
    ],
    oftenHelpfulFor: ["Depression", "Grief", "Postpartum mood", "Role transitions", "Interpersonal conflict"],
    goodFitIf: ["Relationships strongly affect your mood", "You want a focused approach with practical interpersonal tools", "You like clarity and measurable progress"],
    notIdealIf: ["You’re looking for long-term open exploration as the primary focus (psychodynamic may fit better)"],
    keywords: ["relationships", "grief", "postpartum", "transition", "conflict", "support", "depression", "communication"],
  },

  {
    id: "group",
    slug: "group",
    name: "Group Therapy",
    family: "Relational & skills-based",
    whatItIs:
      "Group therapy uses shared experience, guided support, and practice to reduce isolation and strengthen real-life relationship skills—at a pace you control.",
    whatSessionsLookLike: [
      "A therapist facilitates structured topics or a process-oriented group",
      "Practice communication, boundaries, and emotional expression in real time",
      "Support + accountability from peers (with clear confidentiality expectations)",
    ],
    oftenHelpfulFor: ["Isolation", "Relationship patterns", "Shame", "Skills practice (DBT groups)", "Recovery support (varies by group)"],
    goodFitIf: ["You learn through connection and shared experience", "You want community and real-time practice", "You’re open to sharing gradually (you don’t have to overshare)"],
    notIdealIf: ["You want only private 1:1 work right now", "You’re in an acute crisis and need higher support first—then group can be a powerful next step"],
    safetyNotes: ["Strong groups have screening, clear boundaries, and skilled facilitation."],
    keywords: ["support group", "group therapy", "community", "loneliness", "isolation", "practice", "social anxiety", "connection"],
  },

  {
    id: "art",
    slug: "art-therapy",
    name: "Art Therapy",
    family: "Expressive & experiential",
    whatItIs:
      "Art therapy uses creative process and image-making to support regulation, insight, and integration—especially when words feel limited or exhausting.",
    whatSessionsLookLike: [
      "A directive or open studio approach (depending on therapist and goals)",
      "Processing the artwork for meaning, emotion, and patterns (no ‘art talent’ required)",
      "Regulation through sensory/creative engagement and grounding",
    ],
    oftenHelpfulFor: ["Trauma", "Grief", "Anxiety", "Shame", "Alexithymia (difficulty naming feelings)", "Adolescents/children"],
    goodFitIf: ["You process visually or creatively", "Talking alone hasn’t been enough", "You want an experiential, body-aware route to emotions"],
    notIdealIf: ["Creative tasks feel uncomfortable—many therapists can adapt with low-pressure options", "You only want manualized worksheets every session (CBT/DBT may feel closer)"],
    safetyNotes: ["A strong art therapist focuses on process and meaning—not ‘quality’ or performance."],
    keywords: ["creative", "drawing", "painting", "nonverbal", "express feelings", "teens", "kids", "trauma", "grief", "grounding"],
  },

  {
    id: "music",
    slug: "music-therapy",
    name: "Music Therapy",
    family: "Expressive & experiential",
    whatItIs:
      "Music therapy uses music experiences (listening, rhythm, songwriting, improvisation) to support regulation, connection, and emotional expression in a structured therapeutic way.",
    whatSessionsLookLike: ["Active music-making or receptive listening (depending on goals)", "Rhythm/breath work for grounding and regulation", "Processing meaning, emotion, and patterns that show up through music"],
    oftenHelpfulFor: ["Stress regulation", "Trauma", "Depression", "Neurodevelopmental support", "Medical settings", "Grief"],
    goodFitIf: ["Music strongly affects your mood", "You want a nonverbal route to emotions", "You like experiential work and creative structure"],
    notIdealIf: ["You strongly dislike music or find it overstimulating—providers can sometimes adapt, or another expressive route may fit better"],
    keywords: ["music", "songwriting", "rhythm", "listening", "nonverbal", "stress", "grief", "depression", "regulation"],
  },

  {
    slug: "dance-movement",
    name: "Dance/Movement Therapy",
    family: "Expressive & somatic",
    whatItIs:
      "Dance/movement therapy uses movement and body awareness to support regulation, integration, and connection—helpful when emotion lives in the body.",
    whatSessionsLookLike: ["Movement-based check-ins and grounding", "Exploring posture, gesture, and body cues for emotion and needs", "Processing verbally and nonverbally, with respect for comfort and accessibility"],
    oftenHelpfulFor: ["Trauma", "Body image concerns", "Dissociation", "Anxiety", "Grief"],
    goodFitIf: ["You want body-based expression", "Talking feels limited or too intellectual", "You experience emotions as movement/energy and want a safe outlet"],
    notIdealIf: ["You need a seated, talk-based format only—somatic talk therapy may be a better match"],
    keywords: ["movement", "body", "somatic", "dance", "embodiment", "anxiety", "dissociation", "grief", "trauma"],
  },

  {
    id: "med",
    slug: "medication-management",
    name: "Medication Management (Psychiatry / PMHNP)",
    family: "Medical support",
    whatItIs:
      "Medication management supports symptoms biologically (sleep, anxiety, mood, attention) and often works best alongside therapy, lifestyle support, and regular check-ins.",
    whatSessionsLookLike: ["Assessment of symptoms, history, and goals", "Medication options explained with risks/benefits and side effects in a collaborative way", "Follow-ups to adjust dose, monitor response, and coordinate care with your treatment team"],
    oftenHelpfulFor: ["Moderate–severe depression", "Severe anxiety", "Bipolar disorder", "Psychosis", "ADHD", "Sleep disruption"],
    goodFitIf: ["Symptoms are intense or persistent", "Therapy alone hasn’t been enough", "Sleep/appetite/functioning is significantly impacted"],
    notIdealIf: ["You want medication to replace all other support—many people do best with a combined approach", "You prefer non-medical approaches only (that’s okay—therapy and lifestyle strategies can still be very effective for many people)"],
    safetyNotes: ["Discuss side effects, interactions, and safety considerations with a licensed prescriber."],
    keywords: ["psychiatry", "meds", "medication", "antidepressant", "ssri", "sleep", "adhd meds", "side effects", "pmhnp"],
  },

  {
    slug: "play-therapy",
    name: "Play Therapy (Child Therapy)",
    family: "Child & adolescent",
    whatItIs:
      "Play therapy helps children express feelings, build coping skills, and work through stress using developmentally appropriate play—often with caregiver support included.",
    whatSessionsLookLike: ["Therapeutic play (toys, stories, games) guided by a trained clinician", "Emotion labeling and coping skills built through play", "Often includes caregiver sessions to support progress at home"],
    oftenHelpfulFor: ["Anxiety in kids", "Behavior challenges", "Trauma", "Grief", "Transitions (divorce/moves/school)"],
    goodFitIf: ["A child communicates more through play than words", "Caregivers can participate as appropriate"],
    notIdealIf: ["A teen/adult prefers a primarily verbal format—other modalities may be a better fit"],
    keywords: ["kids", "child therapy", "play", "parenting", "behavior", "school anxiety", "divorce", "grief", "trauma"],
  },

  {
    slug: "php-iop",
    name: "IOP & PHP (Intensive Outpatient / Partial Hospitalization)",
    family: "Higher level of care",
    whatItIs:
      "Structured programs with multiple sessions per week (often groups + individual) designed to offer more support, stability, and momentum when symptoms feel too heavy for weekly therapy alone.",
    whatSessionsLookLike: ["Multiple weekly groups (skills, process, psychoeducation)", "Often includes individual therapy and medication support", "Stabilization, structure, and steady monitoring with a clinical team"],
    oftenHelpfulFor: ["Significant depression/anxiety", "Safety concerns", "Functional impairment", "Step-down from inpatient"],
    goodFitIf: ["Weekly therapy isn’t enough right now", "You want structure and support multiple days/week", "You want a bridge toward steadier functioning"],
    notIdealIf: ["Symptoms are mild and weekly outpatient support is meeting your needs"],
    safetyNotes: ["When safety is a concern, these programs can be a supportive bridge with higher structure and monitoring."],
    keywords: ["php", "iop", "higher level of care", "intensive", "program", "group therapy program", "stabilization", "more support"],
  },

  {
    slug: "tms",
    name: "TMS (Transcranial Magnetic Stimulation)",
    family: "Advanced treatment",
    whatItIs:
      "TMS is a noninvasive brain stimulation treatment often used for depression when medications and therapy haven’t been enough—typically as part of a broader care plan.",
    whatSessionsLookLike: ["A series of brief sessions over several weeks", "Often paired with therapy and/or medication management", "Ongoing monitoring of mood and symptoms"],
    oftenHelpfulFor: ["Treatment-resistant depression", "Some anxiety presentations (clinic-dependent)"],
    goodFitIf: ["You’ve tried multiple treatments without adequate relief", "You want a non-systemic option compared to medications"],
    notIdealIf: ["You’re looking for psychotherapy (TMS is a medical intervention, not talk therapy)"],
    keywords: ["tms", "brain stimulation", "depression treatment", "treatment resistant depression", "noninvasive", "advanced treatment"],
  },

  {
    slug: "ect",
    name: "ECT (Electroconvulsive Therapy)",
    family: "Advanced treatment",
    whatItIs:
      "ECT is a medical treatment used for severe depression and certain acute psychiatric situations; it can be life-saving when rapid relief is needed and other treatments haven’t helped.",
    whatSessionsLookLike: ["Provided in a medical setting with anesthesia", "A series of treatments with careful monitoring", "Often followed by a maintenance plan (therapy/meds/support)"],
    oftenHelpfulFor: ["Severe depression", "Catatonia", "High-risk clinical presentations needing rapid response"],
    goodFitIf: ["A psychiatrist recommends it for severe symptoms", "Other treatments have not worked"],
    notIdealIf: ["You’re seeking a first-line outpatient therapy approach"],
    safetyNotes: ["Decisions should be made with a psychiatrist based on individualized risk/benefit."],
    keywords: ["ect", "severe depression", "rapid treatment", "hospital", "advanced treatment", "psychiatry"],
  },
];
