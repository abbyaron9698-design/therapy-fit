type BuildLinkArgs = {
  url: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export function buildTrackedLink({
  url,
  utmSource = "therapy-fit",
  utmMedium = "referral",
  utmCampaign = "results",
  utmContent,
}: BuildLinkArgs) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", utmSource);
    u.searchParams.set("utm_medium", utmMedium);
    u.searchParams.set("utm_campaign", utmCampaign);
    if (utmContent) u.searchParams.set("utm_content", utmContent);
    return u.toString();
  } catch {
    // If url is malformed, just return it
    return url;
  }
}
