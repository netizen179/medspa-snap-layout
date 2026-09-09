/*
 * Cal.com booking pipeline — Bare Esthetics.
 *
 * The Cal.com handle/event paths below are placeholders wired to our
 * custom Cal.com treatment directories. Replace `bare-esthetics` with the
 * live workspace handle (or swap the full URLs) once the directories are
 * published — every "BOOK THIS TREATMENT" link and the Page-4 scheduling
 * iframe read from this single source of truth.
 */

const CAL_BASE = 'https://cal.com/bare-esthetics'

export const CAL_COM_EVENT_URL = `${CAL_BASE}/30min`

export const TREATMENTS = [
  {
    id: 'eyebrow-pmu',
    title: 'EYEBROW PMU ARTISTRY',
    description:
      'Bespoke permanent makeup artistry including microblading, ombré powder brows, and structural symmetry mapping. Restoring flawless feature definition using ultra-fine, hypoallergenic mineral pigments.',
    link: `${CAL_BASE}/eyebrow-pmu`,
  },
  {
    id: 'paramedical-camouflage',
    title: 'PARAMEDICAL CAMOUFLAGE REVISION',
    description:
      'Advanced scar camouflage, vitiligo repigmentation, and stretch mark revision. We use custom-blended, medical-grade skin-tone pigments to seamlessly mask dermal differences and restore uniform skin texture.',
    link: `${CAL_BASE}/paramedical-camouflage`,
  },
  {
    id: 'laser-precision',
    title: 'CLINICAL LASER PRECISION',
    description:
      "State-of-the-art permanent hair reduction and vascular skin clearing. High-efficiency laser targets root follicles with integrated cooling technology, delivering completely safe, pain-free results across all skin phototypes.",
    link: `${CAL_BASE}/laser`,
  },
  {
    id: 'pmu-refinement',
    title: 'PERMANENT MAKEUP & REFINEMENT',
    description:
      'Bespoke permanent makeup solutions including custom lip blushing, dark lip correction, and lash line enhancement designed to naturally define facial symmetry.',
    link: `${CAL_BASE}/pmu-lips`,
  },
  {
    id: 'medi-peels',
    title: 'ADVANCED CELLULAR MEDI-PEELS',
    description:
      'Medical-grade chemical peels and chemical resurfacing tailored to eliminate stubborn hyperpigmentation, active acne pathways, and environmental skin fatigue.',
    link: `${CAL_BASE}/medi-peels`,
  },
  {
    id: 'hairline-smp',
    title: 'HAIRLINE RESTORATION & SMP',
    description:
      'Advanced Scalp Micropigmentation (SMP) to replicate natural hair follicles, dense-up thinning hairlines, and camouflage localized scalp hair thinning seamlessly.',
    link: `${CAL_BASE}/smp-hairline`,
  },
  {
    id: 'clinical-facials',
    title: 'CLINICAL FACIALS & REPAIR',
    description:
      'Custom dermaplaning, cellular dermal repair facials, and deep epidermal exfoliation designed to accelerate skin cell turnover and lock in a continuous glass-skin glow.',
    link: `${CAL_BASE}/clinical-facials`,
  },
]
