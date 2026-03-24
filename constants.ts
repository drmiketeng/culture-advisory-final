
import { Question, TransformationPhase } from './types';

export const QUESTIONS: Question[] = [
  // --- SURGERY PHASE (Financial Discipline & Efficiency) ---
  {
    id: 's1',
    phase: TransformationPhase.SURGERY,
    text: 'Scenario: The company has lost a major client and revenue is down 20% this quarter. Leadership decides to freeze all hiring immediately. How is this communicated?',
    options: [
      'It is announced via a sudden email with no context, fueling rumors of layoffs.',
      'Leaders explain the financial math in a town hall but allow no questions.',
      'Financial realities are shared openly, and staff are asked for cost-saving ideas to avoid deeper cuts.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Transparency prevents rumor-mongering (Principle 38: Rumor is like SARS). Secrecy breeds fear, whereas open communication enlists staff as allies in the solution.'
  },
  {
    id: 's2',
    phase: TransformationPhase.SURGERY,
    text: 'Scenario: A department manager requests budget for a new software tool that promises efficiency but costs $10k upfront. Cash flow is tight. What happens?',
    options: [
      'The request is rejected automatically by finance without looking at the proposal.',
      'It is approved only if they can prove it pays for itself within 30 days.',
      'It is evaluated based on critical necessity; if it stops bleeding elsewhere, it is approved.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'In Surgery, cash is oxygen (Principle 50). While controls must be tight, we must distinguish between cost-cutting that injures vital organs versus tools that stop the bleeding.'
  },
  {
    id: 's3',
    phase: TransformationPhase.SURGERY,
    text: 'Scenario: An audit reveals that two departments have overlapping functions, costing the company double. How does management handle the redundancy?',
    options: [
      'Nothing changes because "that is how we have always done it" and no one wants conflict.',
      'One team is fired arbitrarily to save money immediately.',
      'A surgical review consolidates the functions, retaining the most effective talent from both.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Restructuring is surgery, not amputation (Principle 52). You must cut fat without injuring the muscle. Arbitrary firing creates negative side effects like survivor syndrome.'
  },
  {
    id: 's4',
    phase: TransformationPhase.SURGERY,
    text: 'Scenario: A high-performing sales rep is found inflating expense reports during a cost-control period. How is this handled?',
    options: [
      'It is swept under the rug because they bring in revenue.',
      'They are publicly shamed or fired immediately to set an example.',
      'They are held accountable privately and asked to make restitution, enforcing the "walk the talk" ethic.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Without ethics, the company loses its soul (Principle 78). High performance does not excuse lack of integrity. Accountability is non-negotiable.'
  },
  {
    id: 's5',
    phase: TransformationPhase.SURGERY,
    text: 'Scenario: The company needs to extend its runway by 6 months. Management asks staff to take a temporary 10% pay cut to avoid layoffs.',
    options: [
      'Management takes no cut themselves but insists staff do.',
      'It is a mandate: take the cut or leave.',
      'Leaders take a 20% cut first ("Lead by example") before asking staff to contribute.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Leaders must "Walk the Talk" (Principle 77). If the top gun does not make sacrifices, they lose all credibility to ask the same of their team.'
  },
  
  // --- RESUSCITATION PHASE (Marketing, Sales & Growth) ---
  {
    id: 'r1',
    phase: TransformationPhase.RESUSCITATION,
    text: 'Scenario: A competitor launches a cheaper product that is eating into your market share. How does your organization respond?',
    options: [
      'We ignore it and insist our brand loyalty will save us.',
      'We panic and slash our prices immediately, entering a "race to the bottom".',
      'We analyze the gap and pivot our marketing to highlight our superior value/service (The "Intel" approach).'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Don\'t just nibble at low price (Principle 35). Competing solely on price against low-cost rivals is corporate suicide. Differentiate through value and innovation.'
  },
  {
    id: 'r2',
    phase: TransformationPhase.RESUSCITATION,
    text: 'Scenario: The sales team is missing targets. The VP of Sales proposes a radical new commission structure to drive growth.',
    options: [
      'The proposal is buried in bureaucracy and committees for months.',
      'It is rejected because "we don\'t want to spoil the salespeople".',
      'It is piloted quickly to see if it drives the right behaviors (Resuscitation requires oxygen/cash).'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Bureaucracy is the parasite to productivity (Principle 60). In Resuscitation, speed is critical. Pilot new ideas quickly rather than letting them die in committee.'
  },
  {
    id: 'r3',
    phase: TransformationPhase.RESUSCITATION,
    text: 'Scenario: A long-term client complains about a service failure. Fixing it will cost the company short-term profit.',
    options: [
      'We quote the contract terms and refuse to fix it for free.',
      'We fix it but complain about it, making the client feel guilty.',
      'We fix it immediately and go the extra mile, knowing loyalty is the fibre of recovery.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Customer loyalty is the fibre of business (Principle 63). Ensure a cure, don\'t just sell medicine. Short-term cost is an investment in long-term survival.'
  },
  {
    id: 'r4',
    phase: TransformationPhase.RESUSCITATION,
    text: 'Scenario: The marketing team wants to launch a bold, controversial campaign to get attention in a crowded market.',
    options: [
      'Leadership shuts it down to play it safe and conservative.',
      'It is micromanaged until it becomes bland and ineffective.',
      'Leadership approves the calculated risk, knowing visibility is needed for life support.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Ineffective publicity is like Viagra—short term thrill, long term impotent (Principle 67). You must stand out. Be paranoid about healthy growth (Principle 70).'
  },
  {
    id: 'r5',
    phase: TransformationPhase.RESUSCITATION,
    text: 'Scenario: Two internal teams are fighting over credit for a recent sales win. How does leadership intervene?',
    options: [
      'Leadership ignores it, letting them fight it out ("Survival of the fittest").',
      'Leadership picks a favorite based on office politics.',
      'Leadership forces a truce and emphasizes shared goals ("Together we stand").'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Accomplish your dream, have a good team (Principle 44). Internal warfare drains energy needed to fight the real enemy (competitors) outside.'
  },

  // --- THERAPY PHASE (HR, Mindset & Talent) ---
  {
    id: 't1',
    phase: TransformationPhase.THERAPY,
    text: 'Scenario: A high-potential employee makes a mistake that costs the company time but not money. What is the reaction?',
    options: [
      'They are reprimanded severely and reminded of their place.',
      'It is noted on their record for the next performance review.',
      'It is treated as "tuition fees" for learning, provided they learn the lesson.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Failure is the mother of success (Principle 91). If you punish honest mistakes, you kill innovation. Smart companies view this as investment in training.'
  },
  {
    id: 't2',
    phase: TransformationPhase.THERAPY,
    text: 'Scenario: Rumors are spreading about a potential merger. The "grapevine" is active. How does leadership handle it?',
    options: [
      'They ignore it, hoping it goes away.',
      'They hunt down the "whistle-blower" or rumor starter.',
      'They address it openly with candor to stop the "virus" of fear.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Rumor is like the SARS virus (Principle 38). It spreads by mouth and infects the whole body. The only cure is the truth, administered immediately.'
  },
  {
    id: 't3',
    phase: TransformationPhase.THERAPY,
    text: 'Scenario: An "Old Guard" manager refuses to adapt to new digital tools, hindering the team. He has been there 20 years.',
    options: [
      'We work around him out of respect for his tenure.',
      'We complain about him but do nothing.',
      'He is given a choice: Adapt (learn new tricks) or Exit gracefully.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'To survive, old dogs must learn new tricks (Principle 82). If they cannot adapt, they become a blockage to the company\'s "Qi" (internal energy).'
  },
  {
    id: 't4',
    phase: TransformationPhase.THERAPY,
    text: 'Scenario: The company is now stable. Staff are asking for better work-life balance and mental health support.',
    options: [
      'Leadership views this as "weakness" and demands 110% effort.',
      'HR sends a generic email about wellness but workloads remain identical.',
      'Leadership implements "Corporate Wellness" policies (prevention/maintenance) to boost the immune system.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'A healthy culture is the immunity of a healthy organization (Principle 90). Therapy is about prevention and strengthening the immune system for the long haul.'
  },
  {
    id: 't5',
    phase: TransformationPhase.THERAPY,
    text: 'Scenario: A star performer is arrogant and toxic to their peers ("Malignant Tumor").',
    options: [
      'We keep them because they bring in the numbers.',
      'We try to isolate them so they do less damage.',
      'We remove them, knowing a toxic culture will kill the host organism eventually.'
    ],
    recommendedOptionIndex: 2,
    feedback: 'Two types of tumors: benign and malignant (Principle 59). Malignant tumors (toxic staff) must be removed immediately, or they will spread and kill the body.'
  }
];

export const DEMO_DATA = {
  leaderAnswers: QUESTIONS.map(q => ({ 
    questionId: q.id, 
    selectedOptionIndex: 2 
  })),
  staffSubmissions: [
    {
      id: 'staff-1',
      role: 'Staff',
      timestamp: Date.now(),
      answers: QUESTIONS.map((q, i) => ({
        questionId: q.id,
        selectedOptionIndex: i % 2 === 0 ? 0 : 1
      }))
    },
    {
      id: 'staff-2',
      role: 'Staff',
      timestamp: Date.now(),
      answers: QUESTIONS.map((q, i) => ({
        questionId: q.id,
        selectedOptionIndex: 0
      }))
    },
    {
      id: 'staff-3',
      role: 'Staff',
      timestamp: Date.now(),
      answers: QUESTIONS.map((q, i) => ({
        questionId: q.id,
        selectedOptionIndex: i % 3 === 0 ? 2 : 1
      }))
    }
  ]
};
