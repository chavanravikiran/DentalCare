import { WebsiteSocialLink } from "./websiteSocialLink.model";

export interface WebsiteDetails {
    key: number;
    websiteName: string;
    websiteLogo: string;
    address: string;
    shortAddress: string;
    email: string;
    phone: string;
    openingHours: string;
    socialLinks: WebsiteSocialLink[];
}