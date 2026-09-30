import React, { useState } from 'react';
import { PLATFORM_COURSES } from '../../services/mockData';
import { PaperCard, BrassPlaque, RubberStamp } from '../../components/common/SkeuoElements';
import { Course } from '../../types';
import { BookOpen, Globe, CheckCircle2, Star, ExternalLink, Filter } from 'lucide-react';

export const CourseHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PLATFORM' | 'WEB_FREE' | 'WEB_PAID'>('PLATFORM');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('ALL');

  const webFreeCourses = [
    {
      title: 'Linux Foundation Official Kubernetes & Cloud Native Architecture',
      provider: 'Linux Foundation edX',
      price: 'Free Audit',
      url: 'https://edx.org',
      skills: ['Kubernetes', 'Docker'],
      rating: 4.9,
    },
    {
      title: 'Redis In-Memory Mastery: Caching, Pub/Sub & Lua Scripting',
      provider: 'Redis University Free Tier',
      price: 'Free with Certificate',
      url: 'https://university.redis.com',
      skills: ['Redis'],
      rating: 4.95,
    },
    {
      title: 'Distributed System Concurrency in Go & Python',
      provider: 'MIT OpenCourseWare',
      price: 'Free Public Domain',
      url: 'https://ocw.mit.edu',
      skills: ['Python', 'Go'],
      rating: 4.98,
    },
  ];

  const webPaidCourses = [
    {
      title: 'Apache Kafka Event Streaming Developer Certification',
      provider: 'Confluent Academy',
      price: '$149.00',
      url: 'https://confluent.io',
      skills: ['Apache Kafka'],
      rating: 4.85,
    },
    {
      title: 'AWS Certified Solutions Architect — Associate Hardened Bootcamp',
      provider: 'Coursera Professional',
      price: '$49 / Month',
      url: 'https://coursera.org',
      skills: ['Docker', 'Kubernetes'],
      rating: 4.88,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Plaque */}
      <div
        className="wood-frame"
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', margin: 0, color: '#2b1a03' }}>
            Course Hub & Skill Gap Recommendation Guild
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-faded)', fontStyle: 'italic' }}>
            Platform modules indexed first; live web discovery via Tavily categorized into Free & Paid tiers.
          </p>
        </div>

        {/* Source Segment Tabs */}
        <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #7a5806' }}>
          <button
            onClick={() => setActiveTab('PLATFORM')}
            className={activeTab === 'PLATFORM' ? 'btn-brass' : 'btn-paper'}
            style={{ borderRadius: 0, padding: '6px 14px', fontSize: '13px' }}
          >
            <BookOpen size={14} /> Academy Modules ({PLATFORM_COURSES.length})
          </button>
          <button
            onClick={() => setActiveTab('WEB_FREE')}
            className={activeTab === 'WEB_FREE' ? 'btn-brass' : 'btn-paper'}
            style={{ borderRadius: 0, padding: '6px 14px', fontSize: '13px' }}
          >
            <Globe size={14} /> Free Web Courses ({webFreeCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('WEB_PAID')}
            className={activeTab === 'WEB_PAID' ? 'btn-brass' : 'btn-paper'}
            style={{ borderRadius: 0, padding: '6px 14px', fontSize: '13px' }}
          >
            <span>💎 Professional Certifications ({webPaidCourses.length})</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {activeTab === 'PLATFORM' &&
          PLATFORM_COURSES.map((crs) => (
            <PaperCard key={crs.id} stitched style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    {crs.provider} • {crs.duration_hours} Hours
                  </span>
                  <RubberStamp label={crs.difficulty} variant="crimson" rotate={-1} />
                </div>

                <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--ink-primary)' }}>
                  {crs.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--ink-faded)', marginBottom: '14px', lineHeight: 1.5 }}>
                  {crs.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {crs.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: '#ebd9b4',
                        color: 'var(--ink-primary)',
                      }}
                    >
                      ★ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d4be94', paddingTop: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink-stamp-green)' }}>
                  {crs.price}
                </span>
                <button
                  onClick={() => alert(`Enrolled in ${crs.title}! Progress logged into student portfolio.`)}
                  className="btn-brass"
                  style={{ fontSize: '12px', padding: '5px 14px' }}
                >
                  Enroll In Module
                </button>
              </div>
            </PaperCard>
          ))}

        {activeTab === 'WEB_FREE' &&
          webFreeCourses.map((crs, idx) => (
            <PaperCard key={idx} stitched style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    {crs.provider}
                  </span>
                  <RubberStamp label="FREE WEB" variant="verified" rotate={1} />
                </div>

                <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--ink-primary)' }}>
                  {crs.title}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0 16px 0' }}>
                  {crs.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: '#ebd9b4',
                      }}
                    >
                      Target Gap: {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d4be94', paddingTop: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink-stamp-green)' }}>
                  {crs.price}
                </span>
                <a
                  href={crs.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-paper"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  Launch Web Course <ExternalLink size={12} />
                </a>
              </div>
            </PaperCard>
          ))}

        {activeTab === 'WEB_PAID' &&
          webPaidCourses.map((crs, idx) => (
            <PaperCard key={idx} stitched style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    {crs.provider}
                  </span>
                  <RubberStamp label="CERTIFICATION" variant="crimson" rotate={-2} />
                </div>

                <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--ink-primary)' }}>
                  {crs.title}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0 16px 0' }}>
                  {crs.skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: '#ebd9b4',
                      }}
                    >
                      Target Gap: {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d4be94', paddingTop: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brass-shadow)' }}>
                  {crs.price}
                </span>
                <a
                  href={crs.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-brass"
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  Inspect Syllabus <ExternalLink size={12} />
                </a>
              </div>
            </PaperCard>
          ))}
      </div>
    </div>
  );
};
