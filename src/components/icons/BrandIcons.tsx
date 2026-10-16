import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const WhatsAppIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.014 2C6.486 2 2 6.486 2 12.014c0 1.983.575 3.916 1.66 5.578L2.06 22.5l4.995-1.563a10 10 0 0 0 4.96 1.328h.005c5.528 0 10.014-4.486 10.014-10.014C22.032 6.486 17.542 2 12.014 2zm5.877 15.891c-.244.687-1.415 1.34-1.953 1.417-.499.072-1.144.102-1.847-.117-.426-.132-.973-.312-1.674-.611-2.943-1.27-4.868-4.243-5.017-4.442-.148-.198-1.212-1.611-1.212-3.074 0-1.463.767-2.183 1.04-2.48.272-.297.594-.372.792-.372.198 0 .397.002.57.01.183.01.427-.07.669.51.248.594.842 2.058.917 2.207.075.148.124.322.025.52-.1.199-.15.322-.298.497-.148.173-.311.387-.446.52-.148.148-.302.31-.13.606.174.298.77 1.271 1.654 2.059 1.134 1.012 2.092 1.325 2.39 1.475.297.148.47.124.644-.075.173-.198.744-.867.94-1.164.198-.298.396-.25.669-.15.272.1 1.734.818 2.03.967.297.149.495.223.57.347.075.124.075.719-.169 1.413z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12.06C22 6.507 17.523 2 12 2S2 6.507 2 12.06c0 5.017 3.657 9.176 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.876h2.773l-.443 2.91h-2.33V22c4.781-.764 8.437-4.923 8.437-9.94z" />
  </svg>
);

export const TwitterIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/** Réseaux sociaux de Nomeryc — URLs à ajuster une fois les comptes officiels créés. */
export const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://facebook.com/nomeryc', Icon: FacebookIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/nomeryc', Icon: LinkedinIcon },
  { name: 'Instagram', href: 'https://instagram.com/nomeryc', Icon: InstagramIcon },
  { name: 'YouTube', href: 'https://youtube.com/@nomeryc', Icon: YoutubeIcon },
] as const;
