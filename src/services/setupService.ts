import { apiClient } from "./apiClient";
import {
  SetupData,
  SetupSavePayload,
} from "@/types/memory";


export const setupService = {
  // ---------------------------------------------------------
  // START SETUP
  // ---------------------------------------------------------

  startSetup: (
    memoryId: string,
    email: string
  ) =>
    apiClient.post<{
      setup_token: string;
      expires_in_minutes: number;
    }>(
      `/api/memory/${memoryId}/setup/start`,
      { email }
    ),


  // ---------------------------------------------------------
  // GET CURRENT SETUP DATA
  // ---------------------------------------------------------

  getSetupData: (
    memoryId: string,
    token: string
  ) =>
    apiClient.get<SetupData>(
      `/api/memory/${memoryId}/setup`,
      { token }
    ),


  // ---------------------------------------------------------
  // SAVE SETUP DATA
  // ---------------------------------------------------------

  // IMPORTANT:
  // stories replaces the complete stories array
  // on the backend.
  saveSetup: (
    memoryId: string,
    token: string,
    payload: SetupSavePayload
  ) =>
    apiClient.put<SetupData>(
      `/api/memory/${memoryId}/setup`,
      payload,
      { token }
    ),


  // ---------------------------------------------------------
  // UPLOAD IMAGE
  // ---------------------------------------------------------

  // Uploads the file to S3 and returns only its URL.
  //
  // The caller decides whether that URL belongs in:
  //
  // story.image_url
  //
  // or:
  //
  // story.content_images[]
  uploadImage: (
    memoryId: string,
    token: string,
    file: File
  ) => {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    return apiClient.post<{
      file_url: string;
    }>(
      `/api/memory/${memoryId}/setup/images`,
      formData,
      {
        token,
        isFormData: true,
      }
    );
  },


  // ---------------------------------------------------------
  // COMPLETE / PUBLISH
  // ---------------------------------------------------------

  completeSetup: (
    memoryId: string,
    token: string,
    pin: string
  ) =>
    apiClient.post<SetupData>(
      `/api/memory/${memoryId}/setup/complete`,
      { pin },
      { token }
    ),
};