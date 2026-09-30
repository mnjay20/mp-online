-- ============================================================================
-- AI-POWERED CAREER READINESS & EMPLOYABILITY PLATFORM
-- Seed Data Script
-- ============================================================================

-- 1. Seed Skills Catalog
INSERT INTO skills (id, name, category, description) VALUES
-- Programming Languages
('a0000000-0000-0000-0000-000000000001', 'Java', 'Programming Languages', 'Object-oriented programming language for enterprise software.'),
('a0000000-0000-0000-0000-000000000002', 'Python', 'Programming Languages', 'High-level language for backend, data science, and AI.'),
('a0000000-0000-0000-0000-000000000003', 'JavaScript', 'Programming Languages', 'Dynamic scripting language for web browsers and Node.js.'),
('a0000000-0000-0000-0000-000000000004', 'TypeScript', 'Programming Languages', 'Typed superset of JavaScript for scalable applications.'),
('a0000000-0000-0000-0000-000000000005', 'SQL', 'Programming Languages', 'Standard language for querying relational databases.'),

-- Web Frameworks & Libraries
('a0000000-0000-0000-0000-000000000006', 'React', 'Frontend Frameworks', 'Declarative UI library for single-page applications.'),
('a0000000-0000-0000-0000-000000000007', 'Node.js', 'Backend Frameworks', 'JavaScript runtime built on Chrome V8 engine.'),
('a0000000-0000-0000-0000-000000000008', 'Express', 'Backend Frameworks', 'Fast, unopinionated minimalist web framework for Node.js.'),
('a0000000-0000-0000-0000-000000000009', 'Spring Boot', 'Backend Frameworks', 'Opinionated Java framework for microservices.'),
('a0000000-0000-0000-0000-000000000010', 'FastAPI', 'Backend Frameworks', 'Modern high-performance web framework for Python APIs.'),

-- Databases & Storage
('a0000000-0000-0000-0000-000000000011', 'PostgreSQL', 'Databases', 'Advanced open-source relational database.'),
('a0000000-0000-0000-0000-000000000012', 'DBMS', 'Computer Science Fundamentals', 'Database management systems principles and indexing.'),

-- DevOps, Cloud & Infrastructure
('a0000000-0000-0000-0000-000000000013', 'Git', 'Development Tools', 'Distributed version control system.'),
('a0000000-0000-0000-0000-000000000014', 'GitHub', 'Development Tools', 'Code hosting, collaboration, and CI/CD platform.'),
('a0000000-0000-0000-0000-000000000015', 'Docker', 'DevOps & Cloud', 'Containerization platform for reliable deployments.'),
('a0000000-0000-0000-0000-000000000016', 'REST APIs', 'Software Architecture', 'Architectural style for web services and distributed systems.'),
('a0000000-0000-0000-0000-000000000017', 'AWS', 'DevOps & Cloud', 'Amazon Web Services cloud platform.'),
('a0000000-0000-0000-0000-000000000018', 'Azure', 'DevOps & Cloud', 'Microsoft cloud computing platform.'),
('a0000000-0000-0000-0000-000000000019', 'GCP', 'DevOps & Cloud', 'Google Cloud Platform infrastructure.'),

-- Computer Science Fundamentals
('a0000000-0000-0000-0000-000000000020', 'Data Structures', 'Computer Science Fundamentals', 'Arrays, linked lists, trees, graphs, and hash maps.'),
('a0000000-0000-0000-0000-000000000021', 'Algorithms', 'Computer Science Fundamentals', 'Sorting, searching, dynamic programming, and complexity.'),
('a0000000-0000-0000-0000-000000000022', 'Operating Systems', 'Computer Science Fundamentals', 'Process scheduling, memory management, and file systems.'),
('a0000000-0000-0000-0000-000000000023', 'Computer Networks', 'Computer Science Fundamentals', 'OSI model, TCP/IP, DNS, and HTTP protocols.'),

