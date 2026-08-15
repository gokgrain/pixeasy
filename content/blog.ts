export type BlogPost = { slug:string; title:string; excerpt:string; published:string; reviewed:string; image:string; imageAlt:string };

export const blogPosts:BlogPost[]=[{
  slug:"us-passport-photo-requirements",
  title:"U.S. Passport Photo Requirements: Size, Smile & Rules",
  excerpt:"Check the official size, expression, glasses, background, and digital photo rules before you submit a U.S. passport application.",
  published:"August 15, 2026", reviewed:"August 2026",
  image:"/us-passport-photo-requirements-examples.png",
  imageAlt:"Acceptable and unacceptable U.S. passport photo examples",
}];

export const passportFaqs=[
  {question:"What size should a U.S. passport photo be?",answer:"A printed U.S. passport photo must be 2 × 2 inches (51 × 51 mm). The head must measure 1 to 1⅜ inches (25 to 35 mm) from the bottom of the chin to the top of the head."},
  {question:"Can I smile in a U.S. passport photo?",answer:"A natural smile is acceptable if your mouth is closed and both eyes remain open. Avoid exaggerated expressions or a wide, open-mouth smile."},
  {question:"Do my ears need to show in a passport photo?",answer:"No. The published U.S. passport photo requirements do not say that both ears must be visible. Your full face must be clearly visible and you must face the camera directly."},
  {question:"Can my hair or bangs cover my eyebrows?",answer:"The rules do not specifically require visible eyebrows, but hair must not cover your eyes or obscure your face. Keep your eyes open, visible, and free from shadows."},
  {question:"Can I wear glasses in a U.S. passport photo?",answer:"Generally, no. Remove eyeglasses, sunglasses, and tinted glasses. A rare medical exception requires a signed statement from a medical professional."},
  {question:"Can I wear a hat or head covering?",answer:"Hats and head coverings are generally not allowed. Religious or medical exceptions require a signed statement, and the covering must not hide your face or cast shadows."},
  {question:"What background is required?",answer:"Use a plain white or off-white background with no objects, patterns, textures, or shadows. Lighting should be even and the image should not be overexposed or underexposed."},
  {question:"Can I edit or retouch my passport photo?",answer:"Do not use software, apps, filters, or AI to change your appearance, remove or add facial features, alter the outline of your head, or replace the background. Basic cropping and positioning are acceptable when they do not alter the image itself."},
  {question:"What file formats work for an online passport renewal photo?",answer:"The State Department currently accepts JPG, JPEG, PNG, HEIC, and HEIF files between 54 KB and 10 MB for online renewal. The photo tool performs basic checks, but a passport employee still reviews the image."},
] as const;
