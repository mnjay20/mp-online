import PDFDocument from 'pdfkit';

export interface InterviewReportPdfData {
  interview_id: string;
  student: {
    name?: string;
    email?: string;
    degree?: string;
    university?: string;
  };
  career_title: string;
  interview_type: string;
  completed_at?: string | Date;
  overall_score: number;
  readiness_level: string;
  summary_evaluation: string;
  radar_metrics?: Record<string, number>;
  top_strengths?: string[];
  critical_weaknesses?: string[];
  identified_gap_skills?: string[];
  turns?: Array<{
    turn_number: number;
    question: string;
    answer: string;
    score: number;
    strengths?: string;
    weaknesses?: string;
    ideal_answer_hint?: string;
  }>;
}

export class InterviewPdfService {
  /**
   * Generates a polished, professional multi-page PDF buffer
   * for the student's mock interview performance report.
   */
  static async generateReportPdf(data: InterviewReportPdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          bufferPages: true,
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        const primaryColor = '#1e3a8a'; // Deep Navy Blue
        const secondaryColor = '#2563eb'; // Royal Blue
        const darkText = '#0f172a'; // Slate 900
        const bodyText = '#334155'; // Slate 700
        const mutedText = '#64748b'; // Slate 500
        const cardBg = '#f8fafc'; // Slate 50
        const cardBorder = '#e2e8f0'; // Slate 200
        const successColor = '#059669'; // Emerald 600
        const warningColor = '#d97706'; // Amber 600
        const dangerColor = '#dc2626'; // Red 600

        const studentName = data.student?.name || 'Student Candidate';
        const studentEmail = data.student?.email || 'N/A';
        const interviewTitle = data.career_title || 'Software Engineering Professional';
        const formattedDate = data.completed_at
          ? new Date(data.completed_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

        // -------------------------------------------------------------
        // 1. BRAND HEADER & REPORT TITLE
        // -------------------------------------------------------------
        doc.rect(40, 40, 515, 6).fill(secondaryColor);

        doc.y = 55;
        doc
          .fillColor(primaryColor)
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('MP ONLINE | AI CAREER READINESS & EMPLOYABILITY PLATFORM', {
            align: 'left',
          });

        doc
          .fillColor(mutedText)
          .fontSize(9)
          .font('Helvetica')
          .text('NATIONAL SKILL DEVELOPMENT & TALENT ASSESSMENT DIVISION', {
            align: 'left',
          });

        doc.moveDown(0.8);

        doc
          .fillColor(darkText)
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('Mock Interview Assessment & Evaluation Report');

        doc
          .fillColor(mutedText)
          .fontSize(9)
          .font('Helvetica')
          .text(`Official Session Report ID: ${data.interview_id}  |  Generated: ${formattedDate}`);

        doc.moveDown(1);

        // -------------------------------------------------------------
        // 2. CANDIDATE & SESSION METADATA CARD
        // -------------------------------------------------------------
        const metaBoxY = doc.y;
        doc.roundedRect(40, metaBoxY, 515, 75, 6).fillAndStroke(cardBg, cardBorder);

        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('CANDIDATE INFORMATION', 55, metaBoxY + 12);
        doc.fillColor(bodyText).fontSize(9).font('Helvetica');
        doc.text(`Name: `, 55, metaBoxY + 30, { continued: true }).font('Helvetica-Bold').text(studentName);
        doc.font('Helvetica').text(`Email: `, 55, metaBoxY + 45, { continued: true }).font('Helvetica-Bold').text(studentEmail);
        if (data.student?.degree) {
          doc.font('Helvetica').text(`Degree: `, 55, metaBoxY + 60, { continued: true }).font('Helvetica-Bold').text(data.student.degree);
        }

        const col2X = 310;
        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('SESSION PARAMETERS', col2X, metaBoxY + 12);
        doc.fillColor(bodyText).fontSize(9).font('Helvetica');
        doc.text(`Target Role: `, col2X, metaBoxY + 30, { continued: true }).font('Helvetica-Bold').text(interviewTitle);
        doc.font('Helvetica').text(`Interview Type: `, col2X, metaBoxY + 45, { continued: true }).font('Helvetica-Bold').text(data.interview_type || 'TECHNICAL');
        doc.font('Helvetica').text(`Status: `, col2X, metaBoxY + 60, { continued: true }).font('Helvetica-Bold').fillColor(successColor).text('COMPLETED & VERIFIED');

        doc.y = metaBoxY + 90;

        // -------------------------------------------------------------
        // 3. OVERALL SCORECARD & READINESS BADGE
        // -------------------------------------------------------------
        const scoreBoxY = doc.y;
        const scoreBoxHeight = 85;
        doc.roundedRect(40, scoreBoxY, 515, scoreBoxHeight, 6).fillAndStroke(cardBg, cardBorder);

        // Circular Score Display
        const score = Math.min(100, Math.max(0, data.overall_score || 0));
        let badgeColor = warningColor;
        let badgeLabel = 'PROGRESSING';
        if (score >= 85) {
          badgeColor = successColor;
          badgeLabel = 'EXCEPTIONAL';
        } else if (score >= 70) {
          badgeColor = secondaryColor;
          badgeLabel = 'INTERVIEW_READY';
        } else if (score < 55) {
          badgeColor = dangerColor;
          badgeLabel = 'NEEDS_WORK';
        }

        // Score Badge Box
        doc.roundedRect(55, scoreBoxY + 15, 90, 55, 6).fill(primaryColor);
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text(`${score}`, 55, scoreBoxY + 23, { width: 90, align: 'center' });
        doc.fontSize(8).font('Helvetica').text('OUT OF 100', 55, scoreBoxY + 52, { width: 90, align: 'center' });

        // Readiness Description
        doc.fillColor(darkText).fontSize(12).font('Helvetica-Bold').text('HIRING READINESS CLASSIFICATION', 160, scoreBoxY + 15);
        doc.fillColor(badgeColor).fontSize(11).font('Helvetica-Bold').text(`● ${badgeLabel}`, 160, scoreBoxY + 32);

        // Summary Text
        doc
          .fillColor(bodyText)
          .fontSize(8.5)
          .font('Helvetica')
          .text(
            data.summary_evaluation ||
              'Candidate demonstrated a structured approach with clear analytical capability. Continued focus on domain precision will maximize industry placement conversion.',
            160,
            scoreBoxY + 48,
            { width: 380, lineGap: 2 }
          );

        doc.y = scoreBoxY + scoreBoxHeight + 15;

        // -------------------------------------------------------------
        // 4. COMPETENCY RADAR / DIMENSIONAL BREAKDOWN BARS
        // -------------------------------------------------------------
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Core Competency Dimensions');
        doc.moveDown(0.4);

        const metrics = data.radar_metrics || {
          'Technical Depth & Accuracy': score,
          'Communication & Clarity': Math.min(100, score + 4),
          'Problem Solving & Architecture': Math.max(0, score - 5),
          'Industry Best Practices': score,
        };

        const barX = 40;
        let currentBarY = doc.y;
        const totalBarWidth = 515;

        Object.entries(metrics).forEach(([dimension, val]) => {
          const clampedVal = Math.min(100, Math.max(0, Number(val) || 0));
          doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text(dimension, barX, currentBarY);
          doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text(`${clampedVal}%`, barX, currentBarY, {
            width: totalBarWidth,
            align: 'right',
          });

          currentBarY += 14;
          // Background track
          doc.roundedRect(barX, currentBarY, totalBarWidth, 6, 3).fill('#e2e8f0');
          // Fill bar
          const fillWidth = Math.max(8, (totalBarWidth * clampedVal) / 100);
          const barColor = clampedVal >= 75 ? successColor : clampedVal >= 60 ? secondaryColor : warningColor;
          doc.roundedRect(barX, currentBarY, fillWidth, 6, 3).fill(barColor);

          currentBarY += 12;
        });

        doc.y = currentBarY + 5;

        // -------------------------------------------------------------
        // 5. STRENGTHS & IMPROVEMENT AREAS (Side-by-Side or Stacked)
        // -------------------------------------------------------------
        const strengthsList = (data.top_strengths && data.top_strengths.length > 0)
          ? data.top_strengths
          : ['Demonstrated clear familiarity with core development workflows', 'Communicated thought process transparently and logically'];

        const weaknessesList = (data.critical_weaknesses && data.critical_weaknesses.length > 0)
          ? data.critical_weaknesses
          : ['Could expand on trade-offs and edge case handling in technical answers', 'Incorporate concrete performance metrics when articulating past experience'];

        const colWidth = 248;
        const sectionY = doc.y;

        // Column 1: Strengths
        doc.roundedRect(40, sectionY, colWidth, 105, 6).fillAndStroke('#f0fdf4', '#bbf7d0');
        doc.fillColor(successColor).fontSize(10).font('Helvetica-Bold').text('KEY STRENGTHS DEMONSTRATED', 50, sectionY + 10);
        let sY = sectionY + 28;
        strengthsList.slice(0, 3).forEach((item) => {
          doc.fillColor(darkText).fontSize(8).font('Helvetica-Bold').text('✓ ', 50, sY, { continued: true });
          doc.font('Helvetica').fillColor(bodyText).text(item, { width: colWidth - 25, lineGap: 1 });
          sY = doc.y + 3;
        });

        // Column 2: Growth Areas
        doc.roundedRect(307, sectionY, colWidth, 105, 6).fillAndStroke('#fffbeb', '#fde68a');
        doc.fillColor(warningColor).fontSize(10).font('Helvetica-Bold').text('PRIORITY GROWTH AREAS', 317, sectionY + 10);
        let wY = sectionY + 28;
        weaknessesList.slice(0, 3).forEach((item) => {
          doc.fillColor(warningColor).fontSize(8).font('Helvetica-Bold').text('▲ ', 317, wY, { continued: true });
          doc.font('Helvetica').fillColor(bodyText).text(item, { width: colWidth - 25, lineGap: 1 });
          wY = doc.y + 3;
        });

        doc.y = sectionY + 115;

        // -------------------------------------------------------------
        // 6. RECOMMENDED SKILLS TO BRIDGE
        // -------------------------------------------------------------
        if (data.identified_gap_skills && data.identified_gap_skills.length > 0) {
          doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('RECOMMENDED SKILL REINFORCEMENTS:');
          doc.moveDown(0.2);
          const skillPills = data.identified_gap_skills.join('  •  ');
          doc.fillColor(bodyText).fontSize(8.5).font('Helvetica').text(skillPills);
          doc.moveDown(0.8);
        }

        // -------------------------------------------------------------
        // 7. QUESTION-BY-QUESTION TRANSCRIPT (PAGE 2)
        // -------------------------------------------------------------
        if (data.turns && data.turns.length > 0) {
          doc.addPage();

          doc.rect(40, 40, 515, 4).fill(primaryColor);
          doc.y = 52;
          doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Turn-by-Turn Question Evaluation');
          doc
            .fillColor(mutedText)
            .fontSize(8.5)
            .font('Helvetica')
            .text('Detailed AI breakdown of individual questions, candidate answers, and recommendations.');
          doc.moveDown(0.8);

          data.turns.forEach((turn, idx) => {
            // Check if page overflow is imminent
            if (doc.y > 660) {
              doc.addPage();
              doc.y = 50;
            }

            const turnStartY = doc.y;
            const turnBoxWidth = 515;

            // Turn Header with Score
            doc.roundedRect(40, turnStartY, turnBoxWidth, 22, 4).fill(primaryColor);
            doc
              .fillColor('#ffffff')
              .fontSize(9)
              .font('Helvetica-Bold')
              .text(`Question ${turn.turn_number || idx + 1}`, 50, turnStartY + 6);
            doc.text(`Turn Score: ${turn.score || 75}/100`, 40, turnStartY + 6, {
              width: turnBoxWidth - 10,
              align: 'right',
            });

            doc.y = turnStartY + 28;

            // Question Text
            doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text('Question Asked: ', { continued: true });
            doc.font('Helvetica').fillColor(bodyText).text(turn.question || 'N/A', { lineGap: 1 });
            doc.moveDown(0.4);

            // Candidate Answer
            doc.fillColor(darkText).fontSize(8.5).font('Helvetica-Bold').text('Candidate Answer: ', { continued: true });
            doc
              .font('Helvetica-Oblique')
              .fillColor(bodyText)
              .text(`"${(turn.answer || 'No answer recorded').trim()}"`, { lineGap: 1 });
            doc.moveDown(0.4);

            // Evaluation / Strengths / Weaknesses
            if (turn.strengths) {
              doc.fillColor(successColor).fontSize(8).font('Helvetica-Bold').text('Strengths: ', { continued: true });
              doc.font('Helvetica').fillColor(bodyText).text(turn.strengths, { lineGap: 1 });
            }
            if (turn.weaknesses) {
              doc.fillColor(warningColor).fontSize(8).font('Helvetica-Bold').text('Improvements: ', { continued: true });
              doc.font('Helvetica').fillColor(bodyText).text(turn.weaknesses, { lineGap: 1 });
            }
            if (turn.ideal_answer_hint) {
              doc.fillColor(secondaryColor).fontSize(8).font('Helvetica-Bold').text('Model Talking Point: ', { continued: true });
              doc.font('Helvetica').fillColor(bodyText).text(turn.ideal_answer_hint, { lineGap: 1 });
            }

            doc.moveDown(0.6);
            doc.rect(40, doc.y, turnBoxWidth, 0.5).fill('#e2e8f0');
            doc.moveDown(0.6);
          });
        }

        // -------------------------------------------------------------
        // FOOTER ON ALL PAGES
        // -------------------------------------------------------------
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc.rect(40, 792, 515, 0.5).fill('#cbd5e1');
          doc
            .fillColor(mutedText)
            .fontSize(7.5)
            .font('Helvetica')
            .text(
              `MP Online Career Readiness Platform  |  Interview ID: ${data.interview_id}  |  CONFIDENTIAL`,
              40,
              800,
              { width: 360 }
            );
          doc.text(`Page ${i + 1} of ${range.count}`, 40, 800, { width: 515, align: 'right' });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
