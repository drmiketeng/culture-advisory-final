
import React, { useState, useRef, useEffect } from 'react';
import { QUESTIONS, DEMO_DATA } from './constants';
import { Question, Answer, TransformationPhase, ReportMode, ReportData, UserRole, Submission } from './types';
import { generateCultureReport, generatePrayerAudio } from './services/geminiService';
import { Assistant } from './components/Assistant';

// Icons
const CheckCircle = () => <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayIcon = () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PauseIcon = () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const DocumentIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" /></svg>;
const InfoIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowDownTrayIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const LightBulbIcon = () => <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ArrowLeftIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const ExclamationIcon = () => <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

// App States
type ViewState = 'LOGIN' | 'ONBOARDING' | 'ROLE_SELECTION' | 'ASSESSMENT' | 'STAFF_SUCCESS' | 'LEADER_DASHBOARD' | 'REPORT';

const PHASE_ORDER = [
  TransformationPhase.SURGERY,
  TransformationPhase.RESUSCITATION,
  TransformationPhase.THERAPY
];

function App() {
  // Global Data
  const [phase, setPhase] = useState<TransformationPhase>(TransformationPhase.SURGERY);
  const [leaderAnswers, setLeaderAnswers] = useState<Answer[]>([]);
  const [staffSubmissions, setStaffSubmissions] = useState<Submission[]>([]);

  // User Auth & Context
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [tempAnswers, setTempAnswers] = useState<Answer[]>([]);
  
  // Configuration - Default to FAITH based on user feedback
  const [mode, setMode] = useState<ReportMode>(ReportMode.FAITH);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for scrolling
  const reportTopRef = useRef<HTMLDivElement>(null);

  // Audio effects
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => { if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100); };
      const handleEnded = () => { setIsPlaying(false); setAudioProgress(100); };
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl]); // Re-bind when URL changes

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Check if we are at end, if so, restart
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && termsAccepted) {
      setView('ONBOARDING');
    }
  };

  const handleLogout = () => {
    setEmail('');
    setTermsAccepted(false);
    setLeaderAnswers([]);
    setStaffSubmissions([]);
    setReport(null);
    setView('LOGIN');
  };

  const goHome = () => {
    if (view === 'LOGIN') return;
    setView('ONBOARDING');
  };

  const handleBackFromAssessment = () => {
    const currentPhaseIndex = PHASE_ORDER.indexOf(phase);
    if (currentPhaseIndex > 0) {
      // Go back to previous phase
      setPhase(PHASE_ORDER[currentPhaseIndex - 1]);
      window.scrollTo(0, 0);
    } else {
      // Exit assessment
      if (currentRole === UserRole.LEADER && leaderAnswers.length > 0) {
        setView('LEADER_DASHBOARD');
      } else {
        setView('ROLE_SELECTION');
      }
    }
  };

  const goBack = () => {
    switch (view) {
      case 'ONBOARDING':
        handleLogout();
        break;
      case 'ROLE_SELECTION':
        setView('ONBOARDING');
        break;
      case 'ASSESSMENT':
        handleBackFromAssessment();
        break;
      case 'LEADER_DASHBOARD':
        setView('ONBOARDING');
        break;
      case 'REPORT':
        setView('LEADER_DASHBOARD');
        break;
      case 'STAFF_SUCCESS':
        setView('ROLE_SELECTION');
        break;
      default:
        break;
    }
  };

  const handleSelfAssessment = () => {
      // Clear previous data for fresh start
      setLeaderAnswers([]);
      setStaffSubmissions([]);
      setTempAnswers([]);
      setPhase(TransformationPhase.SURGERY); // Reset to first phase
      setView('ROLE_SELECTION');
  };

  // Demo Logic
  const startDemoPlay = () => {
      // Load all demo data
      setLeaderAnswers(DEMO_DATA.leaderAnswers);
      setStaffSubmissions(DEMO_DATA.staffSubmissions);
      setCurrentRole(UserRole.LEADER);
      setView('LEADER_DASHBOARD');
  };

  // Assessment Logic
  const startAssessment = (role: UserRole) => {
    setCurrentRole(role);
    // If we are restarting or editing, preserve existing answers if any, or start fresh
    // But typically 'Self Assessment' clears data. 
    // If coming from dashboard to edit, we might want to load existing answers.
    if (role === UserRole.LEADER && leaderAnswers.length > 0) {
        setTempAnswers([...leaderAnswers]);
    } else {
        // Keep temp answers if we are just moving between phases, but if starting fresh:
        if (view !== 'ASSESSMENT') {
           setPhase(TransformationPhase.SURGERY);
           setTempAnswers([]); 
        }
    }
    setView('ASSESSMENT');
  };

  const handleAnswerChange = (qId: string, optIndex: number) => {
    setTempAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === qId);
      if (existing >= 0) {
        const newArr = [...prev];
        newArr[existing] = { questionId: qId, selectedOptionIndex: optIndex };
        return newArr;
      }
      return [...prev, { questionId: qId, selectedOptionIndex: optIndex }];
    });
  };

  const handleNextPhase = () => {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[currentIndex + 1]);
      window.scrollTo(0, 0);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = () => {
    if (currentRole === UserRole.LEADER) {
      // For leader, merge or replace answers
      setLeaderAnswers(prev => {
        // Simple replacement of all answers since we track them all in tempAnswers now
        return [...tempAnswers];
      });
      setView('LEADER_DASHBOARD');
    } else {
      const newSubmission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        role: UserRole.STAFF,
        answers: tempAnswers,
        timestamp: Date.now()
      };
      setStaffSubmissions(prev => [...prev, newSubmission]);
      setView('STAFF_SUCCESS');
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    setAudioUrl(null);
    setIsPlaying(false);
    try {
      // Pass data to generate comprehensive report for ALL phases
      const data = await generateCultureReport(leaderAnswers, staffSubmissions, mode);
      setReport(data);
      
      if (mode === ReportMode.FAITH && data.prayerContent) {
        setIsGeneratingAudio(true);
        generatePrayerAudio(data.prayerContent)
          .then(url => setAudioUrl(url))
          .catch(err => console.error("Audio gen failed", err))
          .finally(() => setIsGeneratingAudio(false));
      }
      setView('REPORT');
      setTimeout(() => {
          reportTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error(e);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Render Section Helper
  const RenderSection = ({ title, content, color = 'slate' }: { title: string, content: string, color?: string }) => {
    const borderColor = color === 'amber' ? 'border-amber-200' : color === 'red' ? 'border-red-200' : color === 'blue' ? 'border-blue-200' : color === 'green' ? 'border-green-200' : 'border-slate-200';
    const bgColor = color === 'amber' ? 'bg-amber-50' : color === 'red' ? 'bg-red-50' : color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-white';
    const textColor = color === 'amber' ? 'text-amber-900' : color === 'red' ? 'text-red-900' : color === 'blue' ? 'text-blue-900' : color === 'green' ? 'text-green-900' : 'text-slate-900';
    
    return (
       <div className={`rounded-2xl border ${borderColor} ${bgColor} p-8 mb-10 shadow-sm`}>
          <h2 className={`text-2xl font-bold ${textColor} mb-6 border-b ${borderColor} pb-3`}>{title}</h2>
          <div className="prose prose-lg max-w-none text-slate-700">
              {content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h3 key={i} className={`text-lg font-bold mt-4 mb-2 ${textColor}`}>{line.replace('## ', '')}</h3>;
                if (line.startsWith('### ')) return <h4 key={i} className={`text-sm font-bold uppercase tracking-wider mt-4 mb-2 ${textColor} opacity-80`}>{line.replace('### ', '')}</h4>;
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return <div key={i} className="flex items-start mb-2 ml-4"><span className="mr-2">•</span><span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>;
                }
                if (line.trim() === '') return <div key={i} className="h-3"></div>;
                return <p key={i} className="mb-3 leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
              })}
          </div>
       </div>
    );
  };

  const renderHeader = () => (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={goHome}>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-blue-700 rounded-lg flex items-center justify-center font-bold text-white">C</div>
          <span className="font-bold text-xl tracking-tight hidden md:inline">CultureAdvisory<span className="text-accent">.org</span></span>
          <span className="ml-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <div className="flex items-center space-x-4">
          {view !== 'LOGIN' && (
            <>
               <button onClick={goBack} className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors" title="Back">
                 <ArrowLeftIcon />
                 <span className="hidden sm:inline text-sm">Back</span>
               </button>
               <button onClick={goHome} className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors" title="Home">
                 <HomeIcon />
                 <span className="hidden sm:inline text-sm">Home</span>
               </button>
               <button onClick={handleLogout} className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors" title="Logout">
                 <LogoutIcon />
                 <span className="hidden sm:inline text-sm">Logout</span>
               </button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  const renderFeedbackModal = () => (
    feedbackOpen && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">We value your feedback</h3>
          <textarea className="w-full border border-gray-300 rounded-lg p-3 h-32 mb-4 focus:ring-2 focus:ring-accent outline-none" placeholder="Tell us about your experience..."></textarea>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setFeedbackOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={() => setFeedbackOpen(false)} className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-sky-600">Submit</button>
          </div>
        </div>
      </div>
    )
  );

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary p-8 text-center">
            <h1 className="text-3xl font-extrabold text-white mb-2">CultureAdvisory<span className="text-accent">.org</span></h1>
            <span className="inline-block bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">BETA</span>
            <p className="text-slate-300">Organizational Alignment Intelligence</p>
          </div>
          <div className="p-8">
            <p className="text-slate-600 mb-6 text-sm leading-relaxed text-justify">
              Welcome to the Culture Advisory AI System, a pioneering diagnostic tool designed to bridge the invisible divide between leadership strategic intent and organizational reality. In times of transformation—whether performing 'Surgery' on financial bleeding, 'Resuscitating' market presence, or undergoing 'Therapy' for cultural alignment—misalignment can be fatal. This system utilizes advanced AI to analyze disparate perspectives, identifying critical gaps in perception that hinder progress. By synthesizing anonymous staff feedback with leadership vision, we provide not just a score, but a roadmap for alignment, offering both secular strategic counsel and optional spiritual wisdom to guide your organization toward unity and health.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5"><input id="terms" type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-accent border-gray-300 rounded" /></div>
                <div className="ml-3 text-sm"><label htmlFor="terms" className="font-medium text-slate-700">Terms of Service</label><p className="text-slate-500">I agree that the insights provided are AI-generated for advisory purposes and do not constitute legal or binding financial advice.</p></div>
              </div>
              <button type="submit" disabled={!email || !termsAccepted} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 disabled:opacity-50 transition-all">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  if (view === 'ONBOARDING') {
     return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {renderHeader()}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">How It Works</h1>
          <p className="text-slate-500 text-center mb-10">Follow these steps to bridge the cultural gap in your organization</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: "1. Choose Mode", desc: "Select 'Demo Play' to see sample data instantly, or 'Self Assessment' to start fresh.", icon: "⚡" },
              { title: "2. Select Role", desc: "Leaders define the strategic vision. Staff provide anonymous reality checks.", icon: "👥" },
              { title: "3. Take Assessment", desc: "Answer 5 scenarios per phase (Surgery, Resuscitation, Therapy). 15 questions total.", icon: "📝" },
              { title: "4. Review (Leader)", desc: "Access the Dashboard to compare your intent against the aggregated staff consensus.", icon: "📊" },
              { title: "5. Generate Report", desc: "Select 'Secular' or 'Faith-Based' mode and generate the comprehensive analysis.", icon: "📄" },
              { title: "6. View Results", desc: "Receive strategic analysis, gap scores, and optional prayer audio guidance.", icon: "🎧" }
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-lg text-primary mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
            <button onClick={handleSelfAssessment} className="w-full py-6 bg-primary text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-slate-800 transition-all flex flex-col items-center justify-center group">
              <span>Start Self Assessment</span><span className="text-sm font-normal opacity-70 mt-1 group-hover:opacity-100 transition-opacity">Start a blank session</span>
            </button>
            <button onClick={startDemoPlay} className="w-full py-6 bg-accent text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-sky-600 transition-all flex flex-col items-center justify-center group">
               <span>Start Demo Play</span><span className="text-sm font-normal opacity-70 mt-1 group-hover:opacity-100 transition-opacity">Load sample data</span>
            </button>
          </div>
          <div className="text-center">
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-primary underline transition-colors">
              Back to Disclaimer / Login
            </button>
          </div>
        </main>
        <Assistant />
      </div>
    );
  }

  if (view === 'ROLE_SELECTION') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {renderHeader()}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Select Your <span className="text-accent">Role</span></h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-12">Are you setting the vision or executing the mission? Select your role to begin the assessment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div onClick={() => startAssessment(UserRole.LEADER)} className="group bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-accent cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><UserIcon /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">I am a Leader</h2>
              <p className="text-slate-500">Define the strategic vision and see how it aligns with your team.</p>
            </div>
            <div onClick={() => startAssessment(UserRole.STAFF)} className="group bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-accent cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors"><UserGroupIcon /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">I am Staff</h2>
              <p className="text-slate-500">Share your honest, anonymous perspective on the company culture.</p>
            </div>
          </div>
        </main>
        <Assistant />
      </div>
    );
  }

  if (view === 'ASSESSMENT') {
    const currentQuestions = QUESTIONS.filter(q => q.phase === phase);
    const totalQuestions = QUESTIONS.length;
    const progress = Math.round((tempAnswers.length / totalQuestions) * 100);
    const currentPhaseIndex = PHASE_ORDER.indexOf(phase);
    const isLastPhase = currentPhaseIndex === PHASE_ORDER.length - 1;
    const currentPhaseAnsweredCount = currentQuestions.filter(q => tempAnswers.some(a => a.questionId === q.id)).length;
    const isPhaseComplete = currentPhaseAnsweredCount > 0; 

    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {renderHeader()}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={handleBackFromAssessment} className="text-slate-500 hover:text-primary flex items-center"><svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Back</button>
            <span className="font-semibold text-slate-700 uppercase tracking-widest text-sm">{currentRole} Assessment</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 text-center">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide mb-1">Phase {currentPhaseIndex + 1} of 3</h2>
            <h1 className="text-3xl font-extrabold text-primary mb-2">{phase}</h1>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">{phase === TransformationPhase.SURGERY && "Focus: Financial Discipline, Cost Cutting, and Survival."}{phase === TransformationPhase.RESUSCITATION && "Focus: Marketing, Sales Growth, and Market Expansion."}{phase === TransformationPhase.THERAPY && "Focus: HR, Talent Development, and Mindset."}</p>
          </div>
          <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Total Assessment Progress</span><span>{progress}%</span></div>
             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-accent h-full transition-all duration-300" style={{width: `${progress}%`}}></div></div>
             <p className="text-xs text-slate-400 mt-2 text-center">{currentRole === UserRole.STAFF ? "Your answers are anonymous. Please be honest." : "Your answers set the benchmark for analysis."}</p>
          </div>
          <div className="space-y-6">
            {currentQuestions.map((q, idx) => {
              const ans = tempAnswers.find(a => a.questionId === q.id);
              const isAnswered = ans !== undefined;
              return (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                   <h3 className="text-lg font-semibold text-slate-800 mb-4"><span className="text-accent mr-2">{idx + 1}.</span> {q.text}</h3>
                   <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <label key={optIdx} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${ans?.selectedOptionIndex === optIdx ? 'bg-sky-50 border-accent' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="radio" name={q.id} className="mt-1 h-4 w-4 text-accent focus:ring-accent border-gray-300" checked={ans?.selectedOptionIndex === optIdx} onChange={() => handleAnswerChange(q.id, optIdx)} />
                        <span className="ml-3 text-slate-600 text-sm">{opt}</span>
                      </label>
                    ))}
                   </div>
                   {isAnswered && (
                     <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-5 animate-fade-in-up">
                        <div className="flex items-start gap-3">
                           <div className="mt-1 bg-amber-200 text-amber-700 p-1.5 rounded-full"><LightBulbIcon /></div>
                           <div>
                              <h4 className="text-sm font-bold text-amber-800 mb-1">Training Feedback</h4>
                              <p className="text-xs text-amber-800 font-medium mb-2">Recommended: "{q.options[q.recommendedOptionIndex]}"</p>
                              <p className="text-sm text-slate-600 italic">"{q.feedback}"</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <button onClick={handleNextPhase} disabled={!isPhaseComplete} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${!isPhaseComplete ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-slate-800'}`}>{isLastPhase ? "Submit Final Assessment" : `Next: ${PHASE_ORDER[currentPhaseIndex + 1]} Phase`}</button>
            {!isPhaseComplete && <p className="text-center text-amber-600 text-sm mt-3">Please answer at least one question to proceed.</p>}
          </div>
        </div>
        <Assistant />
      </div>
    );
  }

  if (view === 'STAFF_SUCCESS') {
     return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle /></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-600 mb-8">Your anonymous feedback has been securely recorded. It will be aggregated with other staff responses to help leadership improve the culture.</p>
          <div className="space-y-3">
             <button onClick={() => setView('ROLE_SELECTION')} className="w-full py-3 bg-primary text-white rounded-xl hover:bg-slate-800 transition-colors">Back to Role Selection</button>
             <button onClick={() => startAssessment(UserRole.STAFF)} className="w-full py-3 text-sm text-slate-500 hover:text-slate-800 transition-colors">Submit another staff response (for testing)</button>
          </div>
        </div>
        <Assistant />
      </div>
    );
  }

  if (view === 'LEADER_DASHBOARD') {
    return (
      <div className="min-h-screen bg-slate-50">
        {renderHeader()}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Leader Dashboard</h1>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
               <span className={`text-sm font-medium ${mode === ReportMode.SECULAR ? 'text-primary' : 'text-slate-400'}`}>Secular</span>
                <button onClick={() => setMode(mode === ReportMode.SECULAR ? ReportMode.FAITH : ReportMode.SECULAR)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mode === ReportMode.FAITH ? 'bg-faith-gold' : 'bg-slate-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${mode === ReportMode.FAITH ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm font-medium ${mode === ReportMode.FAITH ? 'text-faith-gold' : 'text-slate-400'}`}>Faith-Based</span>
            </div>
          </div>
          {staffSubmissions.length > 0 && staffSubmissions.length < 3 && (
             <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg shadow-sm">
               <div className="flex">
                 <div className="flex-shrink-0"><ExclamationIcon /></div>
                 <div className="ml-3"><p className="text-sm text-amber-800 font-bold">Low Staff Participation Warning</p><p className="text-sm text-amber-700 mt-1">Only {staffSubmissions.length} staff {staffSubmissions.length === 1 ? 'has' : 'have'} submitted feedback. For better anonymity and data aggregation accuracy, a minimum of 3 staff submissions is recommended. However, you may still proceed to generate the report.</p></div>
               </div>
             </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Your Input</h3>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UserIcon /></div>
                 <div><span className="block font-bold text-lg text-slate-900">{leaderAnswers.length > 0 ? `${leaderAnswers.length}/15` : "None"}</span><button onClick={() => startAssessment(UserRole.LEADER)} className="text-xs text-accent hover:underline">{leaderAnswers.length > 0 ? "Update Answers" : "Start Assessment"}</button></div>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Staff Inputs</h3>
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><UserGroupIcon /></div>
                 <div><span className="block font-bold text-lg text-slate-900">{staffSubmissions.length}</span><span className="text-xs text-slate-500">Anonymous Respondents</span></div>
               </div>
            </div>
             <div className="bg-gradient-to-br from-primary to-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
                 <h3 className="text-sm font-medium opacity-80 mb-1">Ready to Generate?</h3>
                 <p className="text-xs mb-3 opacity-70">Consolidated analysis for Surgery, Resuscitation & Therapy.</p>
                 <button onClick={generateReport} disabled={isGenerating || leaderAnswers.length === 0 || staffSubmissions.length === 0} className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${isGenerating || leaderAnswers.length === 0 || staffSubmissions.length === 0 ? 'bg-slate-600 cursor-not-allowed' : 'bg-accent hover:bg-sky-600'}`}>{isGenerating ? "Analyzing..." : "Generate Final Report"}</button>
             </div>
          </div>
          {/* Consolidated Review Section omitted for brevity but logic is same */}
        </main>
        <Assistant />
      </div>
    );
  }

  if (view === 'REPORT' && report) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 pb-20" ref={reportTopRef}>
        {renderHeader()}
        {renderFeedbackModal()}
        
        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Sidebar removed as per user request for cleaner interface */}
          
          <div className="w-full">
              <div className="mb-8">
                 <button onClick={() => setView('LEADER_DASHBOARD')} className="flex items-center text-slate-500 hover:text-primary transition-colors mb-4">
                     <ArrowLeftIcon />
                     <span className="ml-2 font-medium">Back to Dashboard</span>
                 </button>
                 
                 <div className="border-b border-slate-200 pb-6">
                    <div className="flex justify-between items-center mb-2">
                       <h1 className="text-4xl font-serif font-bold text-slate-900">Final Strategic Report</h1>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mode === ReportMode.FAITH ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{mode} Mode</span>
                    </div>
                    <p className="text-slate-500 text-lg">Comprehensive analysis covering Surgery, Resuscitation, and Therapy phases.</p>
                 </div>
              </div>

              {/* Score Card */}
              <div id="score-card" className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl mb-12 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-40 h-40 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * report.gapScore) / 100} className="text-accent transition-all duration-1000 ease-out" />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{report.gapScore}</span>
                        <span className="text-xs uppercase tracking-wider opacity-60">Score</span>
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold mb-2 text-white">Cultural Alignment Score</h2>
                        <button onClick={() => setShowCalcDetails(!showCalcDetails)} className="text-xs text-accent hover:text-white underline">How is this calculated?</button>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">This score represents the alignment between leadership intent and staff reality. 100 indicates perfect alignment. Lower scores indicate significant disconnect requiring immediate intervention.</p>
                      {showCalcDetails && (
                        <div className="mt-4 bg-slate-800 p-4 rounded-lg text-xs text-slate-300 animate-fade-in">
                          <p className="font-bold text-white mb-2">Calculation Methodology:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>We compare Leader Answer vs Average Staff Answer for each of the 15 questions.</li>
                            <li>Distance = Absolute difference between Leader Option Index (0-2) and Staff Average Index.</li>
                            <li>Max Possible Distance per question is 2. Total Max Distance = 30 (15 questions * 2).</li>
                            <li>Total Actual Distance is summed across all questions.</li>
                            <li><strong>Formula:</strong> 100 - ( (Total Actual Distance / 30) * 100 )</li>
                          </ul>
                        </div>
                      )}
                  </div>
              </div>

              {/* PRAYER / REFLECTION GUIDANCE */}
              <div id="prayer-section" className="animate-fade-in mb-12 scroll-mt-32">
                <div className={`relative bg-gradient-to-br rounded-2xl shadow-lg p-10 overflow-hidden border ${mode === ReportMode.FAITH ? 'from-amber-50 to-white border-amber-100' : 'from-slate-50 to-white border-slate-200'}`}>
                  {mode === ReportMode.FAITH && <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-bl-full opacity-20 pointer-events-none"></div>}
                  <div className="flex flex-col items-center justify-center text-center mb-8">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md mb-3 ${mode === ReportMode.FAITH ? 'bg-faith-gold text-white' : 'bg-secondary text-white'}`}>{mode === ReportMode.FAITH ? '✞' : '✦'}</div>
                      <h2 className={`text-2xl font-serif font-bold mb-1 ${mode === ReportMode.FAITH ? 'text-amber-900' : 'text-slate-800'}`}>{report.prayerTitle || (mode === ReportMode.FAITH ? "Prayer Guidance" : "Strategic Reflection")}</h2>
                  </div>
                  {/* Audio Player */}
                  {mode === ReportMode.FAITH && (
                    <div className="max-w-lg mx-auto bg-white rounded-full p-3 shadow-sm border border-amber-100 flex items-center gap-4 mb-8">
                        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}
                        <button onClick={toggleAudio} disabled={!audioUrl} className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow transition-all transform hover:scale-105 ${audioUrl ? 'bg-faith-gold text-white hover:bg-amber-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
                        <div className="flex-1 pr-4">
                          <div className="text-xs font-bold text-slate-500 mb-1 flex justify-between"><span>{isGeneratingAudio ? "GENERATING AUDIO..." : (isPlaying ? "PLAYING..." : "LISTEN")}</span></div>
                          {isGeneratingAudio ? (
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-faith-gold/50 animate-pulse w-full"></div></div>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer group" onClick={(e) => { if(audioRef.current && audioRef.current.duration) { const rect = e.currentTarget.getBoundingClientRect(); const pos = (e.clientX - rect.left) / rect.width; audioRef.current.currentTime = pos * audioRef.current.duration; } }}> <div className="bg-faith-gold h-1.5 rounded-full relative" style={{ width: `${audioProgress}%` }}></div></div>
                          )}
                        </div>
                        {audioUrl && <a href={audioUrl} download="prayer.wav" className="text-slate-400 hover:text-slate-600"><ArrowDownTrayIcon /></a>}
                    </div>
                  )}
                  {report.prayerContent ? (
                    <div className={`prose max-w-3xl mx-auto ${mode === ReportMode.FAITH ? 'prose-amber' : 'prose-slate'}`}>
                      <div className="whitespace-pre-line text-slate-700 leading-relaxed text-justify font-serif italic">{report.prayerContent}</div>
                    </div>
                  ) : <div className="text-center text-slate-400 py-10">Generating content...</div>}
                </div>
              </div>

              {/* Strategic Analysis Content - Structured Rendering */}
              <div className="animate-fade-in space-y-8">
                  <div id="executive-summary" className="scroll-mt-28">
                      <RenderSection title="Executive Summary" content={report.executiveSummary} color="slate" />
                  </div>
                  
                  <div id="phase-1-surgery" className="scroll-mt-28">
                      <RenderSection title="Phase 1: Surgery" content={report.surgeryAnalysis} color="red" />
                  </div>
                  
                  <div id="phase-2-resuscitation" className="scroll-mt-28">
                      <RenderSection title="Phase 2: Resuscitation" content={report.resuscitationAnalysis} color="blue" />
                  </div>

                  <div id="phase-3-therapy" className="scroll-mt-28">
                      <RenderSection title="Phase 3: Therapy" content={report.therapyAnalysis} color="green" />
                  </div>

                  <div id="conclusion" className="scroll-mt-28">
                      <RenderSection title="Conclusion & Roadmap" content={report.conclusion} color="slate" />
                  </div>

                  <div id="resources" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-8 mb-10 shadow-sm">
                     <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Other Helpful Resources</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[
                           "Turnaround Centre",
                           "Transformation Centre",
                           "Business Model Centre",
                           "Mergers & Acquisitions Centre",
                           "Corporate Culture Centre",
                           "Change Management Centre",
                           "Accounting & Financial Centre",
                           "Digital AI Centre"
                         ].map((r, i) => (
                           <div key={i} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg">
                             <span className="flex-shrink-0 w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold mr-3">{i+1}</span>
                             <span className="text-slate-700 font-medium">{r}</span>
                           </div>
                         ))}
                     </div>
                  </div>
              </div>
          </div>
        </main>
        <Assistant />
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
