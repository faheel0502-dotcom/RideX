import { Request, Response } from 'express';
import prisma from '../config/db';

const DEFAULTS: Record<string, string> = {
  site_title: "RideX | Premium Motorcycle Gears & Accessories",
  navbar_brand: "RIDEX",
  footer_brand: "RIDEX",
  footer_text: "Engineered for the ride. Offering premium riding gear, helmets, jackets, and touring accessories.",
  contact_address: "RideX Performance Center, 100 Throttle Boulevard, New Delhi, India",
  contact_email: "support@ridex.com",
  contact_phone: "+91 98765 43210",
  about_hero_title: "ENGINEERED FOR UNCOMPROMISING SAFETY",
  about_hero_subtitle: "Our Mission",
  about_story_title: "THE RIDEX LEGACY",
  about_story_desc: "Founded in 2026, RideX was born from a simple obsession: to design motorcycle riding gear that sets new benchmarks in protection, ergonomics, and track-proven performance.",
  about_story_text1: "Every curve of our helmets, every stitch in our leather jackets, and every reinforcement on our riding boots is the result of meticulous engineering. We collaborate with MotoGP racers and adventure tourers to study impact points and joint flexibility.",
  about_story_text2: "Whether you are carving canyons, navigating daily city traffic, or setting lap times on the track, RideX ensures your focus remains entirely on the throttle. We build gear that protects your life, so you can enjoy the ride.",
  about_story_image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    const configMap: Record<string, string> = { ...DEFAULTS };

    configs.forEach(cfg => {
      configMap[cfg.key] = cfg.value;
    });

    return res.status(200).json(configMap);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching site config', error: error.message });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  const updates = req.body;

  if (typeof updates !== 'object' || updates === null) {
    return res.status(400).json({ message: 'Request body must be a key-value object' });
  }

  try {
    const promises = Object.entries(updates).map(([key, value]) => {
      return prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(promises);
    return res.status(200).json({ message: 'Site configuration updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating site config', error: error.message });
  }
};
