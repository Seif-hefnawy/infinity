// Local, editable draft used across the setup wizard's 3 steps. Carries a
// client-side id for React keys/state updates only - the backend assigns
// its own id to each story when the wizard finally saves it.
export interface StoryDraft {
  localId: string;
  title: string;
  date: string;
  image_url: string; // cover/carousel image, set in Step 1
  content: string; // story message/description, set in Step 2
  content_images: string[]; // up to 3 memory images, set in Step 2
  spotify_url: string; // this story's own song, set in Step 2
}

export const MAX_STORIES = 5;
export const MAX_CONTENT_IMAGES_PER_STORY = 3;
