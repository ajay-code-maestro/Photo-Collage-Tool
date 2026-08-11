let faceapi: any = null;
let modelsLoaded = false;

async function getFaceApi() {
  if (!faceapi) {
    faceapi = await import("@vladmandic/face-api");
  }
  return faceapi;
}

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;

  try {
    const api = await getFaceApi();
    await api.nets.tinyFaceDetector.loadFromUri("/models");
    modelsLoaded = true;
  } catch (error) {
    console.warn(
      "Face detection models failed to load. Falling back to center crop.",
      error
    );
  }
}

export async function detectFocalPoint(
  imageElement: HTMLImageElement
): Promise<{ x: number; y: number } | null> {
  if (!modelsLoaded) return null;

  try {
    const api = await getFaceApi();

    const detection = await api.detectSingleFace(
      imageElement,
      new api.TinyFaceDetectorOptions()
    );

    if (detection) {
      const { x, y, width, height } = detection.box;

      return {
        x: x + width / 2,
        y: y + height / 2,
      };
    }
  } catch (error) {
    console.error("Face detection failed during analysis", error);
  }

  return null;
}