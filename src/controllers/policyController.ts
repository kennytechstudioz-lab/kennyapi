import { Request, Response } from 'express';
import Policy from '../models/Policy';

// GET /api/policies?category=terms|privacy
export const getPolicies = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = category ? { category: String(category) } : {};
    const policies = await Policy.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(policies);
  } catch {
    res.status(500).json({ message: 'Error fetching policies' });
  }
};

// POST /api/policies
export const createPolicy = async (req: Request, res: Response) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: 'Error creating policy' });
  }
};

// PUT /api/policies/:id
export const updatePolicy = async (req: Request, res: Response) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch {
    res.status(400).json({ message: 'Error updating policy' });
  }
};

// DELETE /api/policies/:id
export const deletePolicy = async (req: Request, res: Response) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json({ message: 'Policy deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting policy' });
  }
};

// POST /api/policies/seed — seeds default terms & privacy data if none exist
export const seedPolicies = async (req: Request, res: Response) => {
  try {
    const existing = await Policy.countDocuments();
    if (existing > 0) {
      res.json({ message: `Seed skipped — ${existing} policies already exist.` });
      return;
    }

    const termsData = [
      {
        category: 'terms',
        title: 'Acceptance of Terms',
        content:
          'By accessing and using the services of Kenny Tech Studios, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
        order: 1,
      },
      {
        category: 'terms',
        title: 'Services Description',
        content:
          'Kenny Tech Studios provides software development, web & mobile app development, digital marketing, animation, and video editing services. The specific scope of work for each project will be outlined in a separate agreement or proposal.',
        order: 2,
      },
      {
        category: 'terms',
        title: 'Intellectual Property',
        content:
          'Unless otherwise agreed in writing, all intellectual property rights for work created by Kenny Tech Studios remain the property of Kenny Tech Studios until full payment is received. Upon full payment, ownership of the final deliverables will be transferred to the client.',
        order: 3,
      },
      {
        category: 'terms',
        title: 'Payment Terms',
        content:
          'Payment schedules will be defined in the project proposal. Late payments may result in suspension of work or additional fees as specified in the agreement.',
        order: 4,
      },
      {
        category: 'terms',
        title: 'Limitation of Liability',
        content:
          'Kenny Tech Studios shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.',
        order: 5,
      },
      {
        category: 'terms',
        title: 'Governing Law',
        content:
          'These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Kenny Tech Studios operates.',
        order: 6,
      },
    ];

    const privacyData = [
      {
        category: 'privacy',
        title: 'Information We Collect',
        content:
          'We collect personal information you voluntarily provide when registering for an account, submitting a project inquiry, or contacting us — including your name, email address, phone number, and any project details you share with us.',
        order: 1,
      },
      {
        category: 'privacy',
        title: 'How We Use Your Information',
        content:
          'The information we collect is used to respond to your enquiries, deliver and improve our services, send relevant updates and newsletters (only with your consent), and comply with legal obligations.',
        order: 2,
      },
      {
        category: 'privacy',
        title: 'Data Sharing & Third Parties',
        content:
          'We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our platform, provided they agree to keep your information confidential.',
        order: 3,
      },
      {
        category: 'privacy',
        title: 'Cookies & Tracking',
        content:
          'Our website may use cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can choose to disable cookies through your browser settings, though this may affect certain features of the site.',
        order: 4,
      },
      {
        category: 'privacy',
        title: 'Data Security',
        content:
          'We implement industry-standard security measures to protect your personal data from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
        order: 5,
      },
      {
        category: 'privacy',
        title: 'Your Rights',
        content:
          'You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please contact us at the details provided on our Contact page.',
        order: 6,
      },
      {
        category: 'privacy',
        title: 'Changes to This Policy',
        content:
          'We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date. Continued use of our services after such changes constitutes your acceptance of the new policy.',
        order: 7,
      },
    ];

    await Policy.insertMany([...termsData, ...privacyData]);
    res.status(201).json({ message: 'Policies seeded successfully.', count: termsData.length + privacyData.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding policies', error });
  }
};
