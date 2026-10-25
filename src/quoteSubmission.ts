export type QuoteFormValues = {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  services: string[];
  details: string;
};

export type QuoteSubmissionPayload = {
  clientId: string;
  formName: 'quote';
  customer: { name: string; email: string };
  fields: {
    phone: string;
    eventType: string;
    eventDate: string;
    location: string;
    services: string[];
    details: string;
  };
  website: string;
};

type WorkerResponse = { success?: boolean; error?: string; submissionId?: string };

export function createQuoteSubmitter(fetcher: typeof fetch = fetch) {
  let inFlight = false;

  return async function submitQuote(
    endpoint: string,
    clientId: string,
    values: QuoteFormValues,
    website: string,
  ): Promise<string> {
    if (inFlight) throw new Error('An enquiry is already being submitted.');

    const name = values.fullName.trim();
    const email = values.email.trim();
    if (!name) throw new Error('Please enter your name.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address so we can respond to your enquiry.');
    }
    if (!endpoint.trim() || !clientId.trim()) throw new Error('The quote form is not configured.');

    const payload: QuoteSubmissionPayload = {
      clientId: clientId.trim(),
      formName: 'quote',
      customer: { name, email },
      fields: {
        phone: values.phone.trim(),
        eventType: values.eventType,
        eventDate: values.eventDate,
        location: values.location.trim(),
        services: values.services,
        details: values.details.trim(),
      },
      website,
    };

    inFlight = true;
    try {
      const response = await fetcher(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result: WorkerResponse;
      try {
        result = await response.json() as WorkerResponse;
      } catch {
        throw new Error('The enquiry service returned an unreadable response. Please try again.');
      }

      if (!response.ok || result.success !== true || !result.submissionId) {
        throw new Error(result.error || 'We could not submit your enquiry. Please try again.');
      }

      return result.submissionId;
    } finally {
      inFlight = false;
    }
  };
}
