'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, MailWarning, VenetianMask, Globe, Eye, 
  Code, Terminal, FileCode2, Braces, AlertTriangle, ShieldCheck
} from 'lucide-react';

const SlideIntro = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-[#FBBF24] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 transform -rotate-3"
    >
      <Terminal className="w-20 h-20 text-[#1A1A1A]" />
    </motion.div>
    <div className="space-y-1">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 Computer Science // Revision</p>
      <h1 className="text-6xl md:text-8xl font-serif font-black leading-tight italic tracking-tighter text-[#1A1A1A]">
        KS3 Exam<br/>Concepts
      </h1>
    </div>
    <div className="mt-8 p-5 bg-white border-2 border-black flex items-center space-x-4 max-w-2xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <ShieldCheck className="text-[#3B82F6] w-10 h-10 flex-shrink-0" />
      <p className="text-[#1A1A1A] font-bold text-lg text-left">
        Interactive study guide covering Cybersecurity, Logic Gates, Python Basics, Selection, Arrays, and Web Development.
      </p>
    </div>
  </div>
);

const SlideCyber = () => (
  <div className="flex flex-col h-full space-y-8">
    <header className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter">Cybersecurity<br/>Threats</h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 01</span>
      </div>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
      
      {/* Phishing */}
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Threat_01</div>
        <div className="border-l-4 border-[#3B82F6] pl-4 py-2 mb-4">
          <h3 className="font-bold text-2xl italic flex items-center gap-3">
            <MailWarning size={28} className="text-[#3B82F6]" /> Phishing
          </h3>
        </div>
        <p className="font-mono text-sm leading-relaxed p-3 bg-black text-white flex-grow">
          Sending a fake email or message to trick a user into giving personal information.
        </p>
        <div className="mt-4 bg-[#FBBF24] p-3 text-sm font-bold border-2 border-black flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Spot it: Urgent messages, links to fake login pages.</span>
        </div>
      </div>

      {/* Blagging */}
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Threat_02</div>
        <div className="border-l-4 border-[#3B82F6] pl-4 py-2 mb-4">
          <h3 className="font-bold text-2xl italic flex items-center gap-3">
            <VenetianMask size={28} className="text-[#3B82F6]" /> Blagging
          </h3>
        </div>
        <p className="font-mono text-sm leading-relaxed p-3 bg-black text-white flex-grow">
          Pretending to be someone trusted in order to get private information from a person.
        </p>
        <div className="mt-4 bg-[#FBBF24] p-3 text-sm font-bold border-2 border-black">
          Danger: Tricking people into giving away network access.
        </div>
      </div>

      {/* Pharming */}
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Threat_03</div>
        <div className="border-l-4 border-[#3B82F6] pl-4 py-2 mb-4">
          <h3 className="font-bold text-2xl italic flex items-center gap-3">
            <Globe size={28} className="text-[#3B82F6]" /> Pharming
          </h3>
        </div>
        <p className="font-mono text-sm leading-relaxed p-3 bg-black text-white flex-grow">
          Redirecting a user to a fake website, even when the correct web address is typed.
        </p>
      </div>

      {/* Shoulder Surfing */}
      <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Threat_04</div>
        <div className="border-l-4 border-[#3B82F6] pl-4 py-2 mb-4">
          <h3 className="font-bold text-2xl italic flex items-center gap-3">
            <Eye size={28} className="text-[#3B82F6]" /> Shoulder Surfing
          </h3>
        </div>
        <p className="font-mono text-sm leading-relaxed p-3 bg-black text-white flex-grow">
          Looking at someone else entering private information, such as a password or PIN code.
        </p>
        <div className="mt-4 bg-[#FBBF24] p-3 text-sm font-bold border-2 border-black flex items-start">
          <span>Protection: Shield your screen/keyboard in public areas.</span>
        </div>
      </div>

    </div>
  </div>
);

const SlideLogic = () => (
  <div className="flex flex-col h-full space-y-8">
    <header className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter">Logic Gates<br/>& Truth Tables</h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 02</span>
      </div>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
      
      {/* NOT Gate */}
      <div className="bg-white border-2 border-black p-6 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Gate_NOT</div>
        <h3 className="text-2xl font-bold mb-6 italic w-full text-left border-l-4 border-[#3B82F6] pl-3 py-1">NOT Gate</h3>
        <svg width="120" height="70" viewBox="0 0 100 60" className="text-black mb-8" aria-label="NOT Gate Diagram">
          <path d="M20,10 L70,30 L20,50 Z" fill="#FBBF24" stroke="currentColor" strokeWidth="4"/>
          <circle cx="78" cy="30" r="8" fill="white" stroke="currentColor" strokeWidth="4"/>
          <line x1="0" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="4"/>
          <line x1="86" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="4"/>
        </svg>
        <table className="w-full text-center border-collapse border-2 border-black font-mono text-sm mb-4">
          <thead>
            <tr className="bg-[#3B82F6] text-white border-b-2 border-black">
              <th className="p-3 border-r-2 border-black">A</th>
              <th className="p-3">OUT</th>
            </tr>
          </thead>
          <tbody className="bg-white font-bold">
            <tr className="border-b-2 border-black">
              <td className="p-3 border-r-2 border-black">0</td>
              <td className="p-3">1</td>
            </tr>
            <tr>
              <td className="p-3 border-r-2 border-black">1</td>
              <td className="p-3">0</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-auto text-xs font-mono font-bold w-full p-3 bg-black text-white text-center rounded-sm">Inverts the input.</p>
      </div>

      {/* AND Gate */}
      <div className="bg-white border-2 border-black p-6 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Gate_AND</div>
        <h3 className="text-2xl font-bold mb-6 italic w-full text-left border-l-4 border-[#3B82F6] pl-3 py-1">AND Gate</h3>
        <svg width="120" height="70" viewBox="0 0 100 60" className="text-black mb-8" aria-label="AND Gate Diagram">
          <path d="M20,10 L50,10 A20,20 0 0,1 50,50 L20,50 Z" fill="#FBBF24" stroke="currentColor" strokeWidth="4"/>
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="4"/>
          <line x1="0" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="4"/>
          <line x1="70" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="4"/>
        </svg>
        <table className="w-full text-center border-collapse border-2 border-black font-mono text-sm mb-4">
          <thead>
            <tr className="bg-[#3B82F6] text-white border-b-2 border-black">
              <th className="p-2 border-r-2 border-black">A</th>
              <th className="p-2 border-r-2 border-black">B</th>
              <th className="p-2">OUT</th>
            </tr>
          </thead>
          <tbody className="bg-white font-bold">
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2">0</td>
            </tr>
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2">0</td>
            </tr>
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2">0</td>
            </tr>
            <tr>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 bg-[#FBBF24]">1</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-auto text-xs font-mono font-bold w-full p-3 bg-black text-white text-center rounded-sm">1 ONLY if both are 1.</p>
      </div>

      {/* OR Gate */}
      <div className="bg-white border-2 border-black p-6 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Gate_OR</div>
        <h3 className="text-2xl font-bold mb-6 italic w-full text-left border-l-4 border-[#3B82F6] pl-3 py-1">OR Gate</h3>
        <svg width="120" height="70" viewBox="0 0 100 60" className="text-black mb-8" aria-label="OR Gate Diagram">
          <path d="M20,10 Q35,30 20,50 C40,50 65,45 75,30 C65,15 40,10 20,10 Z" fill="#FBBF24" stroke="currentColor" strokeWidth="4"/>
          <line x1="0" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="4"/>
          <line x1="0" y1="40" x2="24" y2="40" stroke="currentColor" strokeWidth="4"/>
          <line x1="75" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="4"/>
        </svg>
        <table className="w-full text-center border-collapse border-2 border-black font-mono text-sm mb-4">
          <thead>
            <tr className="bg-[#3B82F6] text-white border-b-2 border-black">
              <th className="p-2 border-r-2 border-black">A</th>
              <th className="p-2 border-r-2 border-black">B</th>
              <th className="p-2">OUT</th>
            </tr>
          </thead>
          <tbody className="bg-white font-bold">
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2">0</td>
            </tr>
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 bg-[#FBBF24]">1</td>
            </tr>
            <tr className="border-b-2 border-black">
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 border-r-2 border-black">0</td>
              <td className="p-2 bg-[#FBBF24]">1</td>
            </tr>
            <tr>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 border-r-2 border-black">1</td>
              <td className="p-2 bg-[#FBBF24]">1</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-auto text-xs font-mono font-bold w-full p-3 bg-black text-white text-center rounded-sm">1 if AT LEAST ONE is 1.</p>
      </div>

    </div>
  </div>
);

const SlidePythonBasic = () => (
  <div className="flex flex-col h-full space-y-6">
    <header className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter">Python Basics</h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 03.1</span>
      </div>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
      <div className="space-y-6 md:pr-4">
        <div className="bg-white border-2 text-left border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2 italic">
            <Terminal className="text-[#3B82F6]" size={24} /> Output & Variables
          </h3>
          <div className="bg-black p-4 font-mono text-sm text-[#FBBF24]">
            <div className="text-white">print<span className="text-[#3B82F6]">(</span><span className="text-[#FBBF24]">&quot;Welcome to Computing&quot;</span><span className="text-[#3B82F6]">)</span></div>
            <div className="mt-4 text-gray-400"># Variables store data</div>
            <div><span className="text-white">name</span> = <span className="text-[#FBBF24]">&quot;Aisha&quot;</span></div>
            <div><span className="text-white">age</span> = <span className="text-[#3B82F6]">14</span></div>
            <div className="mt-2 text-white">print<span className="text-[#3B82F6]">(name, </span><span className="text-[#FBBF24]">&quot;is&quot;</span><span className="text-[#3B82F6]">, age, </span><span className="text-[#FBBF24]">&quot;years old&quot;</span><span className="text-[#3B82F6]">)</span></div>
          </div>
          <div className="mt-4 bg-[#F0FDF4] p-3 border-2 border-black font-mono text-sm">
            <span className="font-bold text-black border-b border-black pb-1 mb-1 block">Output:</span>
            Welcome to Computing<br/>
            Aisha is 14 years old
          </div>
        </div>

        <div className="bg-white border-2 text-left border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2 italic">
            <Code className="text-[#3B82F6]" size={24} /> Input
          </h3>
          <div className="bg-black p-4 font-mono text-sm text-white">
            <div><span className="text-white">subject</span> = <span className="text-[#3B82F6]">input</span><span className="text-[#3B82F6]">(</span><span className="text-[#FBBF24]">&quot;Favourite subject? &quot;</span><span className="text-[#3B82F6]">)</span></div>
            <div className="mt-2 text-white">print<span className="text-[#3B82F6]">(</span><span className="text-[#FBBF24]">&quot;Your favourite subject is&quot;</span><span className="text-[#3B82F6]">, subject)</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start relative">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Types_Def</div>
        <h3 className="text-2xl font-bold text-black mb-4 italic">Data Types</h3>
        <p className="text-black mb-6">Computers need to know what type of data is being stored.</p>
        
        <table className="w-full text-left border-collapse border-2 border-black">
          <thead>
            <tr className="bg-[#3B82F6] text-white flex flex-col sm:table-row border-b-2 border-black">
              <th className="p-4 hidden sm:table-cell w-1/3 border-r-2 border-black">Value Example</th>
              <th className="p-4 hidden sm:table-cell">Data Type</th>
            </tr>
          </thead>
          <tbody className="flex flex-col sm:table-row-group">
            <tr className="border-b-2 border-black flex sm:table-row flex-col bg-white">
              <td className="p-3 sm:p-4 font-mono text-[#FBBF24] bg-black text-lg w-full sm:w-auto border-r-2 border-black border-b-2 sm:border-b-0">&quot;Computing&quot;</td>
              <td className="p-3 sm:p-4 font-bold text-black flex items-center w-full sm:w-auto">String <span className="font-normal text-xs ml-2 opacity-60">(Text)</span></td>
            </tr>
            <tr className="border-b-2 border-black flex sm:table-row flex-col bg-white">
              <td className="p-3 sm:p-4 font-mono text-white bg-black text-lg w-full sm:w-auto border-r-2 border-black border-b-2 sm:border-b-0">15</td>
              <td className="p-3 sm:p-4 font-bold text-black flex items-center w-full sm:w-auto">Integer <span className="font-normal text-xs ml-2 opacity-60">(Whole Number)</span></td>
            </tr>
            <tr className="border-b-2 border-black flex sm:table-row flex-col bg-white">
              <td className="p-3 sm:p-4 font-mono text-[#3B82F6] bg-black text-lg w-full sm:w-auto border-r-2 border-black border-b-2 sm:border-b-0">3.75</td>
              <td className="p-3 sm:p-4 font-bold text-black flex items-center w-full sm:w-auto">Float <span className="font-normal text-xs ml-2 opacity-60">(Decimal Number)</span></td>
            </tr>
            <tr className="flex sm:table-row flex-col border-b-2 sm:border-0 border-black bg-white">
              <td className="p-3 sm:p-4 font-mono text-white bg-black text-lg w-full sm:w-auto border-r-2 border-black border-b-2 sm:border-b-0">True</td>
              <td className="p-3 sm:p-4 font-bold text-black flex items-center w-full sm:w-auto">Boolean <span className="font-normal text-xs ml-2 opacity-60">(True / False)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const SlidePythonSelection = () => (
  <div className="flex flex-col h-full space-y-6">
    <header className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter">Python Selection</h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 03.2</span>
      </div>
    </header>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      <div className="bg-black border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-4 -left-4 bg-[#3B82F6] text-white px-3 py-1 font-bold border-2 border-black transform -rotate-6">grade_checker.py</div>
        <div className="font-mono text-base md:text-lg text-white space-y-2 mt-4">
          <div><span className="text-white">score</span> = <span className="text-[#3B82F6]">72</span></div>
          <br/>
          <div><span className="text-[#FBBF24] font-bold">if</span> <span className="text-white">score</span> <span className="text-[#3B82F6]">&gt;=</span> <span className="text-[#3B82F6]">50</span>:</div>
          <div className="pl-8 text-white">print<span className="text-[#3B82F6]">(</span><span className="text-[#FBBF24]">&quot;Pass&quot;</span><span className="text-[#3B82F6]">)</span></div>
          <div><span className="text-[#FBBF24] font-bold">else</span>:</div>
          <div className="pl-8 text-white">print<span className="text-[#3B82F6]">(</span><span className="text-[#FBBF24]">&quot;Try again&quot;</span><span className="text-[#3B82F6]">)</span></div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={64} />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3 italic">Execution Flow</h3>
          <p className="text-black text-lg relative z-10 leading-relaxed">
            Because <strong>72</strong> is greater than or equal to <strong>50</strong>, the condition is true.
            Therefore, it will print <span className="font-mono bg-black text-[#FBBF24] px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block translate-y-[-2px]">Pass</span>.
          </p>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          <h3 className="text-2xl font-bold text-black mb-4 italic">Comparison Operators</h3>
          <ul className="space-y-4">
            <li className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-black border-l-4 border-[#3B82F6] pl-4">
               <span className="font-mono font-bold text-white bg-black border-2 border-black px-3 py-1 shadow-sm">==</span>
              <span><strong>Equal to</strong> <code className="text-sm bg-gray-100 border border-gray-300 px-2 ml-2">if pwd == &quot;123&quot;:</code></span>
            </li>
            <li className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-black border-l-4 border-[#3B82F6] pl-4">
               <span className="font-mono font-bold text-white bg-black border-2 border-black px-3 py-1 shadow-sm">&gt;=</span>
              <span><strong>Greater than/equal</strong> <code className="text-sm bg-gray-100 border border-gray-300 px-2 ml-2">if temp &gt;= 38:</code></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SlidePythonArrays = () => (
  <div className="flex flex-col h-full space-y-6">
    <header className="flex justify-between items-start mb-2">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter">Python Arrays <br/><span className="text-2xl text-black/50 tracking-normal">(Lists)</span></h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 04</span>
      </div>
    </header>

    <div className="mt-8 bg-black border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center pb-12 relative flex-grow">
      <div className="absolute -top-4 -left-4 bg-[#3B82F6] text-white px-3 py-1 font-bold border-2 border-black transform -rotate-3 text-sm">array_memory.py</div>
      <div className="font-mono text-lg md:text-xl lg:text-2xl text-white mb-12 overflow-x-auto whitespace-nowrap pt-4 pb-4 border-b-2 border-dashed border-gray-700">
        <span className="text-white">subjects</span> = <span className="text-[#3B82F6]">[</span>
        <span className="text-[#FBBF24]">&quot;Maths&quot;</span>, <span className="text-[#FBBF24]">&quot;English&quot;</span>, <span className="text-[#FBBF24]">&quot;Computing&quot;</span>, <span className="text-[#FBBF24]">&quot;Science&quot;</span>
        <span className="text-[#3B82F6]">]</span>
      </div>

      <div className="relative pt-4">
        <div className="absolute -top-2 w-full text-center sm:text-left text-gray-500 font-mono text-xs uppercase font-bold">Memory Representation & Indexes</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto mt-8 px-2">
          
          <div className="flex flex-col items-center relative group">
            <div className="w-full bg-[#FAF9F6] border-2 border-black text-black font-bold py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg md:text-xl transition-transform group-hover:-translate-y-1">&quot;Maths&quot;</div>
            <div className="absolute -bottom-6 font-mono font-bold text-black bg-[#FBBF24] border-2 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xl z-10 transition-transform group-hover:scale-110">0</div>
          </div>
          
          <div className="flex flex-col items-center relative group">
            <div className="w-full bg-[#FAF9F6] border-2 border-black text-black font-bold py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg md:text-xl transition-transform group-hover:-translate-y-1">&quot;English&quot;</div>
            <div className="absolute -bottom-6 font-mono font-bold text-black bg-[#FBBF24] border-2 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xl z-10 transition-transform group-hover:scale-110">1</div>
          </div>

          <div className="flex flex-col items-center relative group mt-8 lg:mt-0">
            <div className="w-full bg-[#FAF9F6] border-2 border-black text-black font-bold py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg md:text-xl transition-transform group-hover:-translate-y-1">&quot;Computing&quot;</div>
            <div className="absolute -bottom-6 font-mono font-bold text-black bg-[#FBBF24] border-2 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xl z-10 transition-transform group-hover:scale-110">2</div>
          </div>

          <div className="flex flex-col items-center relative group mt-8 lg:mt-0">
            <div className="w-full bg-[#FAF9F6] border-2 border-black text-black font-bold py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg md:text-xl transition-transform group-hover:-translate-y-1">&quot;Science&quot;</div>
            <div className="absolute -bottom-6 font-mono font-bold text-black bg-[#FBBF24] border-2 border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xl z-10 transition-transform group-hover:scale-110">3</div>
          </div>

        </div>
      </div>
    </div>

    <div className="mt-8 bg-[#3B82F6] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white relative">
      <div className="absolute top-0 right-0 p-4 opacity-20 hidden sm:block">
        <AlertTriangle size={80} />
      </div>
      <h4 className="text-2xl font-bold text-black shadow-black drop-shadow-sm mb-2 flex items-center gap-2 italic"><AlertTriangle className="w-6 h-6"/> Remember!</h4>
      <p className="text-xl">Array indexes <strong>always</strong> start at 0.</p>
      <div className="mt-4 font-mono font-bold text-white bg-black p-4 border-2 border-black inline-block overflow-x-auto w-full md:w-auto text-sm sm:text-base">
        print(subjects[2])  <span className="text-gray-500 font-normal ml-2"># Outputs &quot;Computing&quot;</span><br/>
        print(subjects[3])  <span className="text-gray-500 font-normal ml-2 mt-2 inline-block"># Outputs &quot;Science&quot;</span>
      </div>
    </div>
  </div>
);

const SlideHTMLCSS = () => (
  <div className="flex flex-col h-full space-y-6">
    <header className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#3B82F6]">Year 9 CS // KS3 Revision</p>
        <h2 className="text-5xl font-serif font-black leading-tight italic tracking-tighter flex items-center gap-4">
           HTML & CSS
        </h2>
      </div>
      <div className="flex flex-col items-end gap-2 hidden md:flex">
        <span className="px-4 py-2 bg-[#FBBF24] text-black font-bold text-sm transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">MODULE 05</span>
      </div>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow mt-4">
      
      {/* HTML Section */}
      <div className="bg-[#FAF9F6] border-2 text-left border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Markup_Language</div>
        <div className="border-l-4 border-orange-500 pl-4 py-2 mb-6">
          <h3 className="text-2xl font-bold text-black flex items-center justify-between italic">
            <span>HTML <span className="text-black/50 font-normal text-lg">(Structure)</span></span>
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="font-mono text-white font-bold border-2 border-black bg-orange-500 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit mb-2 sm:mb-0 sm:mr-4 shrink-0">{"<html>"}</div>
            <div className="text-black font-bold">The root element that wraps the entire web page content.</div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
             <div className="font-mono text-white font-bold border-2 border-black bg-orange-500 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit mb-2 sm:mb-0 sm:mr-4 shrink-0">{"<body>"}</div>
            <div className="text-black font-bold">Contains all the visible content shown on the page.</div>
          </div>
          
           <div className="flex flex-col sm:flex-row sm:items-start p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
             <div className="font-mono text-white font-bold border-2 border-black bg-orange-500 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit mb-2 sm:mb-0 sm:mr-4 shrink-0">{"<h1>"}</div>
            <div className="text-black font-bold">Creates a large main heading on the page.</div>
          </div>
          
           <div className="flex flex-col sm:flex-row sm:items-start p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="font-mono text-white font-bold border-2 border-black bg-orange-500 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit mb-2 sm:mb-0 sm:mr-4 shrink-0">{"<p>"}</div>
            <div className="text-black font-bold">Defines a normal paragraph of text.</div>
          </div>
        </div>
      </div>

      {/* CSS Section */}
      <div className="bg-[#FAF9F6] border-2 text-left border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-40 uppercase">Style_Sheets</div>
        <div className="border-l-4 border-blue-500 pl-4 py-2 mb-6">
          <h3 className="text-2xl font-bold text-black flex justify-between items-center italic">
            <span>CSS <span className="text-black/50 font-normal text-lg">(Styling)</span></span> <Braces className="text-blue-500 mr-8" />
          </h3>
        </div>
        
        <p className="text-black font-bold text-lg mb-4">We link an external CSS file inside the HTML <code className="bg-black text-white px-1">head</code> code:</p>
        <div className="bg-black border-2 border-black p-5 font-mono text-sm md:text-base text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto whitespace-nowrap">
          <span className="text-[#3B82F6]">{"<"}</span><span className="text-[#FBBF24]">link</span> <span className="text-white">rel</span>=<span className="text-[#3B82F6]">&quot;stylesheet&quot;</span> <span className="text-white">href</span>=<span className="text-[#3B82F6]">&quot;style.css&quot;</span><span className="text-[#3B82F6]">{">"}</span>
        </div>

        <div className="mt-8 bg-[#3B82F6] border-2 border-black p-6 flex-grow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h4 className="text-lg font-black text-black mb-3 uppercase tracking-wider">Why use external CSS?</h4>
          <p className="text-white font-bold leading-relaxed">
            By keeping styles in a separate file (<code className="bg-black text-[#FBBF24] border-2 border-black px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">style.css</code>), we can link the same styles to multiple HTML pages. This makes it incredibly useful for changing the design of an entire website from one single place!
          </p>
        </div>
      </div>
      
    </div>
  </div>
);

const slidesArray = [
  <SlideIntro key="1" />,
  <SlideCyber key="2" />,
  <SlideLogic key="3" />,
  <SlidePythonBasic key="4" />,
  <SlidePythonSelection key="5" />,
  <SlidePythonArrays key="6" />,
  <SlideHTMLCSS key="7" />
];


export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < slidesArray.length - 1 ? prev + 1 : prev));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <main className="h-screen max-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-sans overflow-hidden border-[12px] md:border-[16px] border-[#3B82F6]">
      
      {/* Header hidden to maximize space, just a progress bar at top */}
      <div className="h-2 w-full bg-black/10 shrink-0 border-b-[3px] border-black shadow-[0_4px_0px_0px_rgba(0,0,0,0.1)] relative z-30">
        <motion.div 
          className="h-full bg-[#FBBF24]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slidesArray.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center max-w-7xl relative min-h-0">
        
        {/* Slide Canvas */}
        <div className="w-full h-full bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 w-full p-6 md:p-10 lg:p-14 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto h-full">
                {slidesArray[currentSlide]}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Controls Footer */}
      <div className="bg-[#3B82F6] border-t-4 border-black px-4 md:px-8 py-4 flex justify-between items-center shrink-0 shadow-[0_-4px_0_0_rgba(0,0,0,1)] z-20">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 font-bold text-black border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-[0_0] active:translate-x-[4px] active:translate-y-[4px]"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">PREV</span>
        </button>
        
        <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto px-4">
          {slidesArray.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 md:w-4 md:h-4 border-2 border-black transition-all duration-300 ${
                currentSlide === idx 
                ? 'bg-[#FBBF24] scale-125 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-gray-200 hover:scale-110 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slidesArray.length - 1}
          className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 font-bold text-black border-2 border-black bg-[#FBBF24] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-[0_0] active:translate-x-[4px] active:translate-y-[4px]"
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight size={20} />
        </button>
      </div>

    </main>
  );
}
