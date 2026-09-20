export const SPONSOR_EMAIL = 'gdgilorincmty@gmail.com'

const SPONSOR_SUBJECT = 'Sponsorship Inquiry - DevFest Ilorin 2026'

const SPONSOR_BODY = `Hello GDG Ilorin Team,

I am interested in exploring sponsorship opportunities for DevFest Ilorin 2026.

Company/Organization:
Contact Person:
Phone Number:

Please share more details on sponsorship packages and next steps.

Thank you.`

/**
 * Prefilled sponsorship enquiry, shared by the hero and the sponsors section.
 */
export const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(SPONSOR_SUBJECT)}&body=${encodeURIComponent(SPONSOR_BODY)}`