-- Data Science & AI
('a0000000-0000-0000-0000-000000000024', 'Statistics', 'Data & AI', 'Descriptive, inferential statistics and probability theory.'),
('a0000000-0000-0000-0000-000000000025', 'Machine Learning', 'Data & AI', 'Supervised, unsupervised algorithms and evaluation.'),
('a0000000-0000-0000-0000-000000000026', 'Deep Learning', 'Data & AI', 'Neural networks, backpropagation, and architectures.'),
('a0000000-0000-0000-0000-000000000027', 'NLP', 'Data & AI', 'Natural language processing, tokenization, and transformers.'),
('a0000000-0000-0000-0000-000000000028', 'TensorFlow', 'Data & AI', 'End-to-end open-source machine learning platform.'),
('a0000000-0000-0000-0000-000000000029', 'PyTorch', 'Data & AI', 'Flexible deep learning framework widely used in research.'),
('a0000000-0000-0000-0000-000000000030', 'MLOps', 'Data & AI', 'Machine learning operations, pipelines, and monitoring.'),

-- Soft Skills
('a0000000-0000-0000-0000-000000000031', 'Communication', 'Professional Skills', 'Clear verbal and written technical communication.'),
('a0000000-0000-0000-0000-000000000032', 'Problem Solving', 'Professional Skills', 'Structured analytical reasoning and algorithmic thinking.')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Careers Catalog (10 Core Careers)
INSERT INTO careers (id, title, slug, description, average_salary_min, average_salary_max, demand_level) VALUES
('b0000000-0000-0000-0000-000000000001', 'Backend Developer', 'backend-developer', 'Builds and maintains servers, databases, and APIs powering applications.', 600000, 1800000, 'High'),
('b0000000-0000-0000-0000-000000000002', 'Frontend Developer', 'frontend-developer', 'Builds user-facing web applications with modern interactive interfaces.', 550000, 1600000, 'High'),
('b0000000-0000-0000-0000-000000000003', 'Full Stack Developer', 'full-stack-developer', 'Architects end-to-end web software from UI to database.', 700000, 2000000, 'Very High'),
('b0000000-0000-0000-0000-000000000004', 'Data Analyst', 'data-analyst', 'Translates numbers and data pipelines into actionable business insights.', 500000, 1400000, 'High'),
('b0000000-0000-0000-0000-000000000005', 'Data Scientist', 'data-scientist', 'Develops statistical models and experiments to discover predictive patterns.', 800000, 2200000, 'Very High'),
('b0000000-0000-0000-0000-000000000006', 'ML Engineer', 'ml-engineer', 'Deploys, monitors, and optimizes scalable machine learning models.', 900000, 2500000, 'Very High'),
('b0000000-0000-0000-0000-000000000007', 'DevOps Engineer', 'devops-engineer', 'Automates CI/CD, builds container orchestration, and monitors systems.', 750000, 2100000, 'High'),
('b0000000-0000-0000-0000-000000000008', 'Cloud Engineer', 'cloud-engineer', 'Designs and administers highly available cloud infrastructure.', 750000, 2000000, 'High'),
('b0000000-0000-0000-0000-000000000009', 'Cybersecurity Analyst', 'cybersecurity-analyst', 'Protects systems, networks, and data from attacks and vulnerabilities.', 650000, 1900000, 'High'),
('b0000000-0000-0000-0000-000000000010', 'Software Engineer', 'software-engineer', 'Generalist software engineer building robust distributed applications.', 700000, 2200000, 'Very High')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Career Skills Requirements
-- Backend Developer requirements
INSERT INTO career_skills (career_id, skill_id, importance, required_proficiency, weight) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'CRITICAL', 'ADVANCED', 1.0), -- SQL
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000016', 'CRITICAL', 'ADVANCED', 1.0), -- REST APIs
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011', 'CRITICAL', 'ADVANCED', 0.9), -- PostgreSQL
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', 'CRITICAL', 'INTERMEDIATE', 0.8), -- Node.js
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000015', 'IMPORTANT', 'INTERMEDIATE', 0.7), -- Docker
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000020', 'IMPORTANT', 'ADVANCED', 0.8), -- Data Structures
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000013', 'CRITICAL', 'INTERMEDIATE', 0.6), -- Git

-- Frontend Developer requirements
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'CRITICAL', 'ADVANCED', 1.0), -- JavaScript
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'CRITICAL', 'ADVANCED', 0.9), -- TypeScript
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'CRITICAL', 'ADVANCED', 1.0), -- React
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000016', 'IMPORTANT', 'INTERMEDIATE', 0.7), -- REST APIs
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000013', 'CRITICAL', 'INTERMEDIATE', 0.6), -- Git

