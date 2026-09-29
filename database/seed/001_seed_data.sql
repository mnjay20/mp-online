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
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Software Engineering Intern', 'Collaborate with senior developers on building fintech backend microservices.', 'Mumbai, India', 'HYBRID', '3 months', '30,000 / month')
ON CONFLICT (id) DO NOTHING;
