declare module "instagram-url-direct" {
  export function instagramGetUrl(url: string): Promise<{
    results_number?: number;
    post_info?: {
      owner_username?: string;
      owner_fullname?: string;
      is_verified?: boolean;
      is_private?: boolean;
      likes?: number;
      is_ad?: boolean;
    };
    url_list?: string[];
    media_details?: Array<{
      type?: "video" | "image";
      dimensions?: {
        height?: string;
        width?: string;
      };
      video_view_count?: number;
      url?: string;
      thumbnail?: string;
    }>;
  }>;
}

declare module "reelflow" {
  export class ReelflowError extends Error {
    status?: number;
  }

  export function getVideoInfo(url: string): Promise<{
    videoUrl?: string;
    width?: number;
    height?: number;
    thumbnailUrl?: string;
    thumbnail?: string;
  }>;
}