-- ML Engineer requirements
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'CRITICAL', 'ADVANCED', 1.0), -- Python
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000025', 'CRITICAL', 'ADVANCED', 1.0), -- Machine Learning
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000026', 'CRITICAL', 'ADVANCED', 0.9), -- Deep Learning
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000029', 'IMPORTANT', 'ADVANCED', 0.8), -- PyTorch
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000030', 'CRITICAL', 'INTERMEDIATE', 0.8), -- MLOps
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000015', 'IMPORTANT', 'INTERMEDIATE', 0.7) -- Docker
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- 4. Seed Courses
INSERT INTO courses (id, title, provider, description, url, difficulty, duration_hours, is_free, price, rating) VALUES
('c0000000-0000-0000-0000-000000000001', 'Mastering PostgreSQL & Advanced Relational Querying', 'Coursera', 'Deep dive into SQL indexing, query optimization, and transactions.', 'https://coursera.org/learn/postgresql', 'INTERMEDIATE', 24, true, 0, 4.8),
('c0000000-0000-0000-0000-000000000002', 'Building Production REST APIs with Express & TypeScript', 'freeCodeCamp', 'Modern backend engineering best practices, validation, and JWT auth.', 'https://freecodecamp.org/backend-typescript', 'INTERMEDIATE', 30, true, 0, 4.9),
('c0000000-0000-0000-0000-000000000003', 'Docker & Containerization for Developers', 'Udemy', 'Step-by-step containerization, multi-stage builds, and docker compose.', 'https://udemy.com/course/docker-for-devs', 'BEGINNER', 14, false, 499, 4.7),
('c0000000-0000-0000-0000-000000000004', 'Machine Learning Specialization', 'DeepLearning.AI', 'Foundational machine learning concepts, regression, and tree models.', 'https://coursera.org/specializations/machine-learning-introduction', 'INTERMEDIATE', 60, true, 0, 4.9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO course_skills (course_id, skill_id) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005'), -- SQL
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011'), -- PostgreSQL
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007'), -- Node.js
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008'), -- Express
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004'), -- TypeScript
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000015'), -- Docker
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002'), -- Python
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000025')  -- Machine Learning
ON CONFLICT (course_id, skill_id) DO NOTHING;

-- 5. Seed Companies & Jobs & Internships
INSERT INTO companies (id, name, website, location, description) VALUES
('d0000000-0000-0000-0000-000000000001', 'CloudScale Technologies', 'https://cloudscale.example.com', 'Bengaluru, India', 'Enterprise cloud and distributed backend solutions.'),
('d0000000-0000-0000-0000-000000000002', 'NexGen AI Labs', 'https://nexgenai.example.com', 'Hyderabad, India', 'Applied AI and deep learning research and products.'),
('d0000000-0000-0000-0000-000000000003', 'FinTech Innovations', 'https://fintechinnovate.example.com', 'Mumbai, India', 'High-throughput payment and financial technology.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, company_id, title, description, location, work_mode, employment_type, experience_min, experience_max, salary_min, salary_max) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Junior Backend Developer', 'Looking for enthusiastic engineers skilled in Node.js, Express, PostgreSQL, and REST APIs.', 'Bengaluru, India', 'HYBRID', 'FULL_TIME', 0, 2, 700000, 1100000),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'Associate Machine Learning Engineer', 'Join our ML team building recommendation engines and LLM pipelines using Python and PyTorch.', 'Hyderabad, India', 'REMOTE', 'FULL_TIME', 0, 2, 900000, 1400000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_skills (job_id, skill_id, is_required) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', true), -- Node.js
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011', true), -- PostgreSQL
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000016', true), -- REST APIs
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000013', true), -- Git
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', true), -- Python
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000025', true), -- Machine Learning
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000029', true)  -- PyTorch
ON CONFLICT (job_id, skill_id) DO NOTHING;

INSERT INTO internships (id, company_id, title, description, location, work_mode, duration, stipend) VALUES
('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Backend Engineering Intern', 'Hands-on internship assisting with API development and database queries.', 'Bengaluru, India', 'REMOTE', '6 months', '25,000 / month'),
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Software Engineering Intern', 'Collaborate with senior developers on building fintech backend microservices.', 'Mumbai, India', 'HYBRID', '3 months', '30,000 / month'),
('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000006', 'DRDO Student Research Apprenticeship', '6-month research internship on cyber resilience, cryptography, and secure communications.', 'Bengaluru, India', 'ONSITE', '6 Months', '₹20,000 / month'),
('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000008', 'ISRO Graduate Apprentice Trainee', '12-month technical apprenticeship on satellite earth observation data ingestion and AI telemetry processing.', 'Bengaluru, India', 'ONSITE', '12 Months', '₹18,000 / month'),
('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000009', 'NAPS Cloud Infrastructure Apprentice', 'National Apprenticeship Promotion Scheme opportunity providing on-the-job training in Linux server administration and cloud networking.', 'New Delhi, India', 'HYBRID', '12 Months', '₹15,000 / month')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Public-Sector Companies & Government Jobs
INSERT INTO companies (id, name, website, location, description) VALUES
('d0000000-0000-0000-0000-000000000004', 'National Informatics Centre (NIC)', 'https://www.nic.in', 'New Delhi, India', 'Premier science & technology organisation of Government of India under MeitY, providing network backbone and e-Governance infrastructure.'),
('d0000000-0000-0000-0000-000000000005', 'Centre for Development of Advanced Computing (C-DAC)', 'https://www.cdac.in', 'Pune, India', 'Premier R&D organization of MeitY for carrying out R&D in IT, Electronics and associated supercomputing areas.'),
('d0000000-0000-0000-0000-000000000006', 'Defence Research and Development Organisation (DRDO)', 'https://www.drdo.gov.in', 'New Delhi, India', 'R&D wing of Ministry of Defence developing critical defence systems, secure communications, and autonomous AI.'),
('d0000000-0000-0000-0000-000000000007', 'Centre for Railway Information Systems (CRIS / Railway Tech)', 'https://cris.org.in', 'New Delhi, India', 'Autonomous organization under Ministry of Railways designing and developing core software platforms for Indian Railways.'),
('d0000000-0000-0000-0000-000000000008', 'Indian Space Research Organisation (ISRO)', 'https://www.isro.gov.in', 'Bengaluru, India', 'National space agency of India pursuing space research, satellite communications, and remote sensing applications.'),
('d0000000-0000-0000-0000-000000000009', 'National Skill Development Corporation (NSDC / Skill India)', 'https://nsdcindia.org', 'New Delhi, India', 'Public-private partnership promoting nationwide vocational skills, PMKVY, and NAPS apprenticeship frameworks.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, company_id, title, description, location, work_mode, employment_type, experience_min, experience_max, salary_min, salary_max, is_government, gov_category, eligibility_degrees) VALUES
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000004', 'Scientist-B (Cloud & Cyber Security)', 'Architect and defend national digital infrastructure, cloud datacenters, and secure APIs for Citizen Services under Digital India initiative.', 'New Delhi, India', 'ONSITE', 'FULL_TIME', 0, 2, 800000, 1400000, true, 'PSU', ARRAY['B.Tech', 'B.E.', 'MCA', 'M.Sc (CS/IT)']),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000005', 'Project Engineer (High Performance Computing & Distributed Systems)', 'Develop distributed system software and parallel computing algorithms for PARAM supercomputers and AI clusters.', 'Pune, India', 'HYBRID', 'FULL_TIME', 0, 3, 650000, 1100000, true, 'RESEARCH', ARRAY['B.Tech', 'B.E.', 'MCA', 'M.Tech']),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000006', 'Junior Research Scientist (Defence AI & Autonomous Systems)', 'Research algorithms for real-time sensor fusion, computer vision, and secure network protocols in defence applications.', 'Bengaluru, India', 'ONSITE', 'FULL_TIME', 0, 2, 750000, 1200000, true, 'DEFENCE', ARRAY['B.Tech', 'B.E.', 'M.Tech']),
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000007', 'Assistant Software Engineer (Indian Railways Digital Enterprise Platform)', 'Build enterprise ticketing, logistics tracking, and rail network management systems servicing 20M+ citizens daily.', 'New Delhi, India', 'ONSITE', 'FULL_TIME', 0, 2, 700000, 1200000, true, 'RAILWAYS', ARRAY['B.Tech', 'B.E.', 'MCA', 'B.Sc Computer Science'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_skills (job_id, skill_id, is_required) VALUES
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', true), -- Python
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000015', true), -- Docker
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000011', true), -- PostgreSQL
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', true), -- Python
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000020', true), -- Data Structures
('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', true), -- Java
('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', true)  -- SQL
ON CONFLICT (job_id, skill_id) DO NOTHING;

-- 7. Seed Government Schemes (Skill India, NEP 2020, Digital India)
INSERT INTO government_schemes (id, scheme_code, title, category, ministry_or_body, description, eligibility_criteria, benefits, stipend_amount, official_portal_url, alignment_initiatives, target_skills) VALUES
(
  '90000000-0000-0000-0000-000000000001',
  'NAPS-2026',
  'National Apprenticeship Promotion Scheme (NAPS)',
  'APPRENTICESHIP',
  'Ministry of Skill Development and Entrepreneurship (MSDE)',
  'Flagship Government of India initiative promoting technical apprenticeships with direct government DBT stipend sharing and National Apprenticeship Certificate issuance.',
  '{"min_education": "B.Tech/Diploma/B.Sc", "fields_of_study": ["Computer Science", "Information Technology", "Electronics", "Any Engineering"], "age_min": 18, "age_max": 28}'::jsonb,
  'Monthly government stipend contribution up to ₹1,500/month in addition to company stipend (totaling ₹15,000/mo), NCVT accredited industry credential.',
  15000,
  'https://www.apprenticeshipindia.gov.in',
  ARRAY['Skill India', 'NEP 2020'],
  ARRAY['Python', 'Node.js', 'SQL', 'Docker']
),
(
  '90000000-0000-0000-0000-000000000002',
  'PMKVY-4.0-AI',
  'PMKVY 4.0 - FutureSkills AI & Cloud Certification Initiative',
  'CERTIFICATION',
  'National Skill Development Corporation (NSDC)',
  'Under Skill India Mission, offers 100% government-sponsored certification in Artificial Intelligence, Big Data, and Cloud DevOps aligned with Industry 4.0 demand.',
  '{"min_education": "Pursuing Graduation or Graduate", "fields_of_study": ["Any STEM", "Computer Science", "Electronics"], "min_gpa": 6.0}'::jsonb,
  '100% Fee Waiver, Free National Level Certification Assessment, Direct Career Connect via Skill India Digital Portal.',
  0,
  'https://www.pmkvyofficial.org',
  ARRAY['Skill India', 'Digital India', 'NEP 2020'],
  ARRAY['Python', 'Machine Learning', 'Data Structures', 'Cloud Computing']
),
(
  '90000000-0000-0000-0000-000000000003',
  'MEITY-DIGITAL-INDIA-INTERN',
  'Digital India Tech Internship Scheme',
  'INTERNSHIP',
  'Ministry of Electronics and Information Technology (MeitY)',
  'Prestigious 2-month summer/winter internship for engineering students to architect and contribute to national digital public infrastructure (UPI, DigiLocker, India Stack).',
  '{"min_education": "B.Tech/B.E./MCA", "fields_of_study": ["Computer Science", "IT", "Data Science", "Electronics"], "min_gpa": 7.5}'::jsonb,
  'Monthly stipend of ₹20,000 + Certificate of Commendation from MeitY Secretary.',
  20000,
  'https://www.meity.gov.in/schemes',
  ARRAY['Digital India', 'NEP 2020'],
  ARRAY['REST APIs', 'SQL', 'PostgreSQL', 'Docker', 'Python']
),
(
  '90000000-0000-0000-0000-000000000004',
  'NEP-2020-MULTI-DISCIPLINARY',
  'NEP 2020 Multi-Disciplinary Innovation & Research Fellowship',
  'FELLOWSHIP',
  'Department of Higher Education, Ministry of Education',
  'In alignment with the National Education Policy 2020, grants academic credits and project fellowships for students solving cross-disciplinary societal engineering challenges.',
  '{"min_education": "Undergraduate Enrolled", "fields_of_study": ["Any Recognized University Program"], "min_gpa": 7.0}'::jsonb,
  '₹25,000 monthly research stipend + Academic Credit Transfer recognized under the Academic Bank of Credits (ABC).',
  25000,
  'https://www.education.gov.in/nep',
  ARRAY['NEP 2020'],
  ARRAY['Problem Solving', 'Data Structures', 'Python']
)
ON CONFLICT (id) DO NOTHING;
