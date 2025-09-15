import React from 'react';

interface QAProps {
  question: string;
  answer: string; // Kurzantwort <= 40 Wörter
  longAnswer?: React.ReactNode; // Optional erweiterte Beschreibung
  className?: string;
  headingLevel?: 2 | 3 | 4;
  shortAnswerOverride?: string; // Falls abweichend für data-answer-short
}

export function QA({ question, answer, longAnswer, className, headingLevel = 3, shortAnswerOverride }: QAProps) {
  const shortAnswer = shortAnswerOverride || answer;
  const headingClasses = 'text-lg font-semibold mb-1';
  return (
    <article className={className} data-gaio-block="qa" data-answer-short={shortAnswer}>
      {headingLevel === 2 && <h2 className={headingClasses}>{question}</h2>}
      {headingLevel === 3 && <h3 className={headingClasses}>{question}</h3>}
      {headingLevel === 4 && <h4 className={headingClasses}>{question}</h4>}
      <p className="text-sm text-neutral-700 mb-2 leading-relaxed" data-gaio-role="answer" aria-label="Kurzantwort">{answer}</p>
      {longAnswer && (
        <div className="text-sm text-neutral-600 space-y-2" data-gaio-role="long-answer">
          {longAnswer}
        </div>
      )}
    </article>
  );
}
