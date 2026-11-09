export const PERSONAL_DATA = {
  name: "Malick Billy",
  title: "Software Engineer & Founder",
  tagline: "Architecting scalable systems, building impactful digital products, and turning ambitious ideas into resilient companies.",
  location: "Dar es Salaam, Tanzania & Worldwide",
  availability: "Open to High-Impact Opportunities & Advisory",
  bio: [
    "I am a passionate Software Engineer and entrepreneurial Founder dedicated to engineering high-performance distributed systems, intuitive modern web applications, and resilient digital ventures.",
    "Over the past 7+ years, I have engineered full-stack architectures, built product-led startups from concept to launch, and led teams across product strategy, engineering, and cloud infrastructure.",
    "When I'm not writing clean code or architecting systems, I mentor emerging developers and explore innovations in AI, cloud-native technologies, and developer tooling."
  ],
  stats: [
    { label: "Years of Experience", value: "7+" },
    { label: "Products & Ventures Launched", value: "15+" },
    { label: "Satisfied Clients & Users", value: "10k+" },
    { label: "Code Commits & Open Source", value: "2,500+" }
  ],
  socials: {
    github: "https://github.com/malickbilly70",
    linkedin: "https://linkedin.com/in/malickbilly",
    twitter: "https://x.com/malickbilly",
    email: "malickbilly70@gmail.com"
  },
  skills: [
    {
      category: "Frontend Development",
      items: [
        { name: "React / Next.js", level: "Expert" },
        { name: "TypeScript / JavaScript (ESNext)", level: "Expert" },
        { name: "Tailwind CSS & Modern UI/UX", level: "Expert" },
        { name: "Vite / Webpack / Micro-frontends", level: "Advanced" },
        { name: "State Management (Redux, Zustand, Context)", level: "Advanced" }
      ]
    },
    {
      category: "Backend & Systems",
      items: [
        { name: "Node.js & Express / NestJS", level: "Expert" },
        { name: "Python / FastAPI / Django", level: "Advanced" },
        { name: "RESTful & GraphQL API Design", level: "Expert" },
        { name: "Microservices & Distributed Systems", level: "Advanced" },
        { name: "Authentication (OAuth2, JWT, SSO)", level: "Expert" }
      ]
    },
    {
      category: "Cloud, DevOps & Infrastructure",
      items: [
        { name: "Docker & Containerization", level: "Expert" },
        { name: "Kubernetes & CI/CD Pipelines (GitHub Actions)", level: "Advanced" },
        { name: "AWS (ECS, Lambda, S3, CloudFront)", level: "Advanced" },
        { name: "Vercel & Supabase Platform Architecture", level: "Expert" },
        { name: "Performance Optimization & Observability", level: "Advanced" }
      ]
    },
    {
      category: "Databases & Data Modeling",
      items: [
        { name: "PostgreSQL & Prisma / Supabase", level: "Expert" },
        { name: "MongoDB & Document Stores", level: "Advanced" },
        { name: "Redis & In-Memory Caching", level: "Advanced" },
        { name: "Database Indexing & Query Tuning", level: "Advanced" }
      ]
    },
    {
      category: "Founder & Leadership",
      items: [
        { name: "Product Strategy & Technical Roadmapping", level: "Expert" },
        { name: "System Architecture & RFC Authoring", level: "Expert" },
        { name: "Agile Engineering Leadership & Mentorship", level: "Expert" },
        { name: "Fundraising & Startup Growth Strategy", level: "Advanced" }
      ]
    }
  ],
  projects: [
    {
      id: "mb-global",
      title: "MB Global Platform",
      category: "SaaS / Enterprise",
      summary: "Comprehensive enterprise appointment booking and workflow platform with real-time Google Calendar bidirectional sync, automated Meet links, and multi-language support.",
      techStack: ["React", "Tailwind CSS", "Vite", "Node.js", "Google Calendar API", "Supabase"],
      featured: true,
      githubUrl: "https://github.com/malickbilly70/work-try-ons-",
      liveUrl: "https://work-try-ons.vercel.app",
      highlights: [
        "Implemented secure Google OAuth 2.0 flow with token auto-refresh and calendar busy slot detection.",
        "Built administrative scheduling dashboard with dynamic blocked dates and CSV/JSON export analytics.",
        "Full Tanzanian Kiswahili and English localization with instant theme toggle."
      ]
    },
    {
      id: "cloud-pulse",
      title: "CloudPulse Monitoring Suite",
      category: "DevOps & Cloud",
      summary: "Lightweight, real-time cloud resource observer and anomaly detection dashboard for microservices running on Kubernetes and distributed container fleets.",
      techStack: ["TypeScript", "Next.js", "Golang", "Prometheus", "Tailwind CSS", "Docker"],
      featured: true,
      githubUrl: "https://github.com/malickbilly70/cloudpulse",
      liveUrl: "https://cloudpulse-preview.vercel.app",
      highlights: [
        "Sub-second latency metrics streaming via WebSockets.",
        "Custom rule-based alert triggering integrated with Slack and Webhooks.",
        "Reduces infrastructure debugging time by 40% with automated trace correlation."
      ]
    },
    {
      id: "pay-stack-bridge",
      title: "FinFlow African Payment Engine",
      category: "Fintech & API",
      summary: "Unified payment orchestration layer simplifying multi-currency mobile money and card processing across East and Sub-Saharan Africa.",
      techStack: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery", "Docker"],
      featured: true,
      githubUrl: "https://github.com/malickbilly70/finflow-engine",
      liveUrl: "https://finflow-engine.vercel.app",
      highlights: [
        "Idempotent payment webhook processing handling over 10,000 transactions daily.",
        "Automated reconciliation engine with bank-grade encryption and PCI-DSS best practices.",
        "Built-in fallback routing ensuring 99.98% successful checkout conversion."
      ]
    },
    {
      id: "nexus-ai-workspace",
      title: "Nexus AI Knowledge Workspace",
      category: "AI & Productivity",
      summary: "Collaborative intelligent workspace leveraging vector embeddings for enterprise documentation search and conversational retrieval.",
      techStack: ["React", "FastAPI", "OpenAI / Anthropic APIs", "pgvector", "Tailwind CSS"],
      featured: false,
      githubUrl: "https://github.com/malickbilly70/nexus-ai",
      liveUrl: "https://nexus-ai-workspace.vercel.app",
      highlights: [
        "RAG (Retrieval-Augmented Generation) pipeline over internal proprietary markdown & PDF knowledge bases.",
        "Role-based access controls and enterprise audit logging.",
        "Zero data retention compliance architecture."
      ]
    }
  ],
  experience: [
    {
      period: "2022 - Present",
      role: "Founder & Principal Software Engineer",
      company: "MB Global Ventures & Technologies",
      location: "Dar es Salaam & Remote",
      description: "Founded and scaled a technology consultancy and software venture studio building enterprise cloud solutions, SaaS platforms, and digital products.",
      achievements: [
        "Architected and deployed cloud-native applications serving tens of thousands of active users across Africa and international markets.",
        "Led product direction, technical architecture, and recruited high-performing distributed engineering teams.",
        "Formed strategic partnerships with regional business leaders to automate critical customer-facing workflows."
      ]
    },
    {
      period: "2020 - 2022",
      role: "Senior Full Stack Engineer",
      company: "ScaleTech Solutions",
      location: "Remote",
      description: "Led core frontend and microservices engineering for scalable cloud platforms, standardizing CI/CD deployment pipelines and engineering best practices.",
      achievements: [
        "Migrated legacy monolith to a modern modular architecture, increasing system throughput by 3x.",
        "Mentored junior and mid-level engineers through code reviews, architectural RFCs, and sprint planning.",
        "Reduced production incident resolution time by 35% through enhanced telemetry and structured logging."
      ]
    },
    {
      period: "2018 - 2020",
      role: "Software Engineer",
      company: "Apex Digital Systems",
      location: "Tanzania",
      description: "Developed customer-facing web applications, payment gateway integrations, and internal management portals.",
      achievements: [
        "Engineered real-time inventory and billing modules processing high transaction volumes.",
        "Built responsive client portals optimized for mobile bandwidth and low-latency environments."
      ]
    }
  ]
};
