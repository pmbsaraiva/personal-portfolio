import React, { useState, useEffect, useRef } from 'react';

const TerminalPortfolio = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { text: 'Welcome to my terminal portfolio!', type: 'system', isTyping: false, fullText: 'Welcome to my terminal portfolio!' },
    { text: 'Type "help" to see available commands.', type: 'system', isTyping: false, fullText: 'Type "help" to see available commands.' },
  ]);
  const [prompt, setPrompt] = useState('visitor@portfolio:~$');
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const [typingSpeed, setTypingSpeed] = useState(30); // Adjust typing speed (milliseconds)

  const handleCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    let result = [];

    if (command === 'help') {
      result = [
        { text: 'Available commands:', type: 'system' },
        { text: '  about       - Learn about me', type: 'system' },
        { text: '  skills      - View my technical skills', type: 'system' },
        { text: '  experience  - View my work experience', type: 'system' },
        { text: '  projects    - View my projects', type: 'system' },
        { text: '  contact     - How to reach me', type: 'system' },
        { text: '  clear       - Clear the terminal', type: 'system' },
      ];
    } else if (command === 'about') {
      result = [
        { text: '=== About Me ===', type: 'heading' },
        { text: "I'm a passionate software engineer with expertise in full-stack development.", type: 'text' },
        { text: "I love building elegant solutions to complex problems and am constantly learning new technologies.", type: 'text' },
        { text: "When I'm not coding, you can find me hiking, reading, or experimenting with new programming languages.", type: 'text' },
      ];
    } else if (command === 'skills') {
      result = [
        { text: '=== Technical Skills ===', type: 'heading' },
        { text: 'Languages:', type: 'subheading' },
        { text: '  JavaScript, TypeScript, Python, Java, C++, SQL', type: 'text' },
        { text: 'Frontend:', type: 'subheading' },
        { text: '  React, Vue, Angular, HTML5, CSS3, SASS', type: 'text' },
        { text: 'Backend:', type: 'subheading' },
        { text: '  Node.js, Express, Django, Spring Boot', type: 'text' },
        { text: 'DevOps:', type: 'subheading' },
        { text: '  Docker, Kubernetes, AWS, CI/CD, Git', type: 'text' },
      ];
    } else if (command === 'experience') {
      result = [
        { text: '=== Work Experience ===', type: 'heading' },
        { text: 'Senior Software Engineer | Tech Solutions Inc. (2022-Present)', type: 'subheading' },
        { text: '  • Led development of microservices architecture', type: 'text' },
        { text: '  • Mentored junior developers and conducted code reviews', type: 'text' },
        { text: '  • Optimized API performance by 40%', type: 'text' },
        { text: 'Software Developer | Innovate Labs (2019-2022)', type: 'subheading' },
        { text: '  • Built responsive web applications using React', type: 'text' },
        { text: '  • Implemented CI/CD pipelines reducing deployment time by 30%', type: 'text' },
        { text: '  • Collaborated with UX designers to improve user experience', type: 'text' },
      ];
    } else if (command === 'projects') {
      result = [
        { text: '=== Projects ===', type: 'heading' },
        { text: 'DevTracker (2023)', type: 'subheading' },
        { text: '  A project management tool for developers with GitHub integration', type: 'text' },
        { text: '  Tech: React, Node.js, MongoDB, GitHub API', type: 'text' },
        { text: 'SmartBudget (2022)', type: 'subheading' },
        { text: '  Personal finance application with ML-powered expense predictions', type: 'text' },
        { text: '  Tech: Python, TensorFlow, Flask, PostgreSQL', type: 'text' },
        { text: 'CodeQuest (2021)', type: 'subheading' },
        { text: '  Interactive coding learning platform for beginners', type: 'text' },
        { text: '  Tech: Vue.js, Express, Firebase', type: 'text' },
      ];
    } else if (command === 'contact') {
      result = [
        { text: '=== Contact Information ===', type: 'heading' },
        { text: 'Email: developer@example.com', type: 'text' },
        { text: 'LinkedIn: linkedin.com/in/developer', type: 'text' },
        { text: 'GitHub: github.com/developer', type: 'text' },
        { text: 'Twitter: twitter.com/developer', type: 'text' },
      ];
    } else if (command === 'clear') {
      setOutput([]);
      return;
    } else if (command === '') {
      return;
    } else {
      result = [
        { text: `Command not found: ${command}`, type: 'error' },
        { text: 'Type "help" to see available commands.', type: 'system' },
      ];
    }

    setOutput(prevOutput => [
      ...prevOutput,
      { text: `${prompt.replace('&nbsp;', ' ')}${cmd}`, type: 'command', isTyping: false, fullText: `${prompt.replace('&nbsp;', ' ')}${cmd}` },
      ...result.map(line => ({ ...line, isTyping: true, fullText: line.text, text: '' })),
    ]);
    setInput('');
  };

  useEffect(() => {
    const linesToAnimate = output.filter(line => line.isTyping);
    if (linesToAnimate.length > 0) {
      const line = linesToAnimate[0];
      const index = output.findIndex(item => item === line);
      const fullText = line.fullText;
      let currentIndex = line.text.length;

      if (currentIndex < fullText.length) {
        const interval = setInterval(() => {
          setOutput(prevOutput =>
            prevOutput.map((item, i) =>
              i === index ? { ...item, text: fullText.substring(0, currentIndex + 1) } : item
            )
          );
          currentIndex++;
          if (currentIndex === fullText.length) {
            clearInterval(interval);
            setOutput(prevOutput =>
              prevOutput.map((item, i) =>
                i === index ? { ...item, isTyping: false } : item
              )
            );
          }
        }, typingSpeed);
        return () => clearInterval(interval);
      } else if (line.isTyping) {
        setOutput(prevOutput =>
          prevOutput.map((item, i) =>
            i === index ? { ...item, isTyping: false } : item
          )
        );
      }
    }
  }, [output, typingSpeed]);

  // Handle key press events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  // Focus input on terminal click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on initial load
  useEffect(() => {
    focusInput();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      <div className="flex-grow flex flex-col items-center justify-center mb-8">
        <div className="w-full max-w-3xl">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Terminal header */}
            <div className="bg-gray-700 px-4 py-2 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto font-mono text-sm">terminal-portfolio</div>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalRef}
              className="p-4 h-96 overflow-y-auto font-mono text-sm"
              onClick={focusInput}
            >
              <div>
                {output.map((line, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${line.type === 'error' ? 'text-red-400' :
                      line.type === 'heading' ? 'text-green-400 font-bold' :
                        line.type === 'subheading' ? 'text-blue-400 font-semibold' :
                          line.type === 'command' ? 'text-purple-400' :
                            line.type === 'system' ? 'text-yellow-300' : 'text-gray-300'
                      }`}
                  >
                    {line.text}
                  </div>
                ))}

                <div className="flex">
                  <span className="text-green-400 pr-1">{prompt}</span>
                  <span>{input}</span>
                  <span className="inline-block animate-pulse text-gray-300" style={{ marginBottom: '3px' }}>_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="w-full flex justify-center space-x-6 pb-4">
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.755zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        </a>
      </div>

      {/* Hidden input for keyboard interaction */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
};

export default TerminalPortfolio;
