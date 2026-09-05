import mongoose from 'mongoose';
import Service from '../models/Service';
import Project from '../models/Project';
import Blog from '../models/Blog';

const seedServices = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial core services into database...');
      const initialServices = [
        {
          title: 'Web Development',
          subtitle: 'Full-stack web application development services',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          icon: 'HiCode',
          content: '<p>Building high-performance, responsive, and secure custom web applications using modern tech stacks like React, Next.js, and Node.js. We ensure clean code, scalability, and robust cloud deployments.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          title: 'Mobile Development',
          subtitle: 'Cross-platform iOS and Android apps',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
          icon: 'HiDeviceMobile',
          content: '<p>We build highly performant, intuitive, and user-centric iOS and Android mobile applications using React Native and Flutter. Get native performance with a single unified codebase.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          title: 'UI UX Design',
          subtitle: 'Intuitive interface and user experience design',
          image: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80',
          icon: 'HiTemplate',
          content: '<p>Designing stunning, modern, and user-friendly digital wireframes, interactive prototypes, and interface designs that maximize user engagement and convert visitors into loyal customers.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          title: 'Graphic Design',
          subtitle: 'Visual identity and high-impact branding',
          image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
          icon: 'HiSparkles',
          content: '<p>Creating visually compelling brand identities, logo suites, marketing collateral, brochures, and digital creative assets custom tailored to speak directly to your target audience.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          title: 'Video Editing',
          subtitle: 'Professional video post-production and animation',
          image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80',
          icon: 'HiVideoCamera',
          content: '<p>Crafting high-quality cinematic content, promotional videos, engaging social media clips, and explanatory animations complete with professional audio, transitions, color grading, and titles.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          title: 'Digital Marketing',
          subtitle: 'Search engine optimization and performance marketing',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          icon: 'HiTrendingUp',
          content: '<p>Scale your brand using data-driven social media management, paid ad campaigns, and SEO to convert traffic.</p>',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ];

      await Service.insertMany(initialServices);
      console.log('✅ Core services seeded successfully!');
    }
  } catch (error: any) {
    console.error('❌ Failed to seed core services:', error.message);
  }
};

const seedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial custom projects into database...');
      const initialProjects = [
        {
          name: 'Care Connect Portal',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>A comprehensive web portal for connecting patients with qualified doctors, streamlining scheduling, live consultations, and custom prescription integrations.</p>',
          category: 'Website Development',
          staff: 'Ava Mitchell',
          price: 12500,
          features: ['Doctor & Patient Live Chats', 'Automated Medical Prescriptions', 'Integrated Appointment Reminders', 'Secure Patient Care Logs']
        },
        {
          name: 'EduSmart LMS',
          image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>Advanced SaaS e-learning system hosting interactive lecture boards, secure document storage, custom quiz configurations, and responsive grades checklists.</p>',
          category: 'Website Development',
          staff: 'Sophia Vance',
          price: 18000,
          features: ['Interactive Classroom Whiteboards', 'Secure PDF & Media Warehousing', 'SaaS Automated Gradebooks', 'Dynamic Course Calendars']
        },
        {
          name: 'FitTrack SaaS',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>Fitness performance platform with custom graphical tracking utilities for weight logging, diet tracking, cardio regimens, and community team leaderboards.</p>',
          category: 'Website Development',
          staff: 'Oliver Blackwood',
          price: 9500,
          features: ['Interactive Diet Logging & Database', 'Live Workout Routines Dashboard', 'Interactive Cardio Analytics', 'Community Fit Challenge Boards']
        },
        {
          name: 'ShopEase E-Commerce',
          image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>Modern headless online commerce platform built utilizing high-speed Next.js page layers, secure Stripe integrations, and fluid visual inventory grids.</p>',
          category: 'Website Development',
          staff: 'Liam Sterling',
          price: 22000,
          features: ['Ultra Fast Next.js Headless Stores', 'Full-Scale Stripe Billing System', 'Real-Time Inventory Alert Grids', 'Advanced Custom Coupon Engines']
        },
        {
          name: 'SwiftRider Mobile App',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>Cross-platform iOS and Android ride hailing application utilizing high-fidelity map routing, automatic fare split calculators, and driver panel overlays.</p>',
          category: 'Mobile App Development',
          staff: 'Ava Mitchell',
          price: 25000,
          features: ['High-Fidelity Google Maps Routing', 'Fare Splits & Cost Calculators', 'Real-Time Driver Panels', 'Multi-Language Audio Indicators']
        },
        {
          name: 'ZenMind Mental Wellness',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: '<p>A beautiful meditation application providing daily zen logs, cataloged relaxation audios, offline database saves, and dynamic sleep logs.</p>',
          category: 'Mobile App Development',
          staff: 'Isabella Cross',
          price: 14000,
          features: ['Daily Guided Zen & Breathing Audios', 'Interactive Sleep Logs & Schedules', 'Encrypted Diary & Reflection Notes', 'Beautiful Premium Dark-Mode Interfaces']
        }
      ];

      await Project.insertMany(initialProjects);
      console.log('✅ Custom projects seeded successfully!');
    }
  } catch (error: any) {
    console.error('❌ Failed to seed custom projects:', error.message);
  }
};

const seedBlogs = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial custom blogs into database...');
      const initialBlogs = [
        {
          title: 'The Future of Web Applications with Next.js',
          subtitle: 'Explore how headless commerce and server components are revolutionizing modern page speed.',
          category: 'Web Development',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          author: 'Sophia Mitchell',
          content: '<p>Modern web development is evolving at a breakneck pace. With Next.js 16 server-side components, web apps load faster than ever, enhancing conversion rates and customer satisfaction. We dive deep into architectural patterns...</p>',
          date: new Date('2026-05-15')
        },
        {
          title: 'Mastering Cross-Platform Mobile Layouts',
          subtitle: 'Practical guides to building zero-shrink, highly responsive React Native interfaces.',
          category: 'Mobile Apps',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
          author: 'Liam Sterling',
          content: '<p>Designing visual overlays and menu bars that work consistently across all form factors requires careful grid planning. In this article, we outline best practices for spacing, padding, and preserving circular dimensions on mobile devices...</p>',
          date: new Date('2026-05-20')
        },
        {
          title: 'Strategic Digital Brand Scaling',
          subtitle: 'Leveraging high-impact performance campaigns and visual content to scale organic traffic.',
          category: 'Digital Marketing',
          image: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80',
          author: 'Ava Mitchell',
          content: '<p>Organic growth is the backbone of sustainable brand equity. By integrating professional storytelling with data-driven social optimization, businesses can scale their customer reach organically...</p>',
          date: new Date('2026-05-22')
        }
      ];

      await Blog.insertMany(initialBlogs);
      console.log('✅ Custom blogs seeded successfully!');
    }
  } catch (error: any) {
    console.error('❌ Failed to seed custom blogs:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedServices();
    await seedProjects();
    await seedBlogs();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
