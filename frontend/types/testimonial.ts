/** GET /api/v1/testimonials — one row. */
export interface Testimonial {
  id: number;
  quote: string;
  author_name: string | null;
  author_title: string | null;
  author_company: string | null;
}
