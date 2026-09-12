/*
 * Square booking pipeline — Bare Esthetics.
 *
 * The verified, live Square checkout URL below is the single source of
 * truth for the entire booking journey: every "BOOK THIS TREATMENT"
 * link on the Page 2 treatment cards and the Page 4 scheduling portal
 * iframe both read from SQUARE_BOOKING_URL.
 */

export const SQUARE_BOOKING_URL =
  'https://book.squareup.com/appointments/35e74c3f-533c-4f15-8aca-4e1cc2ef8afd/location/0NB0EXKZ3FFNB/services?rwg_token=AE37R_jIzl6F9YeizmLHkyYvvo06Rtt-zLs_Odro9lIl5yUdOdrysVXicXy9QrXvilMc0XdahsXiQploaOEwcSDSEcRaEvOTzQQosTgO-syVQ3MzsWby99I%3D'

export const TREATMENTS = [
  {
    id: 'eyebrow-pmu',
    title: 'EYEBROW PMU ARTISTRY',
    description:
      'Bespoke permanent makeup artistry including microblading, ombré powder brows, and structural symmetry mapping. Restoring flawless feature definition using ultra-fine, hypoallergenic mineral pigments.',
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'paramedical-camouflage',
    title: 'PARAMEDICAL CAMOUFLAGE REVISION',
    description:
      'Advanced scar camouflage, vitiligo repigmentation, and stretch mark revision. We use custom-blended, medical-grade skin-tone pigments to seamlessly mask dermal differences and restore uniform skin texture.',
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'laser-precision',
    title: 'CLINICAL LASER PRECISION',
    description:
      "State-of-the-art permanent hair reduction and vascular skin clearing. High-efficiency laser targets root follicles with integrated cooling technology, delivering completely safe, pain-free results across all skin phototypes.",
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'pmu-refinement',
    title: 'PERMANENT MAKEUP & REFINEMENT',
    description:
      'Bespoke permanent makeup solutions including custom lip blushing, dark lip correction, and lash line enhancement designed to naturally define facial symmetry.',
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'medi-peels',
    title: 'ADVANCED CELLULAR MEDI-PEELS',
    description:
      'Medical-grade chemical peels and chemical resurfacing tailored to eliminate stubborn hyperpigmentation, active acne pathways, and environmental skin fatigue.',
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'hairline-smp',
    title: 'HAIRLINE RESTORATION & SMP',
    description:
      'Advanced Scalp Micropigmentation (SMP) to replicate natural hair follicles, dense-up thinning hairlines, and camouflage localized scalp hair thinning seamlessly.',
    link: SQUARE_BOOKING_URL,
  },
  {
    id: 'clinical-facials',
    title: 'CLINICAL FACIALS & REPAIR',
    description:
      'Custom dermaplaning, cellular dermal repair facials, and deep epidermal exfoliation designed to accelerate skin cell turnover and lock in a continuous glass-skin glow.',
    link: SQUARE_BOOKING_URL,
  },
]
