export interface GridSlice {
  id: number;
  // Proportional width as percentage of the image width.
  // These approximate the visible vertical ripple divisions in the portrait.
  widthPct: number;
  type: 'image' | 'video';
  src: string;
  label: string;
}

export const gridSlices: GridSlice[] = [
  { id: 1, widthPct: 8.5, type: 'image', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20image-1.png', label: 'EYEBROW PMU' },
  { id: 2, widthPct: 11, type: 'image', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20image-2.png', label: 'CAMOUFLAGE' },
  { id: 3, widthPct: 9.5, type: 'image', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20image-3.png', label: 'LASER' },
  { id: 4, widthPct: 12, type: 'video', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20video-4.mp4', label: 'PMU LIPS' },
  { id: 5, widthPct: 10.5, type: 'video', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20video-5.mp4', label: 'MEDI-PEEL' },
  { id: 6, widthPct: 11.5, type: 'video', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20video-6.mp4', label: 'HAIRLINE' },
  { id: 7, widthPct: 10, type: 'video', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20video-7.mp4', label: 'FACIAL' },
  { id: 8, widthPct: 13.5, type: 'video', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20video-8.mp4', label: 'DERMAPLANE' },
  { id: 9, widthPct: 13.5, type: 'image', src: 'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/grid%20image-9.png', label: 'GLOW' },
]

export interface ServiceCard {
  id: number
  title: string
  description: string
  bookingUrl: string
}

export const serviceCards: ServiceCard[] = [
  {
    id: 1,
    title: 'EYEBROW PMU ARTISTRY',
    description: 'Bespoke permanent makeup artistry including microblading, ombré powder brows, and structural symmetry mapping. Restoring flawless feature definition using ultra-fine, hypoallergenic mineral pigments.',
    bookingUrl: 'https://cal.com/bare-esthetics/eyebrow',
  },
  {
    id: 2,
    title: 'PARAMEDICAL CAMOUFLAGE REVISION',
    description: 'Advanced scar camouflage, vitiligo repigmentation, and stretch mark revision. We use custom-blended, medical-grade skin-tone pigments to seamlessly mask dermal differences and restore uniform skin texture.',
    bookingUrl: 'https://cal.com/bare-esthetics/paramedical',
  },
  {
    id: 3,
    title: 'CLINICAL LASER PRECISION',
    description: 'State-of-the-art permanent hair reduction and vascular skin clearing. High-efficiency laser targets root follicles with integrated cooling technology, delivering completely safe, pain-free results across all skin phototypes.',
    bookingUrl: 'https://cal.com/bare-esthetics/laser',
  },
  {
    id: 4,
    title: 'PERMANENT MAKEUP & REFINEMENT',
    description: 'Bespoke permanent makeup solutions including custom lip blushing, dark lip correction, and lash line enhancement designed to naturally define facial symmetry.',
    bookingUrl: 'https://cal.com/bare-esthetics/pmu',
  },
  {
    id: 5,
    title: 'ADVANCED CELLULAR MEDI-PEELS',
    description: 'Medical-grade chemical peels and chemical resurfacing tailored to eliminate stubborn hyperpigmentation, active acne pathways, and environmental skin fatigue.',
    bookingUrl: 'https://cal.com/bare-esthetics/peel',
  },
  {
    id: 6,
    title: 'HAIRLINE RESTORATION & SMP',
    description: 'Advanced Scalp Micropigmentation (SMP) to replicate natural hair follicles, dense-up thinning hairlines, and camouflage localized scalp hair thinning seamlessly.',
    bookingUrl: 'https://cal.com/bare-esthetics/hairline',
  },
  {
    id: 7,
    title: 'CLINICAL FACIALS & REPAIR',
    description: 'Custom dermaplaning, cellular dermal repair facials, and deep epidermal exfoliation designed to accelerate skin cell turnover and lock in a continuous glass-skin glow.',
    bookingUrl: 'https://cal.com/bare-esthetics/facial',
  },
]

export interface Testimonial {
  id: number
  text: string
  author: string
  source: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: 'Natacha completely transformed my confidence! The paramedical scar camouflage she performed is absolute magic. You literally cannot tell where the scar was.',
    author: 'Sarah M.',
    source: 'Google Review',
  },
  {
    id: 2,
    text: 'The best ombré powder brows in Queens, hands down. Absolute precision and perfect symmetry. The studio is stunningly beautiful and pristine.',
    author: 'Jessica T.',
    source: 'Yelp Review',
  },
  {
    id: 3,
    text: 'Pain-free laser hair removal that actually works on darker skin tones safely. Professional, brilliant medical grade diagnostics.',
    author: 'David K.',
    source: 'Google Review',
  },
]
